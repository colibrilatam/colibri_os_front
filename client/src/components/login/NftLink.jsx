"use client"
import { Wallet } from "lucide-react"
import LoadingScreen from "../LoadingScreen"
import { useState } from "react"

export default function NftLink({ onSuccess, onBack, role }){
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
                Volver
            </button>
            {view === 'loading' && <LoadingScreen />}
            {view === 'nftLink' && (
            <div className="text-center flex flex-col items-center gap-4 p-6 border glass-effect shadow-3xl rounded-lg ">
                <Wallet size={64} strokeWidth={1.5} className="text-gray-400" />
                <h3>Verificamos tu NFT de acceso</h3>
                <p className="text-(--text-tertiary)">Esta es una simulación: no firmarás transacciones reales. Solo recreamos el momento en que tu wallet es detectada por el sistema.</p>
                <button onClick={() => handleVerifyNFT()} className="w-full py-3 rounded-lg font-semibold transition  'bg-[var(--action-primary)] hover:bg-(--action-primary-hover) cursor-pointer bg-gray-500">Verificar NFT en mi wallet (demo)</button>
            </div>
            )}
            {view === 'verified' && (
                <div className="text-center flex flex-col items-center gap-4 p-6 border glass-effect shadow-3xl rounded-lg ">
                    <h2 className="text-green-700">🎉¡NFT Detectado!</h2>
                    <h4>Colibrí #001 - Semilla de luz</h4>
                    <h5 className="text-(--text-tertiary) border border-gray-500 rounded-full p-2  ">1A7324JACJDA</h5>

                    <div className="glass-effect-green p-2 rounded-2xl">
                        <h4>Aliado Semilla</h4>
                        <h3 className="text-green-700">Fundación Raíces de Luz</h3>
                        <p className="text-(--text-tertiary)">Beca completa. Asociado permanentemente a tu NFT.</p>
                    </div>
                    <button onClick={() => onSuccess()} className="w-full py-3 rounded-lg font-semibold transition  'bg-[var(--action-primary)] hover:bg-(--action-primary-hover) cursor-pointer bg-gray-500">Crear cuenta</button>
                </div>
            )}
        </div>
    )
}