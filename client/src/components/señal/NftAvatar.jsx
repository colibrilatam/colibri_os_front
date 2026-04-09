import { project } from "@/lib/mock-data";

export default function NftAvatar({ size = "sm" }) {
  const isLarge = size === "lg";

  return (
      <div className={`${isLarge ? "h-64 w-64" : "h-14 w-14"} rounded relative flex items-center justify-center `}>
        <img 
          className="w-full h-full object-contain rounded-xl m-6"
          src={`${project.tramoCode}.png`}
          alt="NFT Avatar"
        />
      </div>
  );
}
