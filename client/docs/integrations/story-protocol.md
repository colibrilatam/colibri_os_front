# Integración Story Protocol

## Resumen

Esta integración permite registrar un **IP Asset** en Story Protocol (testnet **Aeneid**) desde el frontend de Colibri OS. El objetivo es tokenizar propiedad intelectual asociada a proyectos educativos y evidencias del sistema, vinculando cada registro a un NFT on-chain que representa la ownership del IP.

El flujo completo cubre:
- Conexión de wallet del usuario con MetaMask vía wagmi
- Subida de metadata (IP y NFT) a IPFS usando Pinata
- Registro del IP Asset on-chain mediante el SDK de Story Protocol (`@story-protocol/core-sdk`)

Actualmente la integración está implementada como un **prototipo funcional** expuesto en la UI a través del componente `AdquireNft`, pero **no está conectada al flujo real de creación de proyectos** del backend.

---

## Stack involucrado

| Tecnología | Rol | Versión | Archivos clave |
|---|---|---|---|
| **wagmi** | Conexión a blockchain, gestión de estado de wallet, hooks reactivos | `^3.6.21` | `src/config/wagmi.js` |
| **viem** | Transporte RPC (`http`, `custom`) para wagmi y StoryClient | `^2.53.1` | `src/config/wagmi.js`, `src/hooks/useStoryClient.js` |
| **MetaMask** | Wallet connector para el usuario final. Se usa el connector `metaMask` de wagmi (no el SDK nativo de MetaMask) | `@metamask/connect-evm: ^2.1.0` (no usado en código) | `src/config/wagmi.js`, `src/app/WalletConnection.jsx` |
| **Pinata** | Subida de metadata JSON y archivos a IPFS | `^2.5.6` | `src/config/pinata.js`, `src/app/api/uploadToIpfs/route.js`, `src/app/api/uploadFileToIpfs/route.js` |
| **Story Protocol SDK** | Registro de IP Assets on-chain, incluyendo mint del NFT de ownership | `@story-protocol/core-sdk: ^1.4.4` | `src/hooks/useStoryClient.js`, `src/components/web3/CreateIpAsset.jsx` |
| **Zustand** | Estado global del cliente Story Protocol (no persistido) | (existente en el proyecto) | `src/lib/store.js` |
| **@tanstack/react-query** | Cache y estado de queries para wagmi | (transitiva vía wagmi) | `src/app/Providers.jsx` |

---

## Flujo end-to-end

```
┌─────────────────────────────────────────────────────────────────────┐
│  1. CONEXIÓN DE WALLET                                              │
│                                                                     │
│  WalletConnection.jsx                                               │
│  ├─ useConnectors() → busca connector metaMaskSDK o fallback [0]   │
│  ├─ useConnect() → conecta MetaMask                                 │
│  ├─ useSwitchChain() → fuerza cambio a Story Aeneid (chainId: 1315)│
│  └─ Renderiza <StoryClientComponent> tras conectar                 │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  2. INICIALIZACIÓN DEL CLIENTE STORY PROTOCOL                       │
│                                                                     │
│  StoryClient.jsx  /  CreateIpAsset.jsx                              │
│  ├─ useWalletClient() → obtiene wallet de wagmi                    │
│  ├─ StoryClient.newClient({ wallet, transport: custom(...),        │
│  │                          chainId: "aeneid" })                    │
│  └─ Cliente listo para llamadas al SDK                             │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  3. SUBIDA DE METADATA A IPFS (Pinata)                              │
│                                                                     │
│  handleCreateIpAsset() en CreateIpAsset.jsx                         │
│  ├─ Construye ipMetadata (title, description, image, media, etc.)  │
│  ├─ Construye nftMetadata (name, description, image)               │
│  ├─ POST /api/uploadToIpfs → pinata.upload.public.json()           │
│  ├─ Calcula SHA-256 de ipMetadata por dos vías:                    │
│  │   ├─ getHashFromUrl() → hash del archivo media (evidencia)      │
│  │   └─ createHash("sha256") → hash del JSON metadata              │
│  └─ Retorna IPFS CID (Content Identifier)                          │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  4. REGISTRO DEL IP ASSET ON-CHAIN                                  │
│                                                                     │
│  client.ipAsset.registerIpAsset({                                   │
│    nft: {                                                           │
│      type: "mint",                           // Mint vía SPG       │
│      spgNftContract: "0xc32A...FAbc",        // SPG en Aeneid      │
│    },                                                               │
│    ipMetadata: {                                                    │
│      ipMetadataURI:   "https://<gateway>.mypinata.cloud/ipfs/<CID>",│
│      ipMetadataHash:  "0x<sha256>",                                 │
│      nftMetadataURI:  "https://<gateway>.mypinata.cloud/ipfs/<CID>",│
│      nftMetadataHash: "0x<sha256>",                                 │
│    },                                                               │
│  })                                                                 │
│                                                                     │
│  → Transacción on-chain → IP Asset registrado + NFT minteado       │
└─────────────────────────────────────────────────────────────────────┘
```

### Diagrama de secuencia resumido

```
Usuario → WalletConnection → MetaMask connect → wagmi (wallet state)
   → StoryClientComponent → StoryClient.newClient(wallet)
   → Usuario click "Crear registro IP"
   → CreateIpAsset.handleCreateIpAsset(evidenceUrl)
      → getHashFromUrl(evidenceUrl)
      → POST /api/uploadToIpfs (ipMetadata)    → Pinata → CID-1
      → POST /api/uploadToIpfs (nftMetadata)   → Pinata → CID-2
      → client.ipAsset.registerIpAsset({...})  → Story Protocol (Aeneid)
      → Tx confirmada → IP Asset registrado
```

---

## Dónde está cada cosa en el código

### Configuración

| Archivo | Descripción |
|---|---|
| `colibri_os_front/client/src/config/wagmi.js` | Config de wagmi: chain `storyAeneid`, connector `metaMask`, transporte RPC `https://aeneid.storyrpc.io` |
| `colibri_os_front/client/src/config/pinata.js` | Instancia de `PinataSDK` con JWT y gateway desde variables de entorno. Marcado `"server only"` |
| `colibri_os_front/client/src/app/Providers.jsx` | `WagmiProvider` + `QueryClientProvider` envolviendo toda la app |
| `colibri_os_front/client/next.config.mjs` | Stubs para dependencias opcionales de wagmi (webpack/turbopack) |
| `colibri_os_front/client/src/stubs/missing-optional-dep.js` | Stub genérico para deps faltantes |

### Conexión de wallet

| Archivo | Descripción |
|---|---|
| `colibri_os_front/client/src/app/WalletConnection.jsx` | Componente UI: conectar/desconectar MetaMask, auto-switch a Aeneid, muestra address y chainId |
| `colibri_os_front/client/src/app/layout.jsx` | Root layout que envuelve todo en `<Providers>` |
| `colibri_os_front/client/src/app/ClientLayout.jsx` | Layout cliente que orquesta sidebar, header y contenido |

### Story Protocol Client

| Archivo | Descripción |
|---|---|
| `colibri_os_front/client/src/hooks/useStoryClient.js` | Hook que crea `StoryClient` a partir de un wallet de wagmi/viem |
| `colibri_os_front/client/src/components/StoryClient.jsx` | Componente que inicializa StoryClient al montar (usa `useWalletClient`) |
| `colibri_os_front/client/src/lib/store.js:129-136` | Zustand store con estado `storyClient`, `storyClientError`, `storyClientLoading` (excluidos de persistencia) |

### Registro de IP Asset

| Archivo | Descripción |
|---|---|
| `colibri_os_front/client/src/components/web3/CreateIpAsset.jsx` | Componente principal: orquesta metadata, subida IPFS y registro on-chain |
| `colibri_os_front/client/src/components/common/AdquireNft.jsx` | Contenedor que renderiza `WalletConnection` + `CreateIpAsset` + botón de prueba de subida de archivo |
| `colibri_os_front/client/src/app/CreateIpAsset.jsx` | Función async exportada (usa store y `useUploadToIpfs` — ver bugs abajo) |

### IPFS / Pinata

| Archivo | Descripción |
|---|---|
| `colibri_os_front/client/src/hooks/useUploadToIpfs.js` | Hook para subir metadata JSON a Pinata (usa instancia `pinata` del config) |
| `colibri_os_front/client/src/app/api/uploadToIpfs/route.js` | API route: recibe JSON, lo sube a Pinata, retorna `ipfsHash` |
| `colibri_os_front/client/src/app/api/uploadFileToIpfs/route.js` | API route: recibe archivo vía FormData, lo sube a Pinata, retorna `ipfsHash` |
| `colibri_os_front/client/src/hooks/useSha256FromUrl.js` | Utilidad para calcular SHA-256 del contenido de una URL (usado para `mediaHash` e `imageHash`) |

### Backend (sin integración blockchain)

| Archivo | Descripción |
|---|---|
| `colibri_os_back/src/nfts/nft-project/nfts-project.service.ts` | CRUD de NFTs en base de datos. **No interactúa con blockchain.** Usa `createSimulated` con `chainId: 42` |
| `colibri_os_front/client/src/hooks/useNewProject.js` | Orquestador de creación de proyecto (backend + tramos + PACs). **No llama a Story Protocol ni Pinata.** |

---

## Variables de entorno necesarias

### Frontend (`colibri_os_front/client/.env`)

```
# Pinata
PINATA_JWT=                         # JWT de Pinata (usado server-side en API routes)
NEXT_PUBLIC_GATEWAY_URL=            # Gateway público de Pinata (ej: maroon-fantastic-goat-709.mypinata.cloud)

# Backend
NEXT_PUBLIC_BACKEND_URL=            # URL del backend NestJS (ej: http://localhost:3000/api/v1)
```

> **Nota:** La variable `PINATA_JWT` no lleva prefijo `NEXT_PUBLIC_` porque es server-only. El gateway sí es público para que el frontend pueda construir URLs de IPFS.

### No se requieren variables de entorno adicionales para Story Protocol, wagmi o MetaMask. El RPC de Aeneid (`https://aeneid.storyrpc.io`) y el contrato SPG (`0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc`) están hardcodeados en el código.

---

## Cosas a validar / dudas abiertas

### Bugs detectados

1. **`app/CreateIpAsset.jsx:19` — `uploadJSONToIPFS` no está definida**
   ```js
   const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);  // ReferenceError
   ```
   Probablemente debería ser `await useUploadToIpfs(nftMetadata)`. Además `useUploadToIpfs` es una función async exportada como named export que se usa como hook pero técnicamente no usa React — podría ser simplemente un helper en `services/`.

2. **`app/CreateIpAsset.jsx:20` — `createHash` no está importado**
   ```js
   const nftHash = createHash("sha256").update(...).digest("hex");  // ReferenceError
   ```
   Falta `import { createHash } from "crypto"` (presente en `CreateIpAsset.jsx` pero ausente en `app/CreateIpAsset.jsx`).

3. **Inicialización duplicada del StoryClient**
   - `components/StoryClient.jsx` inicializa el cliente pero no guarda el resultado en ningún estado ni store.
   - `components/web3/CreateIpAsset.jsx` vuelve a inicializar el cliente usando `useStoryClient(wallet)`.
   - Resultado: dos instancias separadas de `StoryClient` sin compartir estado.
   - El store de Zustand (`storyClient`) nunca se llena porque `StoryClientComponent` no llama a `setStoryClient`.

4. **`@metamask/connect-evm` es dependencia pero no se usa**
   - Está en `package.json` pero no hay ningún `import` en el código fuente.
   - wagmi provee su propio conector `metaMask` que es el que realmente se usa.

5. **`useStoryClient` retorna `null` cuando no hay wallet pero no lanza error**
   - Los consumidores (`CreateIpAsset.jsx:26`) llaman `useStoryClient(wallet)` dentro de un `useEffect` y guardan el resultado en `dataClient`.
   - Si `wallet` es `null`, `useStoryClient` hace `console.log('no wallet')` y retorna `null` sin indicar error.
   - Esto es frágil: `dataClient` puede ser `null` por error real o por todavía no tener wallet.

### Problemas de arquitectura

1. **Hardcodeo de valores on-chain**
   - Dirección del SPG contract: `0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc` — hardcodeada en `CreateIpAsset.jsx:82`.
   - Address del creator: `0x67ee74EE04A0E6d14Ca6C27428B27F3EFd5CD084` — hardcodeada en `CreateIpAsset.jsx:56`.
   - Gateway URL de Pinata: `maroon-fantastic-goat-709.mypinata.cloud` — hardcodeada en `CreateIpAsset.jsx:86-86` y presente en `.env`.
   - RPC de Aeneid: `https://aeneid.storyrpc.io` — hardcodeado en `wagmi.js`.
   - Deberían extraerse a variables de entorno o constantes.

2. **Metadata estática de ejemplo**
   - `ipMetadata` en `CreateIpAsset.jsx:47-62` tiene valores de demo (title: "Ippy", creators de "The DATA Foundation").
   - Para producción, esta metadata debe construirse dinámicamente con los datos reales del proyecto/evidencia de Colibri.

3. **Dos estrategias de hash**
   - `getHashFromUrl()` (de `useSha256FromUrl.js`) calcula SHA-256 del contenido binario del archivo en la URL.
   - `createHash("sha256")` calcula el hash del string JSON de la metadata.
   - Se usan ambas para `ipMetadata` pero con propósitos distintos (media vs metadata). Esto es correcto conceptualmente pero no está documentado en el código.

4. **Desconexión entre frontend blockchain y backend NestJS**
   - El backend tiene entidades `NftProject`, `NftActor`, etc. en base de datos, pero no interactúan con Story Protocol.
   - `useNewProject.js` crea proyectos en el backend pero nunca dispara el registro on-chain.
   - No hay un callback o webhook que sincronice el registro on-chain exitoso con el backend.

5. **La wallet se pasa como objeto viem a StoryClient pero no hay manejo de cambio de cuenta**
   - Si el usuario cambia de cuenta en MetaMask, `useWalletClient` debería reflejar la nueva wallet, pero el `StoryClient` ya instanciado podría quedar con la wallet anterior.
   - `components/StoryClient.jsx` tiene un `useEffect` que reacciona a `[wallet]`, pero no limpia/recrea el cliente.

### Preguntas abiertas

- **¿Debe el backend ser el que invoque el registro on-chain en lugar del frontend?** Esto mejoraría la seguridad (el JWT de Pinata no viajaría al cliente) y la consistencia (el backend sabría cuándo un registro se completó realmente).
- **¿Qué pasa si el usuario cierra el navegador durante la tx?** No hay mecanismo de recuperación ni estado de "pendiente" persistido.
- **¿Se planea soportar otras wallets además de MetaMask?** El código tiene `extensionOnly: true` para MetaMask y busca `metaMaskSDK` como ID de connector.
- **¿El NFT de ownership debe ser transferible?** Actualmente se mintea vía SPG sin especificar restricciones.
- **¿Se necesita manejar regalías o licencias del IP Asset?** El SDK de Story Protocol soporta licensing modules pero no están configurados.
