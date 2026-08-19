import { useTranslation } from '@/hooks/useTranslation';

export default function StatusBadge({ status }) {
  const { t } = useTranslation('enums');

  const styles = {
    // MicroActionInstanceStatus
    pending: 'badge badge-warning',
    submitted: 'badge badge-info',
    completed: 'badge badge-success',

    // MicroActionInstanceChangeType
    created: 'badge badge-default',
    status_change: 'badge badge-info',
    notes_update: 'badge badge-default',
    reopened: 'badge badge-warning',
    rejected: 'badge badge-danger',

    // Estados que ya existían en otras partes
    under_review: 'badge badge-info',
    approved: 'badge badge-success',
    draft: 'badge badge-default',
  };

  const labels = {
    pending: 'Pendiente',
    submitted: 'Enviada',
    completed: 'Completada',
    created: 'Creada',
    status_change: 'Cambio de estado',
    notes_update: 'Notas actualizadas',
    reopened: 'Reabierta',
    rejected: 'Rechazada',
    under_review: 'En revisión',
    approved: 'Aprobada',
    draft: 'Borrador',
  };

  const badgeClass = styles[status] ?? 'badge badge-default';
  const label = labels[status] ?? t(status) ?? status ?? '-';

  return <span className={`${badgeClass} whitespace-nowrap`}>{label}</span>;
}
