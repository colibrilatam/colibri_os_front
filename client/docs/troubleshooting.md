# Troubleshooting

## 🔴 404 en el dominio del frontend

Checklist:

- [ ] DNS resuelve al VPS correcto.
- [ ] Contenedor corriendo (`docker ps`).
- [ ] Next escucha en `0.0.0.0:3031`, no en `localhost`.
- [ ] Dokploy apunta al puerto interno `3031`.
- [ ] El dominio está en la aplicación correcta de Dokploy.
- [ ] No se reutilizan `container_name` ni redes entre entornos.
- [ ] El certificado corresponde al subdominio solicitado.

Comandos:

```bash
docker ps
docker logs --tail 100 <container>
ss -lntp | grep 3031
curl -I https://<dominio>
```

## 🔴 `Origen no autorizado por CORS`

1. Confirmar la URL exacta del frontend (con/sin `www`).
2. Agregarla en `FRONTEND_URLS` del backend (separada por comas).
3. Reiniciar el backend NestJS.

Causa frecuente: el frontend está en `http://localhost:3031` y el
backend solo permite `http://localhost:3001`.

## 🔴 `Unable to find standalone build` en el contenedor

El `next.config.mjs` **no tiene** `output: 'standalone'`. El Dockerfile
copia `.next/standalone` que no se genera. Solución:

```js
// next.config.mjs
const nextConfig = {
  output: 'standalone',
  images: { /* ... */ },
};
export default nextConfig;
```

Ver [`known-issues.md`](./known-issues.md).

## 🔴 Login con Google queda en "Iniciando sesión…"

Causas posibles:

1. `GOOGLE_CALLBACK_URL` del backend no coincide con Google Cloud Console.
2. El `FRONTEND_URL` del backend no apunta al frontend correcto.
3. La cookie `colibri_access_token` no se setea (revisar `SameSite=None`
   + `Secure` cuando el dominio es HTTPS).
4. El callback del frontend falla en silencio.

Acción: revisar Network tab del navegador, luego logs del backend.

## 🔴 La sesión se cierra sola

- `sessionVersion` cambió (contraseña, suspensión, logout global).
- El JWT expiró y no hay refresh silencioso implementado.
- Ver [`autenticacion.md`](./autenticacion.md).

## 🔴 `401` en requests después de estar logueado

- La cookie `colibri_access_token` no se está enviando → revisar
  `withCredentials` y CORS.
- El usuario está en estado `PENDING_PROFILE` → debe completar perfil.
- El JWT expiró.

## 🔴 Imágenes de Cloudinary no cargan

Revisar `next.config.mjs`:

```js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'res.cloudinary.com' },
  ],
}
```

Si el cloud name cambió o hay otro CDN, agregarlo.

## 🔴 Errores de contrato Zod (`validateResponse`)

Significa drift FE↔BE. Acción:

1. En el backend: `npm run contract:sync`.
2. Verificar que `schemas.ts` en el frontend cambió.
3. Rebuild del frontend.

Ver [`contratos.md`](./contratos.md).

## 🐛 Diagnóstico general

```bash
# Frontend
docker logs --tail 100 <container>
npm run test:run
npm run lint

# Backend
curl -I https://api.colibrilatam.io/api/v1/health
curl -I https://api.colibrilatam.io/docs
```
