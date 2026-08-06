import { useTranslation } from '@/hooks/useTranslation';
import Info from '../../../common/Info';

export default function MicroActionInformation({ microAction }) {
    const { t } = useTranslation('enums');
  
  if (!microAction) {
    return null;
  }

  const definition = microAction.microActionDefinition;

  return (
    <section className="glass-effect rounded-2xl p-6 flex flex-col gap-6">
      <p className="text-overline mb-2">Microacción</p>

      {/* Información de la instancia */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Info label="Código" value={definition?.code} />

        <Info label="PAC" value={definition?.pac?.title_es} />

        <Info label="Tipo de microacción" value={definition?.microActionType} />

        <Info label="Estado" value={t(microAction.status)} />

        <Info label="Intento" value={microAction.attemptNumber} />

        <Info label="Ventana (días)" value={definition?.executionWindowDays} />

        <Info label="Comenzó" value={formatDate(microAction.startedAt)} />

        <Info label="Enviado" value={formatDate(microAction.submittedAt)} />

        <Info label="Completado" value={formatDate(microAction.completedAt)} />

        <Info label="Validado" value={formatDate(microAction.validatedAt)} />

        <Info label="Cerrado" value={formatDate(microAction.closedAt)} />

        <Info
          label="En tiempo"
          value={
            microAction.isOnTime == null
              ? '-'
              : microAction.isOnTime
                ? 'Sí'
                : 'No'
          }
        />
      </div>

      {/* Definición */}

      <div className="border-theme-top pt-5 flex flex-col gap-4">
        <p className="text-overline mb-2">Definición de la microacción</p>

        <div className="glass-effect-secondary rounded-xl p-5">
          <p className="text-micro-label mb-3">Instrucción</p>

          <p className="text-body text-primary-theme leading-8">
            {definition?.instruction_es}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <Info
            label="Requiere evidencia"
            value={definition?.evidenceRequired ? 'Sí' : 'No'}
          />

          <Info
            label="Tipo de evidencia esperado"
            value={definition?.expectedEvidenceType}
          />

          <Info
            label="Obligatoria"
            value={definition?.isRequired ? 'Sí' : 'No'}
          />

          <Info
            label="Reutilizable"
            value={definition?.isReusable ? 'Sí' : 'No'}
          />

          <Info
            label="Peso Consistencia"
            value={definition?.consistencyWeight}
          />

          <Info
            label="Peso Colaboración"
            value={definition?.collaborationWeight}
          />

          <Info
            label="Peso Sostenibilidad"
            value={definition?.sustainabilityWeight}
          />

          <Info label="Orden" value={definition?.sortOrder} />

          <Info
            label="Válido desde"
            value={formatDate(definition?.validFrom)}
          />

          <Info label="Válido hasta" value={formatDate(definition?.validTo)} />
        </div>
      </div>

      {/* Notas del emprendedor */}

      {microAction.executionNotes && (
        <div className="border-t pt-5">
          <p className="text-helper mb-2">Notas del emprendedor</p>

          <p>{microAction.executionNotes}</p>
        </div>
      )}
    </section>
  );
}

function formatDate(date) {
  if (!date) return '-';

  return new Date(date).toLocaleDateString();
}
