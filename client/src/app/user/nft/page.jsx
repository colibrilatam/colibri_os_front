"use client"
import { useUserStore } from "@/lib/store"

export default function NftPage(){

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

const STATUS_STYLES = {
  "en vuelo": {
    bg: "bg-blue-500/10",
    border: "border-blue-500/40",
  },
  "alto impacto": {
    bg: "bg-green-500/10",
    border: "border-green-500/40",
  },
  "en progreso": {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/40",
  },
};

const projects = [
  {
    nombre: "EcoSolar LATAM",
    industria: "Energía renovable",
    estado: "en vuelo",
    idNFT: "#00412",
    tramo: "T2",
    ic: 1.35,
  },
  {
    nombre: "AgroRaíz Pampa",
    industria: "Agricultura regenerativa",
    estado: "alto impacto",
    idNFT: "#00587",
    tramo: "T3",
    ic: 4.72,
  },
  {
    nombre: "RedComún Barrios",
    industria: "Tecnología social",
    estado: "en progreso",
    idNFT: "#00231",
    tramo: "T1",
    ic: 0.89,
  },
];

    const { token } = useUserStore()

    return(
        <div className="flex flex-col lg:flex-row w-full h-full p-1 lg:p-3 gap-2">
            <div className="glass-effect border-glass rounded-2xl p-4 w-full">
                <div className="flex flex-col md:flex-row md:justify-between">
                    <h1>Tu impacto como aliado</h1>
                    <p className="w-fit glass-effect-green border-glass rounded-full p-2 text-(--text-primary)">Portafolio NFT</p>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between gap-2 mt-4">
                    <div className="glass-effect rounded-2xl p-4 text-(--text-secondary) w-full gap-6 flex flex-col">
                        <h3 className="text-(--text-primary)">Portafolio de colibrís</h3>
                        <ul className="space-y-2">
                            {stats.map(({ label, value }) => (
                                <li key={label}>
                                    <span className="font-semibold text-(--text-primary)">{label}:</span>{" "}
                                    {value}
                                </li>
                            ))}
                        </ul>
                        <div>
                            <h3>Reputación de mecenas?</h3>
                            <h5>barra de progreso con reputación de mecenas?</h5>
                        </div>
                    </div>
                    <div className="glass-effect w-full rounded-2xl p-4">
                        <h3>Colibrís activos</h3>
                        <div className="flex flex-col gap-2 mt-4">
{ projects.map((project) => (
    <div className={`rounded-xl border p-2 ${STATUS_STYLES[project.estado].bg} ${STATUS_STYLES[project.estado].border} flex flex-row justify-between`}>
                            <div key={project.idNFT} className="flex flex-col text-(--text-secondary)">
                                <div>
                                    <h4 className="text-(--text-primary)">{project.nombre}</h4>
                                    <p className="text-(--text-primary)">{project.industria}</p>
                                </div>
                                <div>
                                    <p><span className="text-(--text-primary)">Tramo actual:</span> {project.tramo}</p>
                                    <p><span className="text-(--text-primary)">IC:</span> {project.ic}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-around">
                                <p className="text-(--text-primary) glass-effect border-glass rounded-full p-2">{project.estado}</p>
                                <p className="text-(--text-primary) glass-effect border-glass rounded-full p-2">{project.idNFT}</p>
                            </div>
                        </div>
))}
</div>
                        
                    </div>
                </div>
            </div>
            <div className="glass-effect border-glass rounded-2xl p-4 w-full"></div>
        </div>
    )
}