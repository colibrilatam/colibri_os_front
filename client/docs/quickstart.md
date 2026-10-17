# Quickstart

Guía para poner el frontend en marcha desde una máquina limpia.

## 1. Requisitos

| Herramienta | Versión | Notas |
|---|---|---|
| Node.js | 22 LTS | Según Dockerfile (`node:22-alpine`) |
| npm | 10+ | `package-lock.json` está commiteado |
| Git | cualquiera reciente | — |

Comprobalo:

```bash
node -v   # v22.x
npm -v    # 10.x o superior
```

## 2. Clonar

```bash
git clone <repo-url> colibri_os_front
cd colibri_os_front/client
```

> El frontend vive dentro de `client/`. La raíz del repo es un
> contenedor del monorepo.

## 3. Instalar dependencias

```bash
npm install
```

## 4. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Editá `.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000/api/v1
COLIBRI_CLIENT_PORT=3031
```

**Backend local:** el backend NestJS corre por defecto en el puerto
`3000` (ver `process.env.PORT ?? 3000` en `main.ts`). El prefijo global
es `api/v1`.

**Backend remoto:** usá `https://api.colibrilatam.io/api/v1` y
asegurate de que el backend tenga tu origen en `FRONTEND_URLS` para CORS.

Detalle completo en [`variables-entorno.md`](./variables-entorno.md).

## 5. Correr en desarrollo

```bash
npm run dev
```

Salida esperada:

```
▲ Next.js 16.x
- Local:   http://localhost:3031
```

Abrir **http://localhost:3031**.

## 6. Verificar que todo funciona

1. La home redirige al login si no hay sesión.
2. `POST /api/v1/auth/signin` responde 200 y setea la cookie
   `colibri_access_token` (HttpOnly).
3. La consola del navegador no arroja errores de CORS.
4. El botón **Iniciar sesión con Google** redirige a
   `${NEXT_PUBLIC_BACKEND_URL}/auth/google`.

Si algo falla → [`troubleshooting.md`](./troubleshooting.md).

## 7. Tests

```bash
npm run test:run
```

## 8. Build de producción (opcional)

```bash
npm run build
npm run start
```

## 9. Docker (opcional)

```bash
docker compose up --build
```

Ver [`despliegue.md`](./despliegue.md).
