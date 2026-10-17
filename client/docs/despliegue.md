# Despliegue

## Stack

- **Docker** — imagen multi-stage (`node:22-alpine`).
- **Dokploy** — orquestador en el VPS.
- **Traefik** — reverse proxy + Let's Encrypt (lo maneja Dokploy).

## Dockerfile

Multi-stage: `deps` → `builder` → `runner`. Expone `3031` y corre
`node server.js` (requiere `output: 'standalone'` en Next).

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3031
ENV HOSTNAME=0.0.0.0
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3031
CMD ["node", "server.js"]
```

> ⚠️ **Prerequisito:** el `next.config.mjs` debe tener
> `output: 'standalone'`. Actualmente **no lo tiene** — ver
> [`known-issues.md`](./known-issues.md).

## Docker Compose

```yaml
services:
  colibri-client:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_BACKEND_URL: ${NEXT_PUBLIC_BACKEND_URL}
    container_name: ${CONTAINER_NAME:-colibri-client}
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3031
      HOSTNAME: 0.0.0.0
      NEXT_PUBLIC_BACKEND_URL: ${NEXT_PUBLIC_BACKEND_URL}
    expose:
      - "3031"
    networks:
      - colibri-network

networks:
  colibri-network:
    name: ${NETWORK_NAME:-colibri-network}
```

## Variables del build

> Las variables `NEXT_PUBLIC_*` se **incrustan en el bundle durante el
> build**. Cambiarlas requiere **rebuild**, no solo restart.

| Variable | Debe setearse en |
|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | Build args **y** environment runtime |
| `COLIBRI_CLIENT_PORT` | Runtime (compose) |

## Dokploy

1. Crear aplicación Compose `colibri-client`.
2. Conectar el repositorio GitHub.
3. Seleccionar la rama de despliegue.
4. Definir variables de entorno en el panel de Dokploy (no en Git).
5. En **Domains**: agregar el host, container port `3031`, HTTPS on.
6. Activar Auto Deploy + webhook de GitHub.

## Promoción de releases

Ver documento legacy
[`colibri-github-dokploy-dev-demo.md`](../colibri-github-dokploy-dev-demo.md)
para el flujo completo con `develop` / `demo` / tags. **Ese flujo
todavía no está implementado** en el repo (no existe
`.github/workflows/promote-demo.yml`).

## Rollback

1. **Dokploy:** redeplegar el commit anterior desde el panel.
2. **Docker local:** `docker compose down && git checkout <sha> && docker compose up --build`.
3. **Frontend estático:** no aplica (SSR + cookies).

## Troubleshooting de despliegue

Ver [`troubleshooting.md`](./troubleshooting.md) → sección **404 en el
dominio**.
