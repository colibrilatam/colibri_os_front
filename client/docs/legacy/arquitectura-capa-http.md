# Arquitectura de capa de datos HTTP — Colibri Frontend

## Resumen

Todas las llamadas HTTP productivas del frontend pasan por un cliente
centralizado basado en **axios** ubicado en `src/lib/api/client.js`.
Esto reemplaza los usos dispersos de `fetch`, `axios` y `fetcher` que
coexistían previamente, unificando autenticación, errores, trazabilidad
y cancelación.

## Estructura de archivos

```
src/lib/api/
├── client.js          # Instancia axios con interceptores de request/response
├── errors.js          # Clase ApiError normalizada
├── types.js           # JSDoc typedefs y códigos de error (ERROR_CODES)
├── token.js           # Lectura/escritura centralizada del JWT
├── requestId.js       # Generación de ID de correlación por llamada
├── logger.js          # Logging condicional de requests/responses (solo dev)
├── cloudinary.js      # Helper para subida de archivos a Cloudinary
└── index.js           # Barrel file con exports públicos
```

## Flujo de una request

```
[Componente / Hook]
    │
    ▼
[Servicio]  ────  apiClient.get/post/put/patch/delete
    │
    ▼
[Interceptor de request]
    ├─ Genera x-request-id
    ├─ Inyecta Authorization: Bearer <token>
    └─ Log de salida (solo dev)
    │
    ▼
[Backend NestJS]
    │
    ▼
[Interceptor de response]
    ├─ Si 2xx → devuelve response.data al servicio
    └─ Si error → lanza ApiError normalizado
         ├─ 401 → logout automático
         ├─ 4xx/5xx → ApiError con status y detalles del backend
         └─ Error de red / timeout → ApiError con isNetworkError = true
```

## ApiError — Formato de error común

```js
class ApiError extends Error {
  code;           // "UNAUTHORIZED" | "VALIDATION_ERROR" | "NETWORK_ERROR" | ...
  message;        // Mensaje legible para el usuario
  status;         // HTTP status code (null en errores de red)
  details;        // Payload original del backend (ej. array de validaciones)
  requestId;      // ID de correlación para debug
  isNetworkError; // true si fue error de red/timeout (sin response del backend)
}
```

### Códigos de error (`ERROR_CODES`)

| Código | Origen HTTP |
|---|---|
| `UNAUTHORIZED` | 401 |
| `FORBIDDEN` | 403 |
| `NOT_FOUND` | 404 |
| `CONFLICT` | 409 |
| `VALIDATION_ERROR` | 422 |
| `SERVER_ERROR` | 5xx |
| `NETWORK_ERROR` | Sin respuesta (red caída) |
| `TIMEOUT` | Timeout de axios |
| `UNKNOWN_ERROR` | Fallback |

## Manejo de token JWT

La sesión se gestiona desde `src/lib/api/token.js`.

- **Lectura:** en SSR usa `next/headers`, en cliente lee la cookie `token`.
- **Expiración:** si el token expiró, se limpia la cookie y se devuelve `null`.
- **Inyección:** el interceptor de request agrega `Authorization: Bearer <token>`
  automáticamente si el token existe.
- **101:** el interceptor de response llama a `clearToken()` y ejecuta
  `logoutCallback` (registrable vía `setLogoutCallback`).
- No hay refresh token. El backend no lo expone actualmente. Si se agrega en
  el futuro, el interceptor de 401 será el punto de integración.

## Trazabilidad

Cada request recibe un `x-request-id` único (formato `timestamp-contador-random`)
inyectado como header. El mismo ID se incluye en el `ApiError` en caso de fallo,
permitiendo correlacionar errores del frontend con logs del backend.

En desarrollo se loguean en consola:
```
[API] → [mh2x4k-0001-abc123] POST /auth/signin
[API] ← [mh2x4k-0001-abc123] 201 POST http://localhost:3000/api/v1/auth/signin (45ms)
```

En producción los logs se omiten automáticamente.

## Capa de servicios

Los servicios están en `src/services/` y son la única interfaz que usan
componentes y hooks para comunicarse con el backend.

**Patrón:**
```js
// src/services/user.js
import { apiClient } from '@/lib/api';

export const userService = {
  profile: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },
};
```

**Servicios migrados:**

| Servicio | Endpoints | Métodos HTTP |
|---|---|---|
| `authService` | `/auth/signup`, `/auth/signin` | POST |
| `userService` | `/users/profile`, `/users/:id` | GET |
| `projectsService` | 23 endpoints (CRUD proyectos, tramos, pacs, micro-acciones, evidencias, reputación) | GET, POST, PUT, PATCH, DELETE |
| `evidencesService` | `/evidence`, `/evidence/:id/submit`, `/evaluations`, `/evaluations/rubrics/active`, `/evaluations/finalize` | GET, POST |
| `nftService` | `/mecenas-semilla/dashboard/:id`, `/mecenas-semilla/buy-nfts/:id`, `/nft-projects/:id`, `/nft-projects` | GET, POST |
| `translationService` | `/api/translate` | POST (usa `fetch` — ver excepciones) |

## Excepciones a la capa centralizada

| Ubicación | Transporte | Justificación |
|---|---|---|
| `src/services/translation.js` | `fetch` nativo | Llama a ruta interna de Next.js (`/api/translate`), no al backend. Los errores se normalizan manualmente a `ApiError`. |
| `src/lib/api/cloudinary.js` | `fetch` nativo | Subida de archivos a Cloudinary con `FormData`, no compatible con el cliente axios. Usa `ApiError` normalizado. |
| `src/app/api/translate/route.js` | `fetch` nativo | Route Handler de Next.js en el servidor. Llama a la API externa de MyMemory. |

## ESLint

La regla `no-restricted-syntax` en `eslint.config.mjs` prohíbe en
`src/services/` y `src/hooks/`:
- `CallExpression[callee.name='fetch']` — uso de `fetch()` directo
- `ImportDeclaration[source.value='axios']` — import de axios
- `ImportDeclaration[source.value='@/lib/fetcher']` — import de fetcher legacy

Excepción: `src/services/translation.js` está excluido.

## Testing

**Framework:** Vitest + MSW (Mock Service Worker) + jsdom

**Scripts:**
```bash
npm test           # Modo watch
npm run test:run   # Single run
```

**Cobertura actual:** 74 tests en 11 archivos.

| Categoría | Archivo de test | Tests |
|---|---|---|
| Cliente axios | `src/lib/api/__tests__/client.test.js` | 10 |
| ApiError | `src/lib/api/__tests__/errors.test.js` | 6 |
| Cloudinary | `src/lib/api/__tests__/cloudinary.test.js` | 5 |
| Servicios | `src/services/__tests__/*.test.js` | 40 |
| Hooks | `src/hooks/__tests__/*.test.js` | 13 |

**Estrategia de test por servicio:**
- Mockear `apiClient` con `vi.mock('@/lib/api')`
- Verificar que el método correcto y URL se llaman
- Verificar transformación de respuesta (`response.data`)
- Verificar propagación de `ApiError`

**Estrategia de test de hooks:**
- Mockear servicios y store de Zustand
- Verificar manejo de flujos exitosos y de error
- Verificar que `ApiError` se convierte a mensaje de usuario

## Cancelación de requests

El cliente acepta `signal` (AbortSignal) en la configuración:
```js
const controller = new AbortController();
client.get('/endpoint', { signal: controller.signal });
controller.abort();
```

Las requests canceladas lanzan `ApiError` con `message: 'Request cancelada'`.

## Configuración

| Parámetro | Valor | Ubicación |
|---|---|---|
| `baseURL` | `NEXT_PUBLIC_BACKEND_URL` | `client.js:18` |
| `timeout` | 30000 ms | `client.js:8` |
| `Content-Type` | `application/json` | `client.js:21` |
| `Accept` | `application/json` | `client.js:22` |

## Archivos eliminados (legacy)

- `src/lib/fetcher.js` — wrapper sobre `fetch`
- `src/lib/axios.js` — instancia axios sin interceptores
- `src/lib/store/` — directorio duplicado de Zustand (se usa `store.js`)
