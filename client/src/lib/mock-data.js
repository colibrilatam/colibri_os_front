export const nftColibriMock = {
  id: 'nft-001',
  name: 'Colibrí Genesis',
  type: 'NFT Actor',
  owner: 'Franz Duran',
  wallet: '0xA1B2...C3D4',
  network: 'Polygon',
  tokenId: '123456',
  status: 'Activo',
  description:
    'NFT que representa la identidad digital dentro del ecosistema Colibrí.',
};

export const colibriIndexMock = {
  value: 4.32, // ic_public (escala 0.00 – 6.00)
  trend: 'up', // "up" | "stable" | "down"
  lastUpdated: '2026-03-24T15:30:00Z',
};

export const consistencyMock = {
  level: 'Alta', // "Alta" | "Media" | "Baja"
  score: 0.87, // opcional (0–1)
  lateRate: 0.12, // % de acciones fuera de tiempo
  updatedAt: '2026-03-24T15:30:00Z',
};
