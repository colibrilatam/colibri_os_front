import { usePathname } from "next/navigation";
import { useProject } from "@/lib/projectContext";

export default function NftAvatar({ size = "sm", rounded = false }) {
  const isLarge = size === "lg";
  const { tramoData } = useProject();
  // obtencion del id por parametro 
  const pathname = usePathname(); 

  // 1. Dividimos por "/" -> ["", "dashboard", "1", "senial"]
  // 2. El "1" está en la posición 2 del array
  const segments = pathname.split('/');
  const id = segments[2];


  return (
      <div className={`${isLarge ? "h-64 w-64" : "h-14 w-14"} ${rounded ? "rounded-full" : "rounded"} relative flex items-center justify-center `}>
        <img 
          className={`w-full h-full object-contain m-6 ${rounded ? "rounded-full" : "rounded-xl"}`}
          src={`${tramoData.nftImageUrl}`}
          alt="NFT Avatar"
        />
      </div>
  );
}
