import { useProject } from "@/lib/projectContext";
import { useState } from "react";


const CopyIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CopyField = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center justify-between gap-3  min-w-fit w-full cursor-pointer px-4 py-2 rounded-full border transition-all
        ${copied
          ? "bg-green-50 border-green-300"
          : "bg-amber-50 border-amber-200 hover:bg-amber-100 hover:border-amber-300"
        }`}
    >
      <span className="text-sm text-stone-700 truncate text-left">{value}</span>
      <span
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border transition-all
          ${copied
            ? "bg-green-100 border-green-300 text-green-600"
            : "bg-white border-stone-200 text-stone-500"
          }`}
      >
        <CopyIcon />
      </span>
    </button>
  );
};

export default function EntrepreneurCard ({ name, email, phone, linkedin }) {

  const { dbProject } = useProject();

  return (
    <div className="glass-effect border-glass rounded-2xl p-8 w-full shadow-sm flex flex-col gap-5">
      {/* Nombre — no clickeable */}
      <div className="border-b border-stone-100 pb-5 w-fit">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">Emprendedor</p>
        <h2 className="text-2xl font-semibold text-white">{dbProject.owner.fullName}</h2>
      </div>

      {/* Email */}
      <div>
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Email</p>
        <CopyField value={dbProject.owner.email} />
      </div>

      {/* Teléfono */}
      <div>
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Teléfono</p>
        <CopyField value={dbProject.owner.phone ? dbProject.owner.phone : "No registró número de teléfono"} />
      </div>

      {/* LinkedIn */}
      <div>
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">LinkedIn</p>
        <CopyField value={dbProject.owner.linkedinId ? dbProject.owner.linkedinId : "No registró LinkedIn"} />
      </div>
    </div>
  );
};
