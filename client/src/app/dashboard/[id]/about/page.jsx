'use client';

import { useMemo } from 'react';

/* ================= MOCK ================= */

const MOCK_PROJECT = {
  id: 'proj-1',
  ownerUserId: 'user-1',

  projectName: 'TrayectoClaro',

  projectImageUrl: 'https://res.cloudinary.com/doplwvnnj/image/upload/v1776794269/5_TrayectoClaro_Edtech_Chile_opy2ld.jpg',

  status: 'active',

  country: 'Chile',
  industry: 'Edtech',

  tagline: 'Hace visible la continuidad y el avance en trayectos híbridos.',

  shortDescription:
    'Proyecto edtech en etapa de prototipo vivo que ayuda a instituciones chilenas a seguir participación, continuidad y avance de estudiantes en experiencias híbridas de formación.',

  startupLinkedinUrl: 'https://linkedin.com/company/trayectoclaro',
  websiteUrl: 'https://trayectoclaro.cl',
  rlabProfileUrl: 'https://rlab.lat/projects/trayectoclaro',

  openedAt: '2024-03-01',
  closedAt: null,
  closeReason: null,

  currentTramoId: 'T2',
  currentPacId: 'T2-C4',

  trajectoryStatus: 'on_track',

  nftImageUrl: 'https://res.cloudinary.com/doplwvnnj/image/upload/v1776794539/5_proj_trayectoclaro_cl_nft_t3_addy8w.jpg',

  lastActivityAt: '2026-05-10',

  createdAt: '2024-03-01',
  updatedAt: '2026-05-11',
};

/* ================= MAIN ================= */

export default function ProjectSection({ project = MOCK_PROJECT }) {
  const stats = useMemo(() => {
    const daysActive = Math.floor(
      (new Date() - new Date(project.createdAt)) / (1000 * 60 * 60 * 24),
    );

    return {
      daysActive,
    };
  }, [project]);

  return (
    <section className="space-y-8">
      {/* HERO */}
      <Hero project={project} />

      {/* KPIS */}
      <div className="grid md:grid-cols-4 gap-4">
        <Metric label="Estado" value={translateProjectStatus(project.status)} />

        <Metric
          label="Trayectoria"
          value={translateTrajectory(project.trajectoryStatus)}
        />

        <Metric label="PAC actual" value={project.currentPacId} />

        <Metric label="Días activo" value={stats.daysActive} />
      </div>

      {/* CONTENT */}
      <div className="grid lg:grid-cols-3 gap-6">
        <AboutCard project={project} />

        <OperationalCard project={project} />

        <LinksCard project={project} />
      </div>

      {/* NFT */}
      {project.nftImageUrl && <NftCard project={project} />}
    </section>
  );
}

/* ================= HERO ================= */

function Hero({ project }) {
  return (
    <div className="glass-effect border-glass rounded-2xl p-8 flex gap-8">
      <img
        src={project.projectImageUrl}
        className="w-32 h-32 rounded-2xl object-cover"
      />

      <div className="flex-1">
        <p className="text-overline">Proyecto activo</p>

        <h1 className="text-h1">{project.projectName}</h1>

        <p className="text-body-lg mt-2">{project.tagline}</p>

        <div className="flex gap-3 mt-4">
          <Badge>{project.country}</Badge>
          <Badge>{project.industry}</Badge>
          <StatusBadge status={project.status} />
        </div>
      </div>
    </div>
  );
}

/* ================= ABOUT ================= */

function AboutCard({ project }) {
  return (
    <Card title="Descripción">
      <p className="text-body">{project.shortDescription}</p>

      <Info label="Abierto" value={formatDate(project.openedAt)} />

      <Info
        label="Última actividad"
        value={formatDate(project.lastActivityAt)}
      />
    </Card>
  );
}

/* ================= OPERATION ================= */

function OperationalCard({ project }) {
  return (
    <Card title="Estado operativo">
      <Info label="Tramo actual" value={project.currentTramoId} />

      <Info label="PAC actual" value={project.currentPacId} />

      <Info
        label="Trayectoria"
        value={translateTrajectory(project.trajectoryStatus)}
      />

      <Info label="Actualizado" value={formatDate(project.updatedAt)} />
    </Card>
  );
}

/* ================= LINKS ================= */

function LinksCard({ project }) {
  return (
    <Card title="Presencia institucional">
      <LinkItem href={project.websiteUrl} label="Website" />

      <LinkItem href={project.startupLinkedinUrl} label="LinkedIn" />

      <LinkItem href={project.rlabProfileUrl} label="Perfil Colibrí" />
    </Card>
  );
}

/* ================= NFT ================= */

function NftCard({ project }) {
  return (
    <div className="glass-effect border-glass rounded-2xl overflow-hidden">
      <img src={project.nftImageUrl} className="w-full h-80 object-cover" />

      <div className="p-6">
        <p className="text-overline">NFT reputacional</p>

        <h3 className="text-h3">Señal verificable del proyecto</h3>

        <p className="text-body mt-2">
          Representa la reputación operativa acumulada mediante ejecución,
          consistencia y validación.
        </p>
      </div>
    </div>
  );
}

/* ================= UI ================= */

function Card({ title, children }) {
  return (
    <div className="glass-effect border-glass rounded-2xl p-6 space-y-4">
      <h3 className="text-h3">{title}</h3>
      {children}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="glass-effect border-glass rounded-xl p-4">
      <p className="text-micro-label">{label}</p>

      <p className="text-value-card mt-2">{value}</p>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-micro-label">{label}</p>

      <p className="text-body">{value}</p>
    </div>
  );
}

function LinkItem({ href, label }) {
  return (
    <a href={href} target="_blank" className="block text-accent-cyan">
      {label} →
    </a>
  );
}

function Badge({ children }) {
  return (
    <span className="px-3 py-1 rounded-full bg-white/5 text-sm">
      {children}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    active: 'bg-emerald-500/20 text-emerald-400',
    inactive: 'bg-slate-500/20 text-slate-400',
    suspended: 'bg-yellow-500/20 text-yellow-400',
    closed: 'bg-red-500/20 text-red-400',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${map[status]}`}>
      {translateProjectStatus(status)}
    </span>
  );
}

/* ================= HELPERS ================= */

function formatDate(date) {
  if (!date) return '-';

  return new Intl.DateTimeFormat('es-AR').format(new Date(date));
}

function translateProjectStatus(status) {
  const map = {
    active: 'Activo',
    inactive: 'Inactivo',
    closed: 'Cerrado',
    suspended: 'Suspendido',
  };

  return map[status] || status;
}

function translateTrajectory(status) {
  const map = {
    on_track: 'En curso',
    at_risk: 'En riesgo',
    stalled: 'Estancado',
    completed: 'Completado',
  };

  return map[status] || status;
}
