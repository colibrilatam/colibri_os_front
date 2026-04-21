"use client"
import Header from "@/components/Header";
import { useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function UserLayout({ children }) {
  
    const { isAuthenticated } = useUserStore();
    const router = useRouter();
/*
    if(!isAuthenticated()) return (
        <div className="flex flex-col w-lvw h-lvh items-center justify-center gap-6 glass-effect-red ">
            <div className="glass-effect p-4 gap-6 items-center flex flex-col rounded-2xl border-glass">
            <h1>Parece que no has iniciado sesión</h1>
            <h2>Para acceder a esta sección debes iniciar sesión</h2>
            <a className=" p-4 rounded-full glass-effect cursor-pointer " onClick={() => router.push("/login")} href="/login">Iniciar sesión</a>
            </div>
        </div>
    )
*/  
  return (
    <div>
        <Header isHome={true}></Header>
        {children}
    </div>
  );
}
