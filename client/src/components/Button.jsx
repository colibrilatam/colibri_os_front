"use client";
import { useRouter } from "next/navigation"

export default function Button({ className ,content, redirect, color , onClick }){
    const router = useRouter();

    const handleClick = () => {
        // Ejecutar callback si existe
        if (onClick) {
            onClick();
        }
        // Redirigir si existe redirect
        if (redirect) {
            router.push(`/${redirect}`);
        }
    };

    return (
        <div className={`${className && className} text-lg flex items-center justify-center`}>
            <div className="relative group">
                <button
                    className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
                    onClick={handleClick}
                >
                    

                    <span className={`relative z-10 block px-6 py-3 rounded-xl  border border-gray-500 glass-effect${color && `-${color}`}` } 
                        
                    >
                        <div className="relative z-10 flex items-center space-x-2">
                            <span className="transition-all duration-500">{content}</span>
                        </div>
                    </span>
                </button>
            </div>
        </div>
    )
};