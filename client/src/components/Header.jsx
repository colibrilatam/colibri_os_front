'use client';
import NftAvatar from './señal/NftAvatar';

// contexto
import { useContext } from "react";
import { ProjectContext } from '@/app/dashboard/[id]/layout';
import { formatDateSafe } from '@/lib/hooks/date';

export default function Header() {
  /*
  const { token, isGuest, logout } = useUserStore();
  const rol = useUserStore((state) => state.rol);
  const setRol = useUserStore((state) => state.setRol);
  const [isOpen, setIsOpen] = useState(false);
  
  const router = useRouter();
  */


  // contexto
  const data = useContext(ProjectContext);
  console.log("Datos del proyecto desde el contexto en Header:", data);
  const {project, currentState, reputationSnapshot} = data;


  return (
    <header  className=" mt-15 mt-0 lg:m-4 border-glass rounded-2xl glass-effect-dark lg:px-4 py-2 flex justify-between  relative min-h-16 lg:min-h-auto content-center items-center" >
      <div className=" flex items-center gap-0 lg:items-center lg:gap-4 content-center  w-full ">
        {/* Botón Hamburguesa */}
        
          <div className="flex flex-col md:flex-row gap-3 md:gap-5 items-start md:items-center justify-around w-full px-2 lg:px-10">
            {/* Sección izquierda: Nombre, ID, Tramo, Estado */}
            <div className="min-w-0 flex-1 flex flex-col gap-2 md:gap-3 items-start justify-start w-fit">
              <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-1 sm:gap-y-2">
                <NftAvatar size="sm" rounded={true} />
                <h1 className="text-lg sm:text-2xl md:text-3xl font-semibold text-slate-50">
                  {project.name}
                </h1>
               
              </div>

              <div className="hidden mt-2 md:mt-3 lg:flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-300">
                {/*  <span className="rounded-full border border-slate-700 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm text-slate-300">
                  ID {project.id}
                </span> */}
                <span className="rounded-full border border-slate-700 bg-slate-800 px-2 sm:px-3 py-0.5 sm:py-1">
                  {currentState.currentTramoCode} - {currentState.currentTramoName}
                </span>
                <span className="rounded-full border border-emerald-800/60 bg-emerald-950/60 px-2 sm:px-3 py-0.5 sm:py-1 text-emerald-300">
                  {currentState.trajectoryStatus}
                </span>
                <span className="rounded-full border border-slate-700 bg-slate-800 px-2 sm:px-3 py-0.5 sm:py-1">
                  {project.industry}
                </span>
                <span className="rounded-full border border-slate-700 bg-slate-800 px-2 sm:px-3 py-0.5 sm:py-1">
                {project.country}
                </span>
              </div>
            </div>

            {/* Sección derecha: Índice Colibrí y Última actualización */}
            <div className="md:max-w-5/12 lg:max-w-2/5 grid gap-2 md:gap-3 grid-cols-2 w-full md:w-auto md:flex-shrink-0">
              <div className="w-fit rounded-2xl border border-slate-800 bg-slate-950/60 px-3 md:px-4 py-2 md:py-3">
                <div className="text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Índice Colibrí
                </div>
                <div className="mt-1 flex items-end gap-2">
                  <div className="text-lg md:text-2xl font-semibold text-slate-50">
                    {reputationSnapshot.icPublic.toFixed(2)}
                  </div>
                  <div className="pb-0.5 text-xs md:text-sm text-slate-400">
                    / 6.00
                  </div>
                </div>
              </div>

              <div className="w-fit rounded-2xl border border-slate-800 bg-slate-950/60 px-3 md:px-4 py-2 md:py-3 text-right md:text-right">
                <div className="text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Última actualización
                </div>
                <div className="mt-1 text-sm md:text-base text-slate-200">{formatDateSafe(reputationSnapshot.calculatedAt)}</div>
              </div>
            </div>
          </div>
        
      </div>
    </header>
  );
}
