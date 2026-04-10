import { project } from "@/lib/mock-data";

export default function NftAvatar({ size = "sm", rounded = false }) {
  const isLarge = size === "lg";

  return (
      <div className={`${isLarge ? "h-64 w-64" : "h-14 w-14"} ${rounded ? "rounded-full" : "rounded"} relative flex items-center justify-center `}>
        <img 
          className={`w-full h-full object-contain m-6 ${rounded ? "rounded-full" : "rounded-xl"}`}
          src={`7.png`}
          alt="NFT Avatar"
        />
      </div>
  );
}
