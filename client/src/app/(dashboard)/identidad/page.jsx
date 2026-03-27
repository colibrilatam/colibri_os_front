import NFTColibri from './components/NFTColibri';
import IndiceColibri from './components/IndiceColibri';
import ConsistenciaTemporal from './components/ConsistenciaTemporal';

import {
  nftColibriMock,
  colibriIndexMock,
  consistencyMock,
} from '@/lib/mock-data';

export default function IdentidadPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 p-6">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-white">
          Identidad del Proyecto
        </h1>
        <p className="text-sm text-zinc-400">
          Estado, reputación y comportamiento dentro de Colibrí OS
        </p>
      </div>

      {/* 🟢 BLOQUE 1 — IDENTIDAD */}
      <section className="mb-10">
        <NFTColibri nft={nftColibriMock} />
      </section>

      {/* 🟡 BLOQUE 2 — REPUTACIÓN */}
      <section className="mb-10">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <IndiceColibri data={colibriIndexMock} />
          <ConsistenciaTemporal data={consistencyMock} />
        </div>
      </section>
    </main>
  );
}
