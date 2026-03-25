'use client';

export default function NFTColibri({ nft }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-200 max-w-md w-full transition hover:shadow-xl">
      {/* Header con badge */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">{nft.name}</h2>

        <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-medium">
          {nft.type}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Owner */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Owner</span>
          <span className="font-medium text-gray-800">{nft.owner}</span>
        </div>

        {/* Wallet */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Wallet</span>
          <span className="font-mono text-gray-700">{nft.wallet}</span>
        </div>

        {/* Network */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Network</span>
          <span className="text-gray-800">{nft.network}</span>
        </div>

        {/* Token ID */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Token ID</span>
          <span className="text-gray-800">{nft.tokenId}</span>
        </div>

        {/* Status */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Estado</span>
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600 font-medium">
            {nft.status}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 pt-2 border-t">{nft.description}</p>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5">
        <button className="w-full mt-3 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition">
          Ver detalles
        </button>
      </div>

      {/* Glow decorativo */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
    </div>
  );
}
