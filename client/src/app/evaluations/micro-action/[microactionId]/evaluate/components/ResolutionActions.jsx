'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from 'lucide-react';
import Button from '@/components/ui/Button';

import ResolutionModal from './ResolutionModal';

export default function ResolutionActions({
  version,
  disabled = false,
  onResolved,
}) {
  const [modal, setModal] = useState(null);

  const openModal = (action) => {
    if (disabled) return;

    setModal(action);
  };

  const closeModal = () => {
    setModal(null);
  };

  return (
    <>
      <div className="glass-effect rounded-2xl p-6 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="glass-effect-cyan rounded-xl p-3">
            <ShieldCheck className="h-6 w-6 text-accent-cyan" />
          </div>

          <div>
            <p className="text-overline">
              Resolución
            </p>

            <h2 className="text-h3 mt-1">
              Evaluar versión
            </h2>
          </div>
        </div>

        <div className="border-theme-bottom my-6" />

        {disabled ? (
          <div className="empty-state rounded-xl p-5">
            <p className="text-body">
              Esta versión ya fue resuelta.
            </p>

            <p className="text-helper mt-2">
              No es posible modificar nuevamente su estado.
            </p>
          </div>
        ) : (
          <>
            <p className="text-body--muted">
              Revisa toda la información presentada antes
              de tomar una decisión sobre esta versión.
            </p>

            <div className="flex flex-col gap-3 mt-6">
              <Button
                variant="primary"
                fullWidth
                onClick={() => openModal('completed')}
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>Aprobar versión</span>
              </Button>

              <Button
                variant="danger-outline"
                fullWidth
                onClick={() => openModal('rejected')}
              >
                <XCircle className="h-5 w-5" />
                <span>Rechazar versión</span>
              </Button>
            </div>
          </>
        )}
      </div>

      {modal && (
        <ResolutionModal
          action={modal}
          version={version}
          onClose={closeModal}
          onResolved={(updatedVersion) => {
            closeModal();

            if (onResolved) {
              onResolved(updatedVersion);
            }
          }}
        />
      )}
    </>
  );
}
