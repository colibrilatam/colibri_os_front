# Entornos

## Producción

| Componente | URL |
|---|---|
| Frontend | `https://colibrilatam.io` (o dominio asignado por Dokploy) |
| API | `https://api.colibrilatam.io/api/v1` |
| Swagger | `https://api.colibrilatam.io/docs` |
| Cloudinary | `https://res.cloudinary.com/<cloud-name>` |

## Local (desarrollo)

| Componente | URL |
|---|---|
| Frontend | `http://localhost:3031` |
| API | `http://localhost:3000/api/v1` |
| Swagger | `http://localhost:3000/docs` (si `SWAGGER_ENABLED=true`) |

## Puertos — convención

| Puerto | Quién |
|---|---|
| `3000` | Backend NestJS por defecto |
| `3031` | Frontend Next.js (dev y prod) |

> El frontend **nunca** corre en 3000.

## CORS

El backend valida orígenes con `FRONTEND_URL` (uno principal) y
`FRONTEND_URLS` (lista adicional separada por comas). Ejemplo local:

```env
FRONTEND_URL=http://localhost:3031
FRONTEND_URLS=http://localhost:3001,http://localhost:3031,http://localhost:3002
```

En producción, el origen del frontend debe estar en `FRONTEND_URL`.

Si ves `Origen no autorizado por CORS`:
1. Confirmá la URL exacta del frontend (con o sin `www`).
2. Agregala a `FRONTEND_URLS` en el backend.
3. Reiniciá el backend.

## Cookies en cross-site

En producción el backend setea la cookie `colibri_access_token` con:
- `httpOnly: true`
- `secure: true`
- `sameSite: 'none'`
- `path: '/'`

Esto **exige HTTPS** en el frontend y que el backend tenga CORS con
`credentials: true` (ya configurado). En desarrollo local, `sameSite`
es `lax` y `secure` es `false`.

## Modo demo / staging

**No existen.** Actualmente solo hay local y producción. Si en el
futuro se agregan, documentar acá antes de crear las apps en Dokploy.
