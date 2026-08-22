# Colibrí OS — Frontend

Aplicación web de Colibrí OS construida con Next.js 16 (App Router), React 19 y Tailwind CSS 4. Consume la API del backend en `colibri_os_back`.

## Requisitos

- Node.js 22
- npm 10 o compatible con el `package-lock.json`
- Backend de Colibrí OS ejecutándose en `http://localhost:3000`

## Configuración local

1. Instalar dependencias:

   ```powershell
   npm ci
   ```

2. Crear el archivo de entorno:

   ```powershell
   Copy-Item .env.example .env
   ```

   Completar los valores. Las variables obligatorias son:

   | Variable | Descripción | Ejemplo |
   | --- | --- | --- |
   | `NEXT_PUBLIC_BACKEND_URL` | URL base de la API backend (incluye `/api/v1`) | `http://localhost:3000/api/v1` |
   | `PINATA_JWT` | Token JWT de Pinata para subir archivos a IPFS | (obtener de pinata.cloud) |
   | `NEXT_PUBLIC_GATEWAY_URL` | Dominio del gateway Pinata para leer archivos IPFS | `mi-gateway.mypinata.cloud` |

3. Iniciar en modo desarrollo:

   ```powershell
   npm run dev
   ```

4. Abrir [http://localhost:3001](http://localhost:3001) en el navegador.

## Comandos

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en puerto 3001 |
| `npm run build` | Compilar para producción |
| `npm run start` | Iniciar la build de producción en puerto 3001 |
| `npm run lint` | Ejecutar ESLint |
| `npm run test` | Ejecutar tests en modo watch (Vitest) |
| `npm run test:run` | Ejecutar tests una sola vez |

## Puertos

| Servicio | Puerto | Configurado en |
| --- | --- | --- |
| Frontend (dev/prod) | **3001** | `package.json` (`next dev -p 3001`) |
| Backend API | 3000 | `colibri_os_back/.env` |
| PostgreSQL | 5432 | `colibri_os_back/.env` |

## Arquitectura

```
client/
├── app/                  # App Router (rutas y páginas)
├── src/
│   ├── components/       # Componentes React
│   ├── lib/              # Utilidades, API client, hooks
│   ├── hooks/            # Custom hooks
│   ├── store/            # Estado global (Zustand)
│   └── docs/             # Documentación interna
├── public/               # Assets estáticos
└── vitest.config.js      # Configuración de tests
```

### Stack tecnológico

| Categoría | Tecnología |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, Framer Motion 12 |
| Estado global | Zustand 5 (persistido en localStorage) |
| Estado del servidor | TanStack React Query 5 |
| HTTP | Axios 1.13 |
| Formularios | React Hook Form 7 + Zod 4 |
| Testing | Vitest 4 + @testing-library/react + MSW 2 |
| i18n | Hook personalizado `useTranslation` con archivos `es.json` / `en.json` |

## Testing

Los tests usan Vitest con entorno `jsdom`, MSW para mocks de API y `@testing-library/react` para rendering.

```powershell
# Ejecutar tests en watch
npm run test

# Ejecutar tests una vez
npm run test:run
```

Los mocks de API se encuentran en `src/lib/api/__tests__/setup.js`.

## Variables sensibles

- `PINATA_JWT`: token de autenticación para IPFS. No commitear el `.env` real.
- `NEXT_PUBLIC_GATEWAY_URL`: dominio del gateway. Es público (`NEXT_PUBLIC_`) pero debe mantenerse actualizado.

## Deploy

El frontend se despliega por separado del backend. En producción, `NEXT_PUBLIC_BACKEND_URL` debe apuntar a la URL de Render del backend:

```
NEXT_PUBLIC_BACKEND_URL=https://colibri-os-back.onrender.com/api/v1
```
