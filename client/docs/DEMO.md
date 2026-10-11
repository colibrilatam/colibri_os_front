# Entorno Demo — Frontend

## Descripción

El frontend se comunica con el backend demo vía `NEXT_PUBLIC_BACKEND_URL`.
Cuando el backend devuelve un usuario con `role=demo_readonly`, el frontend
oculta las acciones de escritura y muestra un banner "modo demo".

## Configuración

```bash
cd colibri_os_front/client
cp .env.example .env.local
# Definir NEXT_PUBLIC_BACKEND_URL (no hay fallback a producción)
NEXT_PUBLIC_BACKEND_URL=http://localhost:3032/api/v1
npm run dev
```

## Cómo detecta el frontend el modo demo

1. El backend emite un JWT con `role=demo_readonly` (vía `POST /auth/demo-login`).
2. `GET /users/profile` devuelve `role: 'demo_readonly'`.
3. `useIsDemo()` en `lib/store.js` deriva `isDemo` de `user.role`.
4. `DemoGuard` oculta botones de escritura. `DemoBanner` muestra el aviso.

**Esto es UX, no seguridad.** La restricción real es el 403 del backend
(`DemoReadOnlyGuard` APP_GUARD). El frontend solo expresa el estado.

## Qué se oculta en modo demo

| Componente | Acción oculta |
| --- | --- |
| `ResolutionActions.jsx` | Aprobar / Rechazar versión |
| `ScoreCard.jsx` | Radios Aprobar / Requiere revisión |
| `ReviewActions.jsx` | Finalizar evaluación |
| `UploadModal.jsx` | Enviar evidencia |

Los botones "Cancelar" permanecen visibles (no son acciones de escritura).

## Errores 403

Si el backend devuelve 403 y el usuario es demo, el interceptor de axios
(`lib/api/client.js`) transforma el error en un mensaje amigable:
"Estás en modo demo — solo lectura."

## Regeneración del entorno demo

Ver `colibri_os_back/docs/runbooks/demo-refresh.md`.
