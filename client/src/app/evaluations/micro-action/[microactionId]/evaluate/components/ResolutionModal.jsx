'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Loader2, X } from 'lucide-react';
import { microActionService } from '@/services/micro-action';

export default function ResolutionModal({
  action,
  version,
  onClose,
  onResolved,
}) {
  const [summary, setSummary] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  console.log(action);
  console.log(summary);

  const isApproval = action === 'completed';

  const title = isApproval ? 'Aprobar versión' : 'Rechazar versión';

  const description = isApproval
    ? 'Confirma que la versión cumple con los requisitos establecidos.'
    : 'Indica al responsable por qué la versión debe ser rechazada.';

  const submit = async () => {
    const cleanSummary = summary.trim();

    if (!cleanSummary) {
      setError('Debes ingresar un resumen antes de continuar.');

      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const updatedVersion = await microActionService.resolveVersion(
        version.id,
        {
          status: action,
          summary: cleanSummary,
        },
      );

      onResolved(updatedVersion);
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message || 'No fue posible resolver la versión.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] overlay-bg flex items-center justify-center p-6">
      <div
        className="
          glass-effect
          rounded-2xl
          w-full
          max-w-2xl
          max-h-[90vh]
          overflow-y-auto
          custom-scrollbar
        "
      >
        {/* Header */}

        <div className="flex items-start justify-between gap-4 p-6 border-theme-bottom">
          <div className="flex items-start gap-4">
            <div
              className={
                isApproval
                  ? 'badge-success rounded-xl p-3'
                  : 'badge-danger rounded-xl p-3'
              }
            >
              {isApproval ? (
                <CheckCircle2 className="h-7 w-7" />
              ) : (
                <XCircle className="h-7 w-7" />
              )}
            </div>

            <div>
              <p className="text-overline">Versión #{version.versionNumber}</p>

              <h2 className="text-h2 mt-1">{title}</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="
              filter-chip
              rounded-xl
              p-2
              cursor-pointer
            "
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}

        <div className="p-6">
          <p className="text-body--muted">{description}</p>

          <div className="mt-6">
            <label
              htmlFor="resolution-summary"
              className="text-micro-label block mb-3"
            >
              Resumen de la resolución
            </label>

            <textarea
              id="resolution-summary"
              value={summary}
              onChange={(event) => {
                setSummary(event.target.value);

                if (error) {
                  setError(null);
                }
              }}
              disabled={submitting}
              rows={6}
              placeholder={
                isApproval
                  ? 'Explica por qué la versión cumple con los requisitos...'
                  : 'Explica qué requisitos no fueron cumplidos...'
              }
              className="
                w-full
                rounded-xl
                surface-secondary
                border-theme
                px-4
                py-3
                text-body
                text-primary-theme
                placeholder:text-tertiary-theme
                resize-none
                focus:outline-none
              "
            />

            <div className="flex justify-between mt-2">
              <span className="text-helper">
                Este comentario quedará registrado en la versión.
              </span>

              <span className="text-legend">{summary.length}/1000</span>
            </div>
          </div>

          {error && (
            <div className="badge-danger rounded-xl p-4 mt-5">
              <p className="text-data">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}

        <div className="border-theme-top p-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="
              filter-chip
              rounded-xl
              px-5
              py-3
              cursor-pointer
            "
          >
            <span className="text-data">Cancelar</span>
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={submitting || !summary.trim()}
            className="
              btn-primary
              rounded-xl
              px-6
              py-3
              cursor-pointer
              disabled:opacity-50
              disabled:cursor-not-allowed
              flex
              items-center
              justify-center
              gap-2
            "
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />

                <span className="text-data">Guardando...</span>
              </>
            ) : (
              <>
                {isApproval ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}

                <span className="text-data">
                  {isApproval ? 'Confirmar aprobación' : 'Confirmar rechazo'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
