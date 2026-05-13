// lib/tutorial-steps.js

export function getDashboardSteps(isMobile) {
  return [
    {
      tour: "reputacion",
      steps: [
        {
          icon: "📊",
          title: "Nivel de reputación en las 5 dimensiones",
          content: "Tu nivel de reputación medido en las 5 dimensiones.",
          selector: "#radar",
          side: isMobile ? "bottom" : "right", // 👈 posición
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },
        {
          icon: "📊",
          title: "Desglose de las 5 dimensiones",
          content: "Detalle del nivel de reputación de las 5 dimensiones, separadas en 2 grupos.",
          selector: "#arquitectura",
          side: isMobile ? "top" : "left", // 👈 posición
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },
        {
          icon: "📊",
          title: "Grupo legitimidad",
          content: "Detalle del nivel de reputación de dimensiones de legitimidad, acción y evidencia.",
          selector: "#legitimidad",
          side: isMobile ? "top" : "left", // 👈 posición
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },
        {
          icon: "📊",
          title: "Grupo diferenciación",
          content: "Detalle del nivel de reputación de dimensiones de diferenciación, consistencia, colaboración y sostenibilidad.",
          selector: "#diferenciacion",
          side: isMobile ? "top" : "left", // 👈 posición
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },
        {
          icon: "📊",
          title: "Resumen de balance reputacional",
          content: "Resumen de nivel reputacional en los dos grupos diferenciación y legitimidad.",
          selector: "#balance",
          side: isMobile ? "top" : "right", // 👈 posición
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },
      ]
    },
    {
      tour: "identidad",
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