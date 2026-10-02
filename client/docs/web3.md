# Web3 / NFTs

## Estado actual

El frontend **solo lee** datos de NFTs desde el backend. No firma
transacciones, no se conecta a wallets y no interactúa on-chain
directamente.

## Flujo

```
Usuario → /user/nft
    │
    ▼
useNftProjects()  (TanStack Query)
    │
    ▼
nftService → GET /api/v1/nft-projects
              GET /api/v1/nft-projects/:id
              GET /api/v1/mecenas-semilla/dashboard/:id
              POST /api/v1/mecenas-semilla/buy-nfts/:id
    │
    ▼
Backend NestJS orquesta la compra (fuera del alcance del frontend)
    │
    ▼
Render de datos en la UI
```

> La compra se inicia desde el frontend (`POST /buy-nfts/:id`) pero la
> transacción real la maneja el backend. El frontend nunca ve claves
> privadas ni firma.

## Archivos relevantes

- `src/app/user/nft/page.jsx`
- `src/services/nft.js`
- `src/hooks/queries/useNftProjects.js`, `useNftStats.js`

## Imágenes

- Servidas desde **Cloudinary** (`res.cloudinary.com`).
- Dominio permitido en `next.config.mjs` → `images.remotePatterns`.

## Subida de archivos (evidencias)

- **Única vía actual:** Cloudinary, vía `src/lib/api/cloudinary.js`.
- Usa `fetch` nativo porque maneja `FormData`, incompatible con el
  cliente axios.
- Los errores se normalizan a `ApiError`.

## Roadmap

- [ ] Integrar **Pinata** para subir a IPFS.
- [ ] Migrar evidencias de Cloudinary a IPFS (o híbrido).
- [ ] Documentar la estrategia on-chain (red, contratos, wallets) cuando
      se defina.

## Red blockchain

**No definida** en el frontend actualmente. El backend no expone
contratos ni direcciones al cliente.
