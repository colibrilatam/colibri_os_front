// lib/tutorial-steps.js

export function getDashboardSteps(isMobile) {
  return [
    {
      tour: "senial",
      steps: [

        {
          icon: "🖼️",
          title: "Estado actual del proyecto",
          content: "Un resumen del estado actual del proyecto.",
          selector: "#estado",
          side: isMobile ? "bottom" : "bottom",  // 👈 posición
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },
        {
          icon: "🖼️",
          title: "NFT Colibrí",
          content: "Tu identidad reputacional visual dentro de Colibrí OS.",
          selector: "#nft",
          side: isMobile ? "top" : "right",  // 👈 posición
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },
        {
          icon: "📊",
          title: "Índice de Comportamiento",
          content: "Tu señal reputacional actual sobre la escala máxima.",
          selector: "#ic",
          side: isMobile ? "top" : "left",
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },
        {
          icon: "🧭",
          title: "Estado del avance en el tramo",
          content: "Métricas del estado actual del avance en el tramo.",
          selector: "#contexto",
          side: isMobile ? "top" : "top",
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },
        {
          icon: "!!",
          title: "Incertidumbre y riesgos",
          content: "Incertidumbre y riesgos del tramo actual.",
          selector: "#incertidumbre",
          side: isMobile ? "top" : "top",
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },
      ],
    },
  ];
}


export function getTramoSteps(isMobile) {
  return [
    {},
  ];
}