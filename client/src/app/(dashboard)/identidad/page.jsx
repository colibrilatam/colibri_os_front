import NFTColibri from './components/NFTColibri';
import IndiceColibri from './components/IndiceColibri';

import { nftColibriMock, colibriIndexMock } from '@/lib/mock-data';

export default function IdentidadPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Identidad</h1>
        <p className="text-sm text-zinc-400">
          Visualización del estado NFT y reputación del proyecto
        </p>
      </div>

      {/* Grid Dashboard */}
      <div
        className="grid gap-6 
  grid-cols-1 
  md:grid-cols-2 
  xl:grid-cols-3"
      >
        {/* NFT */}
        <NFTColibri nft={nftColibriMock} />

        {/* Índices */}

        <IndiceColibri data={colibriIndexMock} />
      </div>
    </main>
  );
}
