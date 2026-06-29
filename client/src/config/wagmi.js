
import { createConfig } from 'wagmi';
import { http } from 'viem';
import {  storyAeneid } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'


const INFURA_KEY = "aad4d3358eef49d38e5b8bc1988f05d7"

export const config = createConfig({
  chains: [storyAeneid],
  connectors: [
    metaMask({
      dapp: {
        name: 'Colibri OS',
        url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001/login',
      },
      useBatch: false,
      // Para desactivar errores
      analytics: { enabled: false },
       extensionOnly: true,
    }),
  ],
  transports: {
  [storyAeneid.id]: http('https://aeneid.storyrpc.io', { batch: false }),
},
})