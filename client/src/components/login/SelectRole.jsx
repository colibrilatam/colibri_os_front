"use client"

import { useTranslation } from "@/hooks/useTranslation";
import { HelpCircle } from "lucide-react";
import NotificationPopup from "../NotificationPopup";
import { useUserStore } from "@/lib/store";

export default function SelectRole({ onSelectRole }) {
  const { t } = useTranslation('login');

  const { isDemo, setIsDemo } = useUserStore();

  return (
    <div className="flex flex-col gap-6 items-center">
      {/* DEMO */}
      {/*<div className="gap-4 flex flex-row items-center border border-green-700 glass-effect-green p-2 rounded-full">
        <HelpCircle className="cursor-pointer"></HelpCircle>
      <label className="text-lg">Activar Demo</label>
      <input 
        checked={isDemo}
        onChange={(e) => setIsDemo(e.target.checked)}
        type="checkbox"
        className="w-6 h-6 bg-green-800"
      ></input>
      
      </div>
      */}
      <div className="flex flex-col md:flex-row gap-6" >
      {/* EMPRENDEDOR */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col justify-between hover:bg-white/10 hover:scale-[1.02] transition-all duration-200">
        <div>
          <div className="text-3xl mb-4">🚀</div>
          <p className="text-h2 mb-2">{t('entrepreneur')}</p>
          <p className="text-body--muted mb-4">
            {t('entrepreneurDesc')}
          </p>
        </div>
        <button
          onClick={() => onSelectRole('entrepreneur')}
          className="mt-6 w-full py-3 rounded-lg font-semibold bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] transition cursor-pointer"
        >
          {t('continueEntrepreneur')}
        </button>
      </div>

      {/* MECENAS */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col justify-between hover:bg-white/10 hover:scale-[1.02] transition-all duration-200">
        <div>
          <div className="text-3xl mb-4">🤝</div>
          <p className="text-h2 mb-2">{t('patron')}</p>
          <p className="text-body--muted mb-4">
            {t('patronDesc')}
          </p>
        </div>
        <button
          onClick={() => onSelectRole('mecenas_semilla')}
          className="mt-6 w-full py-3 rounded-lg font-semibold bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] transition cursor-pointer"
        >
          {t('continuePatron')}
        </button>
      </div>
      </div>
    </div>
  );
}
