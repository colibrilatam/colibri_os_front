import AulaPuente from '../../../public/logos/1_AulaPuente_Edtech_Venezuela.png';
import NexoCaja from '../../../public/logos/2_NexoCaja_Fintech_Argentina.png';
import SaludNexo from '../../../public/logos/3_SaludNexo_Healthtech_Panama.png';
import FlujoClave from '../../../public/logos/6_FlujoClave_Fintech_Colombia.png';
import RutaNómina from '../../../public/logos/4_RutaNomina_Saas_Colombia.png';
import TrayectoClaro from '../../../public/logos/5_TrayectoClaro_Edtech_Chile.png';
import RiegoPulso from '../../../public/logos/7_RiegoPulso_Agrotech_Bolivia.jpg';

const images = [
  { name: 'AgroIA', image: '' },
  { name: 'AulaPuente', image: AulaPuente },
  { name: 'NexoCaja', image: NexoCaja },
  { name: 'EcoTech', image: '' },
  { name: 'SaludNexo', image: SaludNexo },
  { name: 'FlujoClave', image: FlujoClave },
  { name: 'RutaNómina', image: RutaNómina },
  { name: 'TrayectoClaro', image: TrayectoClaro },
  { name: 'RiegoPulso', image: RiegoPulso },
];

export function getProjectImage(projectName) {
  const match = images.find((img) => img.name === projectName);
  return match?.image;
}
