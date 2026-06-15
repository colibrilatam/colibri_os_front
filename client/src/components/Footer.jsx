'use client';

import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="surface-dark border-theme-top mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-5">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="surface border-theme rounded-full h-12 w-12 flex items-center justify-center overflow-hidden shadow-md">
            <Image
              src="/Imagotipo Colibri OS.svg"
              alt="Colibrí OS"
              width={40}
              height={40}
            />
          </div>

          <div className="text-center md:text-left">
            <div className="text-data--label font-semibold">
              Powered by Colibrí OS
            </div>

            <div className="text-helper">
              Estándar Reputacional Colibrí LATAM
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
