[
    {
      tour: "evidencia", // Capa / Ruta / Página del tutorial
      steps: [
        {
          icon: "📊", // Ícono del paso
          title: "Métricas de evidencias del tramo", //Título del paso
          content: "En esta sección podrás ver las métricas resumidas de las evidencias del tramo.", // Descripción del paso
          selector: "#metricas",
          side: isMobile ? "bottom" : "bottom", // 👈 posición
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },
        {
          icon: "📊",
          title: "Lista de evidencias del tramo",
          content: "En esta sección podrás ver las evidencias del tramo con información resumida.",
          selector: "#lista",
          side: isMobile ? "bottom" : "right", // 👈 posición
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },
        {
          icon: "📊",
          title: "Detalle de la evidencia",
          content: "En esta sección podrás ver los detalles de la evidencia seleccionada.",
          selector: "#detalle",
          side: isMobile ? "bottom" : "left", // 👈 posición
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },

      ]
    },
    {
      tour: "trayectoria",
      steps: [
        {
          icon: "📊",
          title: "Trayectoria operativa del tramo",
          content: "En esta capa podrás ver el progreso del emprendimiento en el tramo actual, con sus microacciones y evidencias.",
          selector: "#cabecera",
          side: isMobile ? "bottom" : "bottom", // 👈 posición
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },
        {
          icon: "🧭",
          title: "Línea del tiempo del avance del tramo",
          content: "En la línea del tiempo se muestran todos los PACs del tramo y su estado. Puedes hacer click en cada uno para ver su detalle.",
          selector: "#timeline",
          side: isMobile ? "bottom" : "bottom", // 👈 posición
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },
        {
          icon: "",
          title: "Detalle del PAC seleccionado",
          content: "En esta sección se muestra el detalle del PAC seleccionado en la línea del tiempo.",
          selector: "#detalle",
          side: isMobile ? "top" : "right", // 👈 posición
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },
        {
          icon: "",
          title: "Carga operativa del PAC",
          content: "En esta sección podrás gestionar las microacciones y evidencias del PAC seleccionado.",
          selector: "#carga",
          side: isMobile ? "top" : "left", // 👈 posición
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },
      ]
    },
    {
      tour: "tramo",
      steps: [
        {
          icon: "",
          title: "Riesgos e incertidumbre",
          content: "En esta capa podrás ver los riesgos e incertidumbre que enfrenta el emprendimiento.",
          selector: "#cabecera",
          side: isMobile ? "bottom" : "bottom", // 👈 posición
          showControls: true,
          pointerPadding: 10,
          pointerRadius: 8,
        },
        {
          icon: "",
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
          side: isMobile ? "top" : "bottom top left right", // 👈 posición
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