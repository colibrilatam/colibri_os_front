"use client";
import { useRouter } from "next/navigation"

export default function Button({ content, redirect, color = "blue", onClick }){
    const router = useRouter();

    // Mapeo de colores a gradientes CSS
    const gradients = {
        blue: 'linear-gradient(to right, rgb(147, 197, 253), rgb(96, 165, 250), rgb(59, 130, 246))',
        red: 'linear-gradient(to right, rgb(252, 165, 165), rgb(248, 113, 113), rgb(239, 68, 68))',
        white: 'linear-gradient(to right, rgb(243, 244, 246), rgb(229, 231, 235), rgb(209, 213, 219))',
        green: 'linear-gradient(to right, rgb(134, 239, 172), rgb(74, 222, 128), rgb(34, 197, 94))',
    };

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
        <div className="text-lg flex items-center justify-center">
            <div className="relative group">
                <button
                    className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
                    onClick={handleClick}
                >
                    <span
                        className="absolute inset-0 rounded-xl p-0.5 transition-opacity duration-500"
                        style={{ background: gradients[color] || gradients.blue }}
                    ></span>

                    <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
                        <div className="relative z-10 flex items-center space-x-2">
                            <span className="transition-all duration-500">{content}</span>
                        </div>
                    </span>
                </button>
            </div>
        </div>
    )
};