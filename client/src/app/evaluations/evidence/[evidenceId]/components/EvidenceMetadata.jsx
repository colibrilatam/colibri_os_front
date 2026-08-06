import { useTranslation } from '@/hooks/useTranslation';
import Info from '../../../common/Info';

export default function EvidenceMetadata({ evidence }) {
    const { t } = useTranslation('enums');
  
  return (
    <div className="glass-effect rounded-2xl p-6 flex flex-col gap-5">
      <p className="text-overline mb-2">Metadatos</p>

      <Info label="Estado" value={t(evidence.status)} />

      <Info label="Validación" value={t(evidence.validationStatus)} />

      <Info label="Confianza" value={evidence.validationConfidence} />

      <Info label="Privacidad" value={t(evidence.privacyLevel)} />

      <Info
        label="Válida para IC"
        value={evidence.isValidForIc ? 'Sí' : 'No'}
      />

      <Info label="Hash" value={evidence.contentHash} />

      <Info
        label="Creada"
        value={new Date(evidence.createdAt).toLocaleString()}
      />

      <Info
        label="Actualizada"
        value={new Date(evidence.updatedAt).toLocaleString()}
      />
    </div>
  );
}
