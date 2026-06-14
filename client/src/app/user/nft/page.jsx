"use client"
import ProgressBar from "@/components/ProgressBar";
import { useUserStore } from "@/lib/store"
import svg from "@/../public/base_aliado_semilla.svg"
import { useRequest } from "@/hooks/useRequest";
import { userService } from "@/services/user";
import { useState,  useEffect } from "react";
import { nftService } from "@/services/nft";
import { projectsService } from "@/services/project";
import LoadingScreen from "@/components/LoadingScreen";
import { getProjectIC } from "@/lib/hooks/createIcMap";


const STATUS_CONFIG = {
  "active": {
    label: "Activo",
    className: "bg-blue-100 text-blue-600 border border-blue-300",
  },
  "closed": {
    label: "Cerrado",
    className: "bg-green-100 text-green-700 border border-green-300",
  },
  "suspended": {
    label: "Suspendido",
    className: "bg-gray-800 text-white",
  },
};

function StatusBadge({ estado }) {
  const config = STATUS_CONFIG[estado] ?? {
    label: estado.toUpperCase(),
    className: "bg-gray-100 text-gray-600 border border-gray-300",
  };

  return (
    <span
      className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold whitespace-nowrap ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export default function NftPage(){

  const [ error, setError ] = useState(null);

  const [ loading, setLoading ] = useState(false);
  const [ projectsInfo, setProjectsInfo ] = useState(null);
 
  const { execute: getNftProjectsInfo, error: nftProjectsInfoError, loading: nftProjectsInfoLoading } = useRequest(nftService.getNftProjects);
  const { execute: getTramo, error: tramosError, loading: tramosLoading } = useRequest(projectsService.currentTramo);
  const { execute: getUserData, error: userDataError, loading: userDataLoading } = useRequest(userService.userData);

      async function getData(){
    setLoading(true);

    const { data: allProjects, error: allProjectsError} = await getNftProjectsInfo();
    
    const allProjectsInfo = [];

    for(let i = 0; i < 3;  i++){
      const { data:  userData } = await getUserData(allProjects[i].project.ownerUserId);
      const { data:  tramoData } = await getTramo(allProjects[i].project.currentTramoId);
      const ic = getProjectIC(allProjects[i].project.projectName);

      allProjectsInfo.push({ nftProject: allProjects[i], user: userData, tramo: tramoData, ic: ic })
    }
    setProjectsInfo(allProjectsInfo)
    setLoading(false);
    
  }

  useEffect(() => {

    getData();
    
  }, []);


    const stats = [
  {
    label: "NFTs adquiridos",
    value: "10 NFTs Totales",
  },
  {
    label: "Becas Activadas",
    value: "03 personas becadas",
  },
  {
    label: "Becas Pendientes",
    value: "07 por asignar",
  },
  {
    label: "Ruta de apoyo",
    value: "Desde N1 · Semilla de Luz",
  },
  {
    label: "Región foco",
    value: "Argentina, Chile y LATAM",
  },
];

    if(loading) return <LoadingScreen />

    return(
        <div className="z-0 relative flex flex-col lg:flex-row w-full h-full p-1 lg:p-3 gap-2">
          
        
            <div className="glass-effect border-glass rounded-2xl p-6 min-w-1/3">
           
            { error && <p className="text-red-500 text-6xl">{error.message}</p>}
                <div className="flex flex-col  md:justify-between gap-2">
                    <h1 className="text-(--text-primary)">Tu impacto como aliado</h1>
                    <p className="w-fit font-semibold primary-button border-glass rounded-full p-2 text-(--text-primary)">Portafolio NFT</p>
                </div>
                <div className="w-full items-center flex justify-center">
                <img src={svg.src} alt="NFT Avatar" className="p-2 glass-effect-dark w-80 h-80 rounded-full" ></img>
                </div>
                <div className="p-2 flex flex-col md:justify-between gap-2 mt-4">
                    <div className="glass-effect rounded-2xl p-4 text-(--text-secondary) w-full gap-6 flex flex-col">
                        <h3 className="text-(--text-primary)">Portafolio de proyectos</h3>
                        <ul className="space-y-2">
                            {stats.map(({ label, value }) => (
                                <li key={label}>
                                    <span className="font-semibold text-(--text-primary)">{label}:</span>{" "}
                                    {value}
                                </li>
                            ))}
                        </ul>
                        </div>
                <div className="mt-4 glass-effect rounded-2xl p-4">
                <ProgressBar className="text-(--text-primary)" color="orange" progreso={30} tamaño="lg" label="Impacto Colibrí - Aliado Semilla" mostrarPorcentaje={false} />
                <p className="mt-4 text-(--text-secondary)">Has asignado <span className="text-(--text-primary) font-bold"> 3/10 becas Semilla de luz. </span> Aún tienes 7 becas pendientes, asígnalas para aumentar tu reputación</p>
                </div>
                            <div className="w-full justify-center flex">
                <button className="cursor-pointer font-semibold text-sm primary-button rounded-2xl p-4 text-(--text-primary) w-fit mt-4" 
                >Exportar report de impacto</button>
                </div>
                    </div>
                    
                
            </div>
            <div className=" p-4 w-full rounded-2xl glass-effect border-glass">
              
                <h1 className="font-bold mb-6 text-(--text-primary)">Portafolio de colibrís becados</h1>
                <div className="w-full overflow-x-auto rounded-2xl glass-effect border-glass">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-(--text-secondary)">
            <th className="px-4 py-3 font-semibold">Proyecto</th>
            <th className="hidden px-4 py-3 font-semibold md:table-cell">
              Emprendedor
            </th>
            <th className="px-4 py-3 font-semibold">Tramo</th>
            <th className="px-4 py-3 font-semibold">IC</th>
            <th className="px-4 py-3 font-semibold">Estado</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {projectsInfo && projectsInfo.length === 3 && projectsInfo.map((project, index) => (
            <tr
              key={project.nftProject.id}
              className={`border-b  border-gray-100 last:border-0 ${
                index % 2 === 0 ? "bg-var(--theme-surface-background)" : "glass-effect-dark"
              }`}
            >
              {/* Colibri / Proyecto */}
              <td className="px-4 py-3">
                <p className="font-semibold text-(--text-primary)">{project.nftProject.project.projectName}</p>
                <p className="text-xs text-(--text-secondary)">{project.nftProject.project.industry}</p>
                <p className="text-xs text-(--text-tertiary)">{project.nftProject.project.country}</p>
              </td>

              {/* Emprendedor - oculto en mobile */}
              <td className="hidden px-4 py-3 text-(--text-secondary) md:table-cell">
                {project.user.fullName}
              </td>

              {/* NFT · Tramo */}
              <td className="px-4 py-3 text-(--text-secondary)">
                <span>{project.tramo.code}</span>
              </td>

              {/* IC */}
              <td className="px-4 py-3 text-(--text-secondary)">
                {project.ic}
              </td>

              {/* Estado */}
              <td className="px-4 py-3">
                <StatusBadge estado={project.nftProject.project.status} />
              </td>

              {/* Acción */}
              <td className="px-4 py-3 text-right">
                <a
                  href={`/dashboard/${project.nftProject.projectId}/about`}
                  className="font-semibold primary-button p-2 border-glass rounded-full text-sm font-medium text-blue-500 hover:text-blue-700 hover:underline whitespace-nowrap"
                >
                  Ver en R-Lab
                </a>
              </td>
            </tr>
          ))
           }
        </tbody>
      </table>
    </div>
            </div>
        </div>
    )
}