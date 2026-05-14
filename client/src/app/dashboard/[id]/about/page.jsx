'use client';

/* import {
  getProjectStatusLabel,
  getTrajectoryStatusLabel,
} from '@/utils/project.enums'; */

//import { getUserRoleLabel } from '@/utils/user.enums';

//import { getRoleInTeamLabel } from '@/utils/project-member.enums';
import { useMemo, useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import Image from 'next/image';
// 👇 IMPORTÁ LOS ICONOS
import maleIcon from '../../../../../public/icons/male-blue.png';
import femaleIcon from '../../../../../public/icons/female-pink.png';
import EntrepreneurCard from '@/components/Contact';
import NotificationPopup from '@/components/NotificationPopup';
import { useProject } from '@/lib/projectContext';
import { usePathname } from 'next/navigation';

const formatDate = (date) => {
  if (!date) return '-';

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};

export const projectStatusLabels = {
  active: 'Activo',
  inactive: 'Inactivo',
  closed: 'Cerrado',
  suspended: 'Suspendido',
};

export const trajectoryStatusLabels = {
  on_track: 'En trayectoria',
  at_risk: 'En riesgo',
  stalled: 'Estancado',
  completed: 'Completado',
};

const getProjectStatusLabel = (status) => {
  const normalized = status?.toLowerCase().trim();

  return projectStatusLabels[normalized] || status;
};

const getTrajectoryStatusLabel = (status) => {
  const normalized = status?.toLowerCase().trim();

  return trajectoryStatusLabels[normalized] || status;
};

export const userRoleLabels = {
  entrepreneur: 'Emprendedor',
  mentor: 'Mentor',
  evaluator: 'Evaluador',
  mecenas_semilla: 'Mecenas Semilla',
  mecenas_fundacional: 'Mecenas Fundacional',
  mecenas_cambio: 'Mecenas Cambio',
  admin: 'Administrador',
  guest: 'Invitado',
};

const getUserRoleLabel = (role) => {
  const normalized = role?.toLowerCase().trim();

  return userRoleLabels[normalized] || role;
};

export const roleInTeamLabels = {
  founder: 'Founder',
  co_founder: 'Co-Founder',
  cto: 'CTO',
  cmo: 'CMO',
  developer: 'Developer',
  designer: 'Diseñador',
  advisor: 'Advisor',
  other: 'Otro',
};

const getRoleInTeamLabel = (role) => {
  const normalized = role?.toLowerCase().trim();

  return roleInTeamLabels[normalized] || role;
};

const project = {
  id: '0aebc593-ea6d-49fa-938f-1a2a06058205',
  ownerUserId: '8e91d5a9-e729-4d1a-8763-80c2bc063da8',
  projectName: 'TrayectoClaro',
  projectImageUrl:
    'https://res.cloudinary.com/doplwvnnj/image/upload/v1776794269/5_TrayectoClaro_Edtech_Chile_opy2ld.jpg',
  status: 'active',
  country: 'Chile',
  industry: 'Edtech',
  tagline: 'Hace visible la continuidad y el avance en trayectos híbridos.',
  shortDescription:
    'Proyecto edtech en etapa de prototipo vivo que ayuda a instituciones chilenas a seguir participación, continuidad y avance de estudiantes en experiencias híbridas de formación.',
  startupLinkedinUrl: 'https://linkedin.com/company/trayectoclaro',
  websiteUrl: 'https://trayectoclaro.cl',
  rlabProfileUrl: '/dashboard/${projectId}/about',
  openedAt: '2026-05-08T15:25:24.254Z',
  closedAt: null,
  closeReason: null,
  currentTramoId: 'T2',
  currentPacId: 'T2-C4',
  trajectoryStatus: 'on_track',
  nftImageUrl:
    'https://res.cloudinary.com/doplwvnnj/image/upload/v1776794539/5_proj_trayectoclaro_cl_nft_t3_addy8w.jpg',
  lastActivityAt: '2026-05-08T15:25:24.254Z',
  createdAt: '2026-05-08T15:25:24.255Z',
  updatedAt: '2026-05-08T15:25:24.255Z',
  ownerUserId: '8e91d5a9-e729-4d1a-8763-80c2bc063da8',
  owner: {
    id: '8e91d5a9-e729-4d1a-8763-80c2bc063da8',
    email: 'lucas@colibri.com',
    fullName: 'Lucas Martinez',
    role: 'entrepreneur',
    status: 'active',
    provider: 'local',
    avatar: 'https://i.pravatar.cc/300?img=12',
    bio: 'Founder especializado en educación híbrida y trazabilidad de aprendizaje.',
    createdAt: '2026-05-08T15:25:23.776Z',
    updatedAt: '2026-05-08T15:25:23.776Z',
  },

  profile: null,

  members: [
    // 👑 FUNDADOR PRINCIPAL (OWNER)
    {
      id: 'member-owner',
      projectId: '0aebc593-ea6d-49fa-938f-1a2a06058205',
      userId: '8e91d5a9-e729-4d1a-8763-80c2bc063da8',
      roleInTeam: 'founder',
      joinedAt: '2026-05-08T15:25:24.254Z',
      leftAt: null,
      isActive: true,
      participationWeight: 40,
      isFounder: true,
      isPrimaryOperator: true,

      user: {
        id: '8e91d5a9-e729-4d1a-8763-80c2bc063da8',
        fullName: 'Lucas Martinez',
        role: 'entrepreneur',
        gender: 'male',
        avatar: 'https://i.pravatar.cc/300?img=12',
      },
    },

    {
      id: 'member-1',
      projectId: '0aebc593-ea6d-49fa-938f-1a2a06058205',
      userId: 'usr-2',
      roleInTeam: 'cto',
      joinedAt: '2026-05-10T10:00:00.000Z',
      leftAt: null,
      isActive: true,
      participationWeight: 35,
      isFounder: false,
      isPrimaryOperator: false,

      user: {
        id: 'usr-2',
        fullName: 'Sofía Martínez',
        role: 'entrepreneur',
        gender: 'female',
        avatar: 'https://i.pravatar.cc/300?img=32',
      },
    },

    {
      id: 'member-2',
      projectId: '0aebc593-ea6d-49fa-938f-1a2a06058205',
      userId: 'usr-3',
      roleInTeam: 'designer',
      joinedAt: '2026-05-12T12:00:00.000Z',
      leftAt: null,
      isActive: true,
      participationWeight: 20,
      isFounder: false,
      isPrimaryOperator: false,

      user: {
        id: 'usr-3',
        fullName: 'Camila Torres',
        role: 'entrepreneur',
        gender: 'female',
        avatar: 'https://i.pravatar.cc/300?img=25',
      },
    },

    {
      id: 'member-3',
      projectId: '0aebc593-ea6d-49fa-938f-1a2a06058205',
      userId: 'usr-4',
      roleInTeam: 'advisor',
      joinedAt: '2026-05-15T09:00:00.000Z',
      leftAt: null,
      isActive: true,
      participationWeight: 10,
      isFounder: false,
      isPrimaryOperator: false,

      user: {
        id: 'usr-4',
        fullName: 'Andrés Valenzuela',
        role: 'mentor',
        gender: 'male',
        avatar: 'https://i.pravatar.cc/300?img=55',
      },
    },
  ],

  projectPacs: [
    {
      id: 'e4ed56f1-e810-492b-af5b-9c63302f9791',
      projectId: '0aebc593-ea6d-49fa-938f-1a2a06058205',
      pacId: 'a12b565d-7924-426a-af12-04cfd040d1c3',
      status: 'in_progress',
      progress: '68.00',
      startedAt: '2026-05-08T15:25:24.261Z',
      completedAt: null,
      createdAt: '2026-05-08T15:25:24.261Z',
      updatedAt: '2026-05-08T15:25:24.261Z',

      pac: {
        id: 'a12b565d-7924-426a-af12-04cfd040d1c3',
        categoryId: '7006da48-d702-4d6d-9a2a-47fa34a42177',
        code: 'PAC_3_1_1',
        title: 'Evaluar capacidad operativa del equipo',
        objectiveLine: 'Validar ejecución bajo presión real',
        description:
          'PAC enfocado en coordinación operativa y capacidad de ejecución temprana.',
        sortOrder: 1,
        executionWindowDays: 5,
        minimumCompletionThreshold: '65.00',
        icWeight: '0.14',
        closureRule: 'Completar las 3 micro acciones requeridas del PAC_3_1_1.',
        templateVersion: 'v1.0',
        isActive: true,
        validFrom: null,
        validTo: null,
        createdAt: '2026-05-08T15:25:24.039Z',
        updatedAt: '2026-05-08T15:25:24.039Z',
      },
    },
  ],
};

export default function ProjectSection() {
  const pathname = usePathname();
  const projectId = pathname.split('/')[2];
  console.log(projectId);

  const [isOpen, setIsOpen] = useState(false);

  const activeMembers = useMemo(() => {
    return project.members.filter((member) => member.isActive);
  }, [project.members]);

  const [openEntrepreneurCard, setOpenEntrepreneurCard] = useState(false);

  if (!project) return null;

  //const activeMembers = project.members?.filter((m) => m.isActive) || [];
  const ownerMember = useMemo(() => {
    return project.members.find(
      (member) => member.userId === project.ownerUserId,
    );
  }, [project.members]);

  return (
    <section className="glass-effect border-glass rounded-3xl p-6 md:p-8 space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
        <div className="flex gap-5 items-start">
          {/* IMAGE */}
          <div className="w-28 h-28 rounded-2xl overflow-hidden shrink-0 border border-slate-700">
            {project.projectImageUrl ? (
              <img
                src={project.projectImageUrl}
                alt={project.projectName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">
                Sin imagen
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="space-y-3">
            <div>
              <p className="text-overline">Proyecto</p>

              <h2 className="text-h2">{project.projectName}</h2>
            </div>

            {project.tagline && (
              <p className="text-body-lg text-accent-cyan">{project.tagline}</p>
            )}

            <div className="flex flex-wrap gap-2">
              <Badge>{getProjectStatusLabel(project.status)}</Badge>

              {project.trajectoryStatus && (
                <Badge variant="cyan">
                  {getTrajectoryStatusLabel(project.trajectoryStatus)}
                </Badge>
              )}

              {project.industry && (
                <Badge variant="amber">{project.industry}</Badge>
              )}

              {project.country && (
                <Badge variant="emerald">{project.country}</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= DESCRIPTION ================= */}
      {project.shortDescription && (
        <div className="space-y-2">
          <p className="text-overline">Descripción</p>

          <p className="text-body">{project.shortDescription}</p>
        </div>
      )}

      {/* ================= OWNER ================= */}
      {ownerMember && (
        <div className="space-y-4">
          <p className="text-overline">Lider del proyecto</p>

          <div className="glass-effect-white rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-value-card">
                    {ownerMember.user?.fullName}
                  </p>

                  <button
                    onClick={() => setOpenEntrepreneurCard(true)}
                    className="
                flex items-center gap-2
                px-3 py-1.5 rounded-full
                bg-cyan-500/10
                border border-cyan-500/20
                text-cyan-300
                transition-all duration-200
                hover:bg-cyan-500/20
                hover:border-cyan-400/40
                hover:text-cyan-200
                hover:scale-[1.02]
                cursor-pointer
              "
                    title="Contactar fundador"
                  >
                    <MessageCircle size={14} />

                    <span className="text-xs font-medium">
                      Contactar fundador
                    </span>
                  </button>
                </div>

                <p className="text-helper mt-1">
                  {getRoleInTeamLabel(ownerMember.roleInTeam)}
                </p>
              </div>

              {ownerMember.user?.avatar && (
                <img
                  src={ownerMember.user.avatar}
                  alt={ownerMember.user.fullName}
                  className="w-14 h-14 rounded-full object-cover border border-slate-700"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {openEntrepreneurCard && (
        <NotificationPopup
          isOpen={openEntrepreneurCard}
          message="Datos del emprendedor"
          onClose={() => setOpenEntrepreneurCard(false)}
        >
          <EntrepreneurCard
            name="Valentina Moreno"
            email="valentina.moreno@empresa.com"
            phone="+54 11 4234 5678"
            linkedin="linkedin.com/in/valentina-moreno"
          />
        </NotificationPopup>
      )}

      {/* ================= TEAM ================= */}
      {activeMembers.length > 0 && (
        <div className="space-y-4">
          {/* HEADER */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="
              flex items-center justify-between
              cursor-pointer select-none
              rounded-2xl border border-slate-800
              bg-white/[0.03]
              px-4 py-3
              transition-all duration-300
              hover:bg-white/[0.05]
              hover:border-slate-700
            "
          >
            <div className="flex items-center gap-3">
              <p className="text-overline">Equipo activo</p>

              <div
                className={`
                  transition-transform duration-300 ease-out
                  ${isOpen ? 'rotate-180' : 'rotate-0'}
                `}
              >
                <ChevronDown size={16} className="text-slate-400" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* WOMEN */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-semibold text-fuchsia-300">
                  {
                    activeMembers.filter(
                      (member) => member.user?.gender === 'female',
                    ).length
                  }
                </span>

                {/* FEMALE ICON */}
                <Image
                  src={femaleIcon}
                  alt="Mujeres"
                  width={22}
                  height={22}
                  className="object-contain"
                />
              </div>

              {/* MEN */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-semibold text-cyan-300">
                  {
                    activeMembers.filter(
                      (member) => member.user?.gender === 'male',
                    ).length
                  }
                </span>

                {/* MALE ICON */}
                <Image
                  src={maleIcon}
                  alt="Hombres"
                  width={22}
                  height={22}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* COLLAPSIBLE CONTENT */}
          <div
            className={`
              grid transition-all duration-500 ease-in-out
              ${
                isOpen
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] opacity-0'
              }
            `}
          >
            <div className="overflow-hidden">
              <div className="grid md:grid-cols-2 gap-4 pt-2">
                {activeMembers.map((member) => (
                  <div
                    key={member.id}
                    className="
                      glass-effect-white
                      border border-slate-800
                      rounded-2xl p-4
                      transition-all duration-300
                      hover:border-cyan-500/30
                      hover:bg-white/[0.04]
                    "
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* LEFT */}
                      <div className="flex gap-4 items-start">
                        {/* AVATAR */}
                        {member.user?.avatar ? (
                          <img
                            src={member.user.avatar}
                            alt={member.user?.fullName}
                            className="
                              w-14 h-14 rounded-2xl object-cover
                              border border-slate-700 shrink-0
                            "
                          />
                        ) : (
                          <div
                            className="
                              w-14 h-14 rounded-2xl
                              bg-slate-800 border border-slate-700
                              flex items-center justify-center
                              text-slate-500 shrink-0
                            "
                          >
                            ?
                          </div>
                        )}

                        {/* INFO */}
                        <div>
                          <p className="text-value-card">
                            {member.user?.fullName}
                          </p>

                          <p className="text-helper mt-1">
                            {getRoleInTeamLabel(member.roleInTeam)}
                          </p>
                        </div>
                      </div>

                      {/* BADGES */}
                      <div className="flex flex-col items-end gap-1">
                        {member.isFounder && (
                          <MiniBadge variant="amber">Founder</MiniBadge>
                        )}

                        {/* {member.isPrimaryOperator && (
                          <MiniBadge variant="cyan">Operador</MiniBadge>
                        )} */}
                      </div>
                    </div>

                    {/* FOOTER */}
                    <div className="mt-4 flex justify-between text-legend">
                      <span>Ingreso: {formatDate(member.joinedAt)}</span>

                      {member.participationWeight && (
                        <span>Participación {member.participationWeight}%</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ================= METRICS ================= */}
      {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Estado"
          value={getProjectStatusLabel(project.status)}
        />

        <MetricCard
          label="Trayectoria"
          value={
            project.trajectoryStatus
              ? getTrajectoryStatusLabel(project.trajectoryStatus)
              : '-'
          }
        />

        <MetricCard
          label="PAC actual"
          value={project.projectPacs?.[0]?.pac?.code || '-'}
        />

        <MetricCard
          label="Actividad"
          value={formatDate(project.lastActivityAt)}
        />
      </div> */}

      {/* ================= LINKS ================= */}
      <div className="grid md:grid-cols-3 gap-4">
        <LinkCard label="Sitio web" url={project.websiteUrl} />

        <LinkCard label="LinkedIn" url={project.startupLinkedinUrl} />

        <LinkCard
          label="Perfil RLAB"
          url={`/dashboard/${projectId}/about`}
          copyMode
        />
      </div>

      {/* ================= TIMELINE ================= */}
      <div className="space-y-4">
        <p className="text-overline">Timeline del proyecto</p>

        <div className="grid md:grid-cols-4 gap-4">
          <TimelineCard label="Inicio" value={formatDate(project.openedAt)} />

          <TimelineCard
            label="Última actividad"
            value={formatDate(project.lastActivityAt)}
          />

          <TimelineCard label="Creado" value={formatDate(project.createdAt)} />

          <TimelineCard
            label="Actualizado"
            value={formatDate(project.updatedAt)}
          />
        </div>
      </div>
    </section>
  );
}

/* ================= UI ================= */

function MetricCard({ label, value }) {
  return (
    <div className="glass-effect-white border border-slate-800 rounded-2xl p-4">
      <p className="text-micro-label">{label}</p>

      <p className="text-value-card mt-3">{value}</p>
    </div>
  );
}

function TimelineCard({ label, value }) {
  return (
    <div className="glass-effect-white border border-slate-800 rounded-2xl p-4">
      <p className="text-micro-label">{label}</p>

      <p className="text-body mt-2">{value}</p>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-micro-label">{label}</p>

      <p className="text-body mt-2">{value}</p>
    </div>
  );
}

function LinkCard({ label, url, copyMode = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!url) return;

    try {
      const fullUrl = `${window.location.origin}${url}`;

      await navigator.clipboard.writeText(fullUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error('Error al copiar:', error);
    }
  };

  return (
    <div className="glass-effect-white border border-slate-800 rounded-2xl p-4">
      <p className="text-micro-label mb-3">{label}</p>

      {!url ? (
        <p className="text-body--muted">No disponible</p>
      ) : copyMode ? (
        <button
          onClick={handleCopy}
          className="
            text-accent-cyan
            transition-all duration-200
            hover:text-cyan-200
            cursor-pointer
          "
        >
          {copied ? '✅ Copiado' : 'Copiar enlace →'}
        </button>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-cyan break-all"
        >
          Abrir enlace →
        </a>
      )}
    </div>
  );
}

function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-slate-500/10 text-slate-300 border-slate-500/20',

    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',

    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',

    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  };

  return (
    <span
      className={`
        px-3 py-1 rounded-full text-xs border
        ${variants[variant]}
      `}
    >
      {children}
    </span>
  );
}

function MiniBadge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-slate-500/10 text-slate-300',

    cyan: 'bg-cyan-500/10 text-cyan-300',

    amber: 'bg-amber-500/10 text-amber-300',
  };

  return (
    <span
      className={`
        px-2 py-1 rounded-full text-[11px]
        ${variants[variant]}
      `}
    >
      {children}
    </span>
  );
}
