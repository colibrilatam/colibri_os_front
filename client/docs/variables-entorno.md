# Variables de entorno

## Regla de oro

> Las variables `NEXT_PUBLIC_*` se **incrustan en el bundle durante el
> build**. Si cambian, hay que **reconstruir la imagen**. No las uses
> para secretos.

## Variables del frontend

### `NEXT_PUBLIC_BACKEND_URL`

| | |
|---|---|
| Obligatoria | Sí |
| Ejemplo local | `http://localhost:3000/api/v1` |
| Ejemplo prod | `https://api.colibrilatam.io/api/v1` |
| Consumida por | `src/lib/api/client.js` (baseURL) |

URL base del backend NestJS **incluyendo** el prefijo `api/v1`.

### `COLIBRI_CLIENT_PORT`

| | |
|---|---|
| Obligatoria | No |
| Default | `3031` |
| Ejemplo | `3031` |
| Consumida por | `docker-compose.yml` (mapeo de puertos) |

Solo se usa en el compose de Docker para mapear el puerto del host al
puerto interno `3031`.

## Ejemplo `.env.local`

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000/api/v1
COLIBRI_CLIENT_PORT=3031
```

Ver también [`.env.example`](../.env.example).

## ❌ Variables que **no** van acá

Estas aparecen a veces en dashboards compartidos pero son del backend
NestJS:

| Variable | Pertenece a | Notas |
|---|---|---|
| `GOOGLE_CLIENT_ID` | Backend | OAuth de Google |
| `GOOGLE_CLIENT_SECRET` | Backend | **Secreto** |
| `GOOGLE_CALLBACK_URL` | Backend | Debe coincidir con Google Cloud Console |
| `FRONTEND_URL` / `FRONTEND_URLS` | Backend | Lista blanca de CORS |

El frontend **no consume** ningún secreto de Google: solo redirige al
usuario a `${NEXT_PUBLIC_BACKEND_URL}/auth/google`.

## Variables que **no existen** (a pesar de aparecer en docs viejos)

| Aparece en | Variable mencionada | Estado |
|---|---|---|
| `colibri-github-dokploy-dev-demo.md` | `NEXT_PUBLIC_API_URL` | **Deprecada** — usar `NEXT_PUBLIC_BACKEND_URL` |

Si ves `NEXT_PUBLIC_API_URL` en algún script o doc, es drift y hay que
corregirlo.

## Cómo verificar que no falta ninguna

```bash
# Listar todas las env vars usadas en el código
grep -rhoE "process\.env\.[A-Z_][A-Z0-9_]*" src/ | sort -u

# Comparar contra las documentadas arriba
```

Cualquier variable que aparezca en el grep y no esté en este documento
es una **laguna de documentación** — abrir issue.
