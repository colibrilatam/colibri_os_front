const projectTeamStats = [
  {
    projectName: 'AulaPuente',
    men: 3,
    women: 2,
  },
  {
    projectName: 'NexoCaja',
    men: 4,
    women: 1,
  },
  {
    projectName: 'SaludNexo',
    men: 2,
    women: 5,
  },
  {
    projectName: 'RutaNómina',
    men: 5,
    women: 3,
  },
  {
    projectName: 'TrayectoClaro',
    men: 2,
    women: 4,
  },
  {
    projectName: 'FlujoClave',
    men: 6,
    women: 2,
  },
  {
    projectName: 'FlujoClaveT4',
    men: 3,
    women: 3,
  },
  {
    projectName: 'RiegoPulso',
    men: 7,
    women: 1,
  },
  {
    projectName: 'TurnoBase',
    men: 4,
    women: 4,
  },
];

export function getProjectTeamStats(name) {
  const normalized = (name || '').toLowerCase();

  const match = projectTeamStats.find(
    (p) => p.projectName.toLowerCase() === normalized,
  );

  return {
    men: match?.men || 0,
    women: match?.women || 0,
  };
}