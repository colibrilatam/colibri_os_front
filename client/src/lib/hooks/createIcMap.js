const projectIC = [
  { projectName: 'AulaPuente', ic: 1.47 },
  { projectName: 'NexoCaja', ic: 1.54 },
  { projectName: 'SaludNexo', ic: 2.34 },
  { projectName: 'RutaNómina', ic: 2.46 },
  { projectName: 'TrayectoClaro', ic: 3.29 },
  { projectName: 'FlujoClave', ic: 3.93 },
  { projectName: "FlujoClaveT4", ic: 4.01 },
  { projectName: 'RiegoPulso', ic: 4.27 },
  { projectName: 'TurnoBase', ic: 4.22 },
];

function clampIC(value) {
  return Math.min(5.99, Math.max(0.1, value));
}
export function getProjectIC(name) {
  const normalized = (name || '').toLowerCase();

  const match = projectIC.find((p) => p.projectName.toLowerCase() === normalized);

  const value = match ? clampIC(match.ic) : 0.1;

  return value.toFixed(2); // "1.47"
}
