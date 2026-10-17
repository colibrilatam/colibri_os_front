# Known issues

Deuda técnica vigente en el frontend. Algunos ítems están tomados del
informe original [`../Deuda-tecnica-frontend.md`](../Deuda-tecnica-frontend.md).

## 🔴 `output: 'standalone'` faltante en `next.config.mjs`

**Impacto:** alto — el Dockerfile copia `.next/standalone`, que no se
genera si la opción no está activa. El contenedor no arranca.

**Estado:** confirmado por lectura de `next.config.mjs`.

**Acción:** agregar `output: 'standalone'` al objeto `nextConfig`.

## 🟡 Docs legacy contradictorias

Los documentos:
- `../arquitectura-capa-http.md`
- `../tanstack-query-migration.md`
- `../colibri-github-dokploy-dev-demo.md`

Contienen información desactualizada:

| Punto | Legacy dice | Realidad |
|---|---|---|
| Cookie | `token` | `colibri_access_token` |
| HTTP 101 en 401 | typo | es 401 |
| Refresh token | "no existe" | backend lo expone; frontend no lo usa |
| Var de API | `NEXT_PUBLIC_API_URL` | `NEXT_PUBLIC_BACKEND_URL` |
| Tests | 74 | ver `npm run test:run` (actualmente 98) |

**Estado:** los documentos se conservan como referencia histórica. La
versión correcta vive en `docs/`.

## 🟡 Sin refresh silencioso

El backend expone `POST /auth/refresh` pero el frontend no lo consume.
Cuando el JWT expira, la sesión se pierde.

**Acción propuesta:** integrar refresh en el interceptor de `401` de
`src/lib/api/client.js`.

## 🟡 CI de tests ausente

No hay workflow que corra `npm run test:run` en PRs. Los tests se
corren manualmente.

**Acción propuesta:** agregar `.github/workflows/test.yml` con Vitest.

## 🟡 Prettier solo manual

No hay pre-commit hook ni workflow que corra Prettier. Aumenta el ruido
en diffs.

## 🟢 `console.log` residuales

En `src/app/dashboard/[id]/trayectoria/NewPage.jsx` (líneas ~310 y ~747
según el informe original). Verificar y eliminar.

## 🟢 Código comentado

`src/app/login/page.jsx` y otros. Revisar y limpiar.

## 🟢 Comentarios `TODO` vagos

`src/app/globals.css`, `src/app/home/page.jsx`. Convertir a TODOs
accionables o eliminar.

## 🟢 Doble carpeta `docs/`

- `client/docs/` — canónica.
- `client/src/docs/` — sin uso, evaluar eliminar.

## 🟢 `/admin` con roles duplicados

En `layoutConfig.js` la ruta `/admin` tiene `roles: ['admin', 'admin']`.
Inocuo pero indica copy-paste.

## Verificación

```bash
# ¿Existe standalone en el output del build?
ls .next/standalone 2>/dev/null || echo "FALTA output: standalone"

# ¿Quedan console.log activos?
grep -rn "console\.log" src/ | grep -v __tests__

# ¿Quedan NEXT_PUBLIC_API_URL?
grep -rn "NEXT_PUBLIC_API_URL" .
```
