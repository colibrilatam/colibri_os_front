const uncertaintyType = {
  market: 'Mercado',
  technical: 'Técnica',
  financial: 'Financiera',
  operational: 'Operativa',
  regulatory: 'Regulatoria',
};

export const getUncertaintyLabel = (type) => {
  const normalized = type?.toLowerCase().trim();
  return uncertaintyType[normalized] || type;
};
