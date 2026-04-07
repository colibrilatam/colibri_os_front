

export default function NftAvatar({ size = "sm" }) {
  const isLarge = size === "lg";

  return (
      <div className={`${isLarge ? "h-64 w-64" : "h-14 w-14"}   relative flex items-center justify-center `}>
        <img 
          className="w-full h-full object-contain rounded-full"
          src="/T4.png" 
          alt="NFT Avatar"
        />
      </div>
  );
}
