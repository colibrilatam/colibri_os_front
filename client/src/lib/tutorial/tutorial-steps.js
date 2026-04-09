// lib/tutorial-steps.js

export function getDashboardSteps(isMobile) {
  return [
    {
      tour: "dashboard-tour",
      steps: [
        {
          icon: "🖼️",
          title: "NFT Colibrí",
          content: "Tu identidad reputacional visual dentro de Colibrí OS.",
          selector: "#nft",
          side: isMobile ? "top" : "right",  // 👈 condicional
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
          title: "Contexto del tramo",
          content: "Incertidumbre, riesgo y ventana estimada del tramo actual.",
          selector: "#contexto",
          side: isMobile ? "top" : "top",
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },
      ],
    },
  ];
}