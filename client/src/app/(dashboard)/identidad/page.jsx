import NFTColibri from './components/NFTColibri';
import { nftColibriMock } from '@/lib/mock-data';
export default function IdentidadPage() {
  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6"> Identidad NFT Colibrí </h1>{' '}
      <NFTColibri nft={nftColibriMock} />{' '}
    </main>
  );
}
