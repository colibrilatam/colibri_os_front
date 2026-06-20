import { useTranslation } from '@/hooks/useTranslation';

export default function GoogleButton() {
  const { t } = useTranslation('login');
  const handleGoogleClick = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
  };

  return (
    <button
      onClick={handleGoogleClick}
      className="w-full mt-3 py-3 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition cursor-pointer"
    >
      {t('continueGoogle')}
    </button>
  );
}
