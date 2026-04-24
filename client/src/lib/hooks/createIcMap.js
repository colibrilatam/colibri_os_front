const projectIC = [
  { industry: 'agritech', ic: 1.47 },
  { industry: 'edtech', ic: 2.13 },
  { industry: 'fintech', ic: 3.21 },
  { industry: 'cleantech', ic: 0.85 },
  { industry: 'healthtech', ic: 4.32 },
  { industry: 'productivity', ic: 2.67 },
  { industry: 'hrtech', ic: 3.05 },
  { industry: 'logistics', ic: 1.92 },
  { industry: 'iot', ic: 4.88 },
];

function clampIC(value) {
  return Math.min(5.99, Math.max(0.1, value));
}
export function getProjectIC(industry) {
  const normalized = (industry || '').toLowerCase();

  const match = projectIC.find((p) => p.industry === normalized);

  const value = match ? clampIC(match.ic) : 0.1;

  return value.toFixed(2); // "1.47"
}
