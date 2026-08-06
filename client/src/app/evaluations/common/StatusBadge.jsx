import { useTranslation } from '@/hooks/useTranslation';

export default function StatusBadge({ status }) {
  const { t } = useTranslation('enums');
  const styles = {
    submitted: 'badge badge-warning',
    under_review: 'badge badge-info',
    approved: 'badge badge-success',
    rejected: 'badge badge-danger',
    draft: 'badge badge-default',
  };

  return (
    <span className={`${styles[status]} whitespace-nowrap`}>{t(status)}</span>
  );
}
