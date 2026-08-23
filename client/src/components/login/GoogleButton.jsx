import { useTranslation } from '@/hooks/useTranslation';
import Button from '@/components/ui/Button';

export default function GoogleButton() {
  const { t } = useTranslation('login');
  const handleGoogleClick = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
  };

  return (
    <Button
      variant="secondary-full"
      fullWidth
      onClick={handleGoogleClick}
    >
      {t('continueGoogle')}
    </Button>
  );
}
