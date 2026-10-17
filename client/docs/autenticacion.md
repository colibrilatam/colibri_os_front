# Autenticación

## Modelo

- El backend emite un **JWT** y lo setea en una cookie **HttpOnly**
  llamada `colibri_access_token`.
- El JWT incluye `sub`, `email`, `role`, `status` y `sessionVersion`.
- El frontend **no lee** la cookie desde JS (es HttpOnly). Solo hace
  requests con `withCredentials` (por defecto en el cliente axios) y el
  navegador adjunta la cookie automáticamente.
- El `Authorization: Bearer <token>` también está soportado por el
  backend, pero **el frontend no lo usa** en el flujo normal.

## Flujo de login por email/contraseña

```
/login → POST /api/v1/auth/signin
      ← 200 + Set-Cookie: colibri_access_token=<jwt>; HttpOnly; Secure; SameSite=None
      → redirige al dashboard según rol
```

## Flujo de login con Google

```
Usuario pulsa "Continuar con Google"
    │
    ▼
Navegador → ${NEXT_PUBLIC_BACKEND_URL}/auth/google
    │
    ▼
Backend redirige a Google
    │
    ▼
Google → backend /auth/google/callback
    │
    ├─ Si usuario nuevo (PENDING_PROFILE):
    │    → redirige a /login/google-callback?tempToken=<jwt corto>
    │    → el usuario elige rol y completa perfil
    │    → POST /api/v1/auth/complete-profile
    │
    └─ Si usuario existente:
         → setea cookie colibri_access_token
         → redirige a /login/google-callback?role=<rol>
```

Componentes:

- `src/app/login/page.jsx` — botón **Continuar con Google**.
- `src/components/login/GoogleButton.jsx` — redirige al backend.
- `src/app/login/google-callback/page.jsx` — maneja el callback,
  selección de rol y finalización de perfil.

## Cookie — características

| Atributo | Dev | Prod |
|---|---|---|
| Nombre | `colibri_access_token` | `colibri_access_token` |
| `httpOnly` | ✅ | ✅ |
| `secure` | ❌ | ✅ |
| `sameSite` | `lax` | `none` |
| `maxAge` | `AUTH_COOKIE_MAX_AGE_MS` (default 1h en Google, 7d en login normal) | ídem |

## Refresh token

- El backend **sí expone** `POST /auth/refresh` y `POST /auth/logout`
  (ver `auth.controller.ts`).
- El frontend **no los consume actualmente**.
- Cuando el JWT expira, el backend responde `401` y el interceptor de
  respuesta limpia la sesión y dispara el `logoutCallback`.

### Roadmap

Integrar refresh silencioso en el interceptor de `401` de
`src/lib/api/client.js`. Ver `known-issues.md`.

## Invalidación de sesión — `sessionVersion`

El JWT incluye `sessionVersion`. El backend lo compara contra el valor
actual del usuario en cada request. Cambia cuando:

- Se cambia la contraseña.
- Se suspende/reactiva la cuenta.
- Se fuerza logout global.

Cuando no coincide → `401 Sesión revocada`. El frontend debe tratarlo
como un `401` normal (limpiar + redirigir a login).

## Endpoints usados por el frontend

| Endpoint | Método | Uso |
|---|---|---|
| `/auth/signup` | POST | Registro con email/contraseña |
| `/auth/signin` | POST | Login email/contraseña |
| `/auth/google` | GET (redirect) | Inicia OAuth Google |
| `/auth/complete-profile` | POST | Completa perfil post-Google |
| `/auth/google/exchange` | POST | Canjea código opaco (usado por backend, no directamente) |
| `/auth/logout` | POST | Cierre de sesión (backend limpia cookie) |
| `/auth/forgot-password` | POST | Recupero de contraseña |
| `/auth/reset-password` | POST | Reset de contraseña |

Ver también [`roles.md`](./roles.md) para cómo se decide a dónde va
cada rol después de autenticarse.
