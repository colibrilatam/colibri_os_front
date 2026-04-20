import image1 from '../../../public/logos/8_TurnoBase_Hrtech_Chile.jpg';
import image2 from '../../../public/logos/1_AulaPuente_Edtech_Venezuela.png';
import image3 from '../../../public/logos/2_NexoCaja_Fintech_Argentina.png';
import image5 from '../../../public/logos/3_SaludNexo_Healthtech_Panama.png';
import image6 from '../../../public/logos/6_FlujoClave_Fintech_Colombia.png';
import image7 from '../../../public/logos/4_RutaNomina_Saas_Colombia.png';
import image8 from '../../../public/logos/5_TrayectoClaro_Edtech_Chile.png';
import image9 from '../../../public/logos/7_RiegoPulso_Agrotech_Bolivia.jpg';

const images = [
  { id: 'd8232c46-f02f-417d-8bcf-4340059abc34', image: image1 },
  { id: '1f3e7410-9d12-41f0-a91a-e36f7175d126', image: image2 },
  { id: '0996d11c-72fe-48ff-b5a1-287946d65e17', image: image3 },
  { id: 'a66f9853-c32b-4101-90fe-8d0ba55edd47', image: '' },
  { id: '03a3e151-358f-4ece-99db-703980b72af6', image: image5 },
  { id: '3a3adda6-11f8-4b8e-9840-61cc90d1901c', image: image6 },
  { id: '95ffde6a-bcd3-46ed-b2b5-50262c8d6885', image: image7 },
  { id: 'cdf6a2e5-114d-4eec-8388-bc67cc88f1eb', image: image8 },
  { id: '2f944112-f741-477e-a333-4edfed8c8cb7', image: image9 },
];

export function getProjectImage(projectId) {
  const match = images.find((img) => img.id === projectId);
  return match?.image;
}
