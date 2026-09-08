'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProject } from '@/lib/projectContext';
import AllTranches from './components/AllTranches';
import { useProjectTramoData } from '@/hooks/queries/useProjectTramoData';
import { useTranslation } from '@/hooks/useTranslation';
import tramosMockData from '@/lib/mock/tramos-incertidumbre-riesgos.json';
import { useLocalizedField } from '@/hooks/useLocalizedField';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function TramoDashboard() {
  const { t } = useTranslation('tramo');

  // contexto
  const { tramoData, dbProject, mockProject } = useProject();
  const { project, currentState, pacProgress } = mockProject;

  const { data: tramoInfo, error: projectTramoDataError } = useProjectTramoData(dbProject?.id);

  // Campos localizados para tramos
  const tramoName = useLocalizedField(tramoData, 'name');


  /* =========================
     🔗 DATA MAPPING REAL
  ========================= */

  // contexto
  const { currentTramoData, projectTramoData } = useProject();
  const [tramosData, setTramosData] = useState(projectTramoData);

  const currentTramoMockData = tramosMockData.find(
    (t) => t.tranchCode === currentTramoData.code,
  );

  return (
    <div className="min-h-screen mx-auto overflow-x-hidden">
      {/* HEADER */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        id="cabecera"
        className="glass-effect-dark border-glass rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p
              className="text-overline"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {t('analyticHeader')}
            </p>

            <h1 className="text-h1" style={{ color: 'var(--text-primary)' }}>
              {currentTramoData.code} · {currentTramoData.name_es}
            </h1>

            <p className="text-body-lg text-(--text-secondary) mt-1">
              {currentTramoMockData.tranchShortDesc}
            </p>
          </div>

          <div className="flex gap-2 sm:gap-3 flex-wrap">
            <InfoBox
              label={t('dominantUncertainty')}
              value={currentTramoData.uncertaintyType}
            />
          </div>
        </div>
      </motion.div>

      <div className="w-full  glass-effect rounded-2xl border-glass p-2 lg:p-4 mb-1 lg:mb-6 text-[var(--text-primary)] gap-4 flex flex-col">
        <div id="incertidumbre" className=" rounded-2xl p-1 lg:p-4">
          <h3 className="text-red-500/70 font-bold">
            {currentTramoData.uncertaintyType}
          </h3>
          <div className="text-[var(--text-primary)] text-lg my-4">
            {currentTramoMockData.incertidumbreDescCorta}
          </div>
          <div className=" max-w-3xl text-[var(--text-secondary)] text-lg leading-relaxed">
            {currentTramoMockData.incertidumbreDescLarga}
          </div>
        </div>
        <div
          id="riesgos"
          className="glass-effect rounded-2xl border-glass p-1 lg:p-4"
        >
          <h3 className="m-4" style={{ color: 'var(--text-primary)' }}>
            {t('risks')}
          </h3>
          <div className="flex flex-col lg:flex-row gap-2 justify-between">
            {currentTramoMockData.riesgosPrincipales.map((r, i) => (
              <div
                className="flex flex-col items-center border-glass glass-effect rounded-2xl p-4"
                key={i}
              >
                <div
                  key={i}
                  className="w-fit justify-center flex items-center gap-2 glass-effect-red border-glass px-3 py-2 rounded-xl"
                >
                  <span className="text-center text-red-400 text-lg">⚠</span>
                  <p className="text-center  text-red-400/80 text-lg font-bold">
                    {r.nombre}
                  </p>
                </div>

                <div className="text-start w-full my-4 text-[var(--text-primary)] text-lg">
                  {r.descripcionCorta}
                </div>
                <div className="text-start w-full text-[var(--text-secondary)] text-lg leading-relaxed">
                  {r.descripcionLarga}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {tramosData && (
        <div
          id="tramos"
          className="glass-effect border-glass text-[var(--text-primary)] text-center rounded-2xl p-2 lg:px-6 lg:p-4 my-4"
        >
          <h3 className="my-4" style={{ color: 'var(--text-primary)' }}>
            {t('allTranchesTitle')}
          </h3>
          <AllTranches elements={tramosData} />
        </div>
      )}
    </div>
  );
}

/* COMPONENTES */

const InfoBox = ({ label, value }) => (
  <div className="glass-effect border-glass px-3 py-2 sm:px-4 sm:py-2 rounded-xl">
    <p className="text-micro-label" style={{ color: 'var(--text-tertiary)' }}>
      {label}
    </p>
    <p className="text-body-lg" style={{ color: 'var(--text-primary)' }}>
      {value}
    </p>
  </div>
);
