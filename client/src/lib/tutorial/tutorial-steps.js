// lib/tutorial-steps.js

export function getDashboardSteps(isMobile) {
  return [
    {
      tour: "tramo",
      steps: [
        {
          icon: "!",
          title: "Riesgos e incertidumbre",
          content: "En esta capa podrás ver los riesgos e incertidumbre que enfrenta el emprendimiento.",
          selector: "#cabecera",
          side: isMobile ? "bottom" : "bottom", // 👈 posición
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },
        {
          icon: "!",
          title: "Incertidumbre",
          content: "La incertidumbre del tramo actual que enfrenta el emprendimiento.",
          selector: "#incertidumbre",
          side: isMobile ? "top" : "bottom", // 👈 posición
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },
         {
          icon: "",
          title: "Riesgos",
          content: "Los riesgos del tramo actual que enfrenta el emprendimiento.",
          selector: "#riesgos",
          side: isMobile ? "top" : "bottom", // 👈 posición
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },
        {
          icon: "",
          title: "Riesgos e incertidumbre de todos los tramos",
          content: "Todos los riesgos e incertidumbres del tramo actual y su estado correspondiente al emprendimiento.",
          selector: "#tramos",
          side: isMobile ? "top" : "top", // 👈 posición
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },
      ]
    },
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