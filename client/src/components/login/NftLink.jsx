"use client"
import { Wallet } from "lucide-react"
import LoadingScreen from "../LoadingScreen"
import { useState } from "react"
import { useTranslation } from "@/hooks/useTranslation"

export default function NftLink({ onSuccess, onBack, role }){
  const { t } = useTranslation('login');
    // estado de vistas
    const [view , setView] = useState('nftLink'); // nftLink | loading | verified
    const handleVerifyNFT = () => {
  setView("loading");
  setTimeout(() => {
    setView("verified");
  }, 1000);
};

    return(
        <div>
            <button className="w-fit mb-2 p-3 rounded-lg font-semibold transition  'bg-[var(--action-primary)] hover:bg-(--action-primary-hover) cursor-pointer bg-gray-500" onClick={onBack}>
                {t('back')}
            </button>
            {view === 'loading' && <div className="text-center w-full h-full text-2xl glass-effect-green p-4 border-glass rounded-2xl m-4"> {t('detectingNft')} </div>}
            {view === 'nftLink' && (
            <div className="text-center flex flex-col items-center gap-4 p-6 border glass-effect shadow-3xl rounded-lg ">
                <Wallet size={64} strokeWidth={1.5} className="text-gray-400" />
                <h3>{t('verifyNftTitle')}</h3>
                <p className="text-(--text-tertiary)">{t('verifyNftDesc')}</p>
                <button onClick={() => handleVerifyNFT()} className="w-full py-3 rounded-lg font-semibold transition  'bg-[var(--action-primary)] hover:bg-(--action-primary-hover) cursor-pointer bg-gray-500">{t('verifyNftButton')}</button>
            </div>
            )}
            {view === 'verified' && (
                <div className="text-center flex flex-col items-center gap-4 p-6 border glass-effect shadow-3xl rounded-lg ">
                    <h2 className="text-green-700">{t('nftDetected')}</h2>
                    <h4>{t('nftName')}</h4>
                    <h5 className="text-(--text-tertiary) border border-gray-500 rounded-full p-2  ">1A7324JACJDA</h5>

                    <div className="glass-effect-green p-2 rounded-2xl">
                        <h4>{t('allySeed')}</h4>
                        <h3 className="text-green-700">{t('foundation')}</h3>
                        <p className="text-(--text-tertiary)">{t('nftDescription')}</p>
                    </div>
                    <button onClick={() => onSuccess()} className="w-full py-3 rounded-lg font-semibold transition  'bg-[var(--action-primary)] hover:bg-(--action-primary-hover) cursor-pointer bg-gray-500">{t('createAccount')}</button>
                </div>
            )}
        </div>
    )
}