"use client";
import { Onborda, OnbordaProvider } from "onborda";
import { useEffect, useState } from "react";
import { getDashboardSteps } from "./tutorial-steps";
import TourCard from "@/components/tutoriales/TourCard";

export default function OnbordaWrapper({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check(); // chequeo inicial
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const steps = getDashboardSteps(isMobile);

  return (
    <OnbordaProvider>
      <Onborda
        steps={steps}
        showOnborda={true}
        shadowRgb="0,0,0"
        shadowOpacity="0.7"
        cardComponent={TourCard}
      >
        {children}
      </Onborda>
    </OnbordaProvider>
  );
}