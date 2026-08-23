'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWalletLogin } from '@/hooks/useWalletLogin';
import { useLogin } from '@/hooks/useLogin';
import { useProjects } from '@/hooks/queries/useProjects';
import { useUserStore } from '@/lib/store';
import { useTranslation } from '@/hooks/useTranslation';
import Button from '@/components/ui/Button';

export default function WalletButton({ onLoadingChange }) {
  const { t } = useTranslation('login');
  const router = useRouter();
  const { connectAndSign, status } = useWalletLogin();
  const { userData } = useLogin();
  const setRol = useUserStore((state) => state.setRol);
  const { data: allProjectsResponse } = useProjects();
  const [error, setError] = useState('');

  const handleWalletLogin = async () => {
    setError('');
    onLoadingChange?.(true);

    const result = await connectAndSign();

    if (!result.success) {
      setError(result.error);
      onLoadingChange?.(false);
      return;
    }

    const userResult = await userData();
    if (userResult.error) {
      setError('Error al obtener información del usuario');
      onLoadingChange?.(false);
      return;
    }

    setRol(userResult.data.role);

    if (userResult.data.role === 'mecenas_semilla') {
      router.push('/user/nft');
      return;
    }
    if (userResult.data.role === 'mentor' || userResult.data.role === 'evaluator') {
      router.push('/evaluations');
      return;
    }
    if (userResult.data.role === 'entrepreneur') {
      const project = allProjectsResponse?.find(
        (project) => project.owner?.id === userResult.data.sub,
      );
      if (project) {
        router.push(`/dashboard/${project.id}/about`);
      } else {
        router.push('/proyecto');
      }
      return;
    }
    router.push('/home');
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'connecting':
        return t('walletConnecting') || 'Conectando MetaMask...';
      case 'signing':
        return t('walletSigning') || 'Firmando mensaje...';
      case 'authenticating':
        return t('walletAuthenticating') || 'Autenticando...';
      default:
        return t('continueWallet') || 'Conectar Wallet';
    }
  };

  const isDisabled = status !== 'idle';

  return (
    <div>
      <Button
        variant="secondary-full"
        fullWidth
        onClick={handleWalletLogin}
        disabled={isDisabled}
      >
        {getStatusLabel()}
      </Button>
      {error && (
        <p className="text-red-500 text-sm text-center mt-2">{error}</p>
      )}
    </div>
  );
}
