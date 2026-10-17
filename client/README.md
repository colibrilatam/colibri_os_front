# Colibrí — Frontend

Cliente web de **Colibrí** — plataforma de emprendedurismo regenerativo
con evaluación por pares, micro-acciones y una capa de financiamiento vía
NFTs para mecenas.

- **Framework:** Next.js 16 (App Router) + React 19
- **Estado remoto:** TanStack Query v5
- **Estado UI:** Zustand
- **HTTP:** axios (cliente centralizado)
- **Contratos:** Zod v4 generado desde OpenAPI del backend
- **Testing:** Vitest + MSW + jsdom
- **Puerto de desarrollo:** `3031` (no 3000)

> **Documentación completa:** [`docs/README.md`](./docs/README.md)

---

## Quickstart

### Requisitos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 22 |
| npm | 10 |

El backend de Colibrí debe estar accesible (local o producción). Ver
[`docs/entornos.md`](./docs/entornos.md).

### Instalación

```bash
git clone <repo-url> colibri_os_front
cd colibri_os_front/client
npm install
cp .env.example .env.local
# Editar .env.local con la URL del backend (ver docs/variables-entorno.md)
npm run dev
```

Abrir **http://localhost:3031**.

### Comandos

Todos los comandos verificados contra `package.json`:

| Comando | Qué hace | Puerto |
|---|---|---|
| `npm run dev` | Servidor de desarrollo | **3031** |
| `npm run build` | Build de producción | — |
| `npm run start` | Servidor de producción | **3031** |
| `npm run lint` | ESLint | — |
| `npm test` | Vitest (watch) | — |
| `npm run test:run` | Vitest (single run) | — |

> ⚠️ El frontend corre en **3031**, no en 3000. El puerto 3000 suele
> corresponder al backend NestJS en desarrollo.

### Variables de entorno mínimas

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000/api/v1
COLIBRI_CLIENT_PORT=3031
```

Ver [`docs/variables-entorno.md`](./docs/variables-entorno.md) para la
lista completa y cómo afectan a build vs runtime.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, Framer Motion |
| Estado remoto | TanStack Query v5 |
| Estado global UI | Zustand |
| Formularios | React Hook Form + Zod |
| HTTP | axios (`src/lib/api/client.js`) |
| Contratos | `@colibri/contracts` (Zod v4 desde OpenAPI) |
| Gráficos | Recharts |
| Testing | Vitest + MSW + Testing Library + jsdom |
| Lint / format | ESLint 9 + Prettier (manual) |

---

## Estructura del repositorio

```
colibri_os_front/
└── client/                    ← este proyecto
    ├── src/
    │   ├── app/               # App Router (rutas)
    │   ├── components/        # Componentes de UI
    │   ├── design-system/     # Tokens y primitivas
    │   ├── hooks/             # Hooks de queries/mutations
    │   ├── lib/
    │   │   ├── api/           # Cliente HTTP centralizado
    │   │   └── contracts/     # Schemas Zod generados
    │   ├── locales/           # i18n
    │   ├── services/          # Capa de servicios
    │   └── test/              # Utilidades de test
    ├── docs/                  # Documentación (este índice)
    ├── public/
    ├── Dockerfile
    ├── docker-compose.yml
    ├── next.config.mjs
    ├── package.json
    └── vitest.config.js
```

---

## Documentación

| Documento | Contenido |
|---|---|
| [`docs/README.md`](./docs/README.md) | Índice general |
| [`docs/quickstart.md`](./docs/quickstart.md) | Puesta en marcha paso a paso |
| [`docs/arquitectura.md`](./docs/arquitectura.md) | Capas + diagrama |
| [`docs/variables-entorno.md`](./docs/variables-entorno.md) | Todas las variables |
| [`docs/entornos.md`](./docs/entornos.md) | Local y producción |
| [`docs/autenticacion.md`](./docs/autenticacion.md) | JWT, cookie, Google OAuth |
| [`docs/roles.md`](./docs/roles.md) | Roles y protección de rutas |
| [`docs/contratos.md`](./docs/contratos.md) | `@colibri/contracts` |
| [`docs/web3.md`](./docs/web3.md) | NFTs, Cloudinary, IPFS |
| [`docs/i18n.md`](./docs/i18n.md) | Internacionalización |
| [`docs/testing.md`](./docs/testing.md) | Vitest + MSW |
| [`docs/despliegue.md`](./docs/despliegue.md) | Docker + Dokploy |
| [`docs/troubleshooting.md`](./docs/troubleshooting.md) | Errores comunes |
| [`docs/known-issues.md`](./docs/known-issues.md) | Deuda técnica referenciada |

---

## Contribuir

1. Rama desde `develop`.
2. PR contra `develop`.
3. `npm run lint` y `npm run test:run` deben pasar.
4. Adjuntar evidencia técnica en el PR (logs, screenshots, walkthrough).

---

## Deuda técnica conocida

Ver [`docs/known-issues.md`](./docs/known-issues.md) y el informe
original [`Deuda-tecnica-frontend.md`](./Deuda-tecnica-frontend.md).
