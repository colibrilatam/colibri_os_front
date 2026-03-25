'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const statusConfig = {
  pendiente: 'bg-zinc-700 text-zinc-300',
  'en progreso': 'bg-yellow-500/10 text-yellow-400',
  enviada: 'bg-blue-500/10 text-blue-400',
  validada: 'bg-emerald-500/10 text-emerald-400',
};

export default function Microacciones({ pacs }) {
  const [selectedPac, setSelectedPac] = useState(null);
  const [filter, setFilter] = useState('all');

  const filterFn = (item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  };

  return (
    <div className="space-y-6">
      
      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pendiente', 'en progreso', 'enviada', 'validada'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs border border-white/10 
              ${filter === f ? 'bg-white text-black' : 'text-zinc-400'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* LISTADO PACs */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pacs.map((pac) => (
          <motion.div
            key={pac.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedPac(pac)}
            className="cursor-pointer rounded-xl bg-zinc-900 border border-white/10 p-4"
          >
            <h3 className="text-white font-medium">{pac.title}</h3>
            <p className="text-xs text-zinc-400 mt-1">
              3 microacciones + 1 evidencia
            </p>
          </motion.div>
        ))}
      </div>

      {/* DETALLE PAC */}
      {selectedPac && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-white/10 bg-zinc-900 p-6"
        >
          <h2 className="text-lg text-white mb-4">
            {selectedPac.title}
          </h2>

          {/* Microacciones */}
          <div className="space-y-3">
            {selectedPac.microactions
              .filter(filterFn)
              .map((ma) => (
                <div
                  key={ma.id}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-zinc-300">{ma.name}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      statusConfig[ma.status]
                    }`}
                  >
                    {ma.status}
                  </span>
                </div>
              ))}
          </div>

          {/* Evidencia */}
          {filterFn(selectedPac.evidence) && (
            <div className="mt-6 pt-4 border-t border-white/10">
              <h4 className="text-sm text-zinc-400 mb-2">
                Evidencia
              </h4>

              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-300">
                  {selectedPac.evidence.name}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    statusConfig[selectedPac.evidence.status]
                  }`}
                >
                  {selectedPac.evidence.status}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}