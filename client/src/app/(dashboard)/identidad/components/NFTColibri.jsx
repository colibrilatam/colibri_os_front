'use client';

import { motion } from 'framer-motion';

export default function NFTColibri({ nft }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 shadow-xl"
    >
      {/* Glow */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">
          {nft.name}
        </h2>

        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
          {nft.type}
        </span>
      </div>

      {/* Body */}
      <div className="space-y-4 text-sm">
        {/* Owner */}
        <div className="flex justify-between">
          <span className="text-zinc-400">Owner</span>
          <span className="text-white font-medium">{nft.owner}</span>
        </div>

        {/* Wallet */}
        <div className="flex justify-between">
          <span className="text-zinc-400">Wallet</span>
          <span className="font-mono text-zinc-300 truncate max-w-[140px]">
            {nft.wallet}
          </span>
        </div>

        {/* Network */}
        <div className="flex justify-between">
          <span className="text-zinc-400">Network</span>
          <span className="text-white">{nft.network}</span>
        </div>

        {/* Token ID */}
        <div className="flex justify-between">
          <span className="text-zinc-400">Token ID</span>
          <span className="text-white">{nft.tokenId}</span>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">Estado</span>
          <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
            {nft.status}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-3 text-zinc-400 text-xs">
          {nft.description}
        </div>
      </div>

      {/* Footer */}
      <button className="mt-6 w-full rounded-lg bg-white/5 py-2 text-sm font-medium text-white transition hover:bg-white/10">
        Ver detalles
      </button>
    </motion.div>
  );
}