# Documentación de Colibrí Frontend

Índice de toda la documentación técnica del cliente web.

## Empezar

- 🚀 [Quickstart](./quickstart.md) — correr el proyecto desde cero
- 🌍 [Entornos](./entornos.md) — local, producción, URLs
- 🔑 [Variables de entorno](./variables-entorno.md) — qué setear y dónde

## Arquitectura

- 🏛️ [Arquitectura general](./arquitectura.md) — capas y diagrama
- 📡 [Capa HTTP](../arquitectura-capa-http.md) *(documento legacy, se mantiene)*
- 🔄 [TanStack Query](../tanstack-query-migration.md) *(documento legacy, se mantiene)*

## Flujos críticos

- 🔐 [Autenticación](./autenticacion.md) — JWT, cookie, Google OAuth
- 👥 [Roles y rutas](./roles.md) — `layoutConfig.js`
- 📜 [Contratos FE↔BE](./contratos.md) — `@colibri/contracts`
- 🌐 [i18n](./i18n.md) — internacionalización
- 🖼️ [Web3 / NFTs](./web3.md) — lectura on-chain, Cloudinary, IPFS

## Operación

- 🚢 [Despliegue](./despliegue.md) — Docker + Dokploy
- 🧪 [Testing](./testing.md) — Vitest + MSW
- 🩺 [Troubleshooting](./troubleshooting.md) — 404, CORS, login
- ⚠️ [Known issues](./known-issues.md) — deuda técnica vigente

---

## Cómo mantener esta documentación

1. Toda decisión arquitectónica nueva va como `.md` en `docs/`.
2. Los documentos legacy (`../arquitectura-capa-http.md`,
   `../tanstack-query-migration.md`,
   `../colibri-github-dokploy-dev-demo.md`,
   `../Deuda-tecnica-frontend.md`) se mantienen como referencia
   histórica y **no se editan**.
3. Si un legacy se contradice con el código actual, se corrige en
   `docs/` y se marca la discrepancia en `known-issues.md`.
