'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, Loader2, Unlink } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useUserStore } from '@/lib/store';
import {
  connectWallet,
  getNonce,
  signMessage,
  verifyWalletSignature,
  getLinkNonce,
  verifyLinkSignature,
  unlinkWallet,
  getChainId,
  shortenAddress,
} from '@/services/walletAuth';

export default function WalletConnect({ mode = 'login' }) {
  const { t } = useTranslation('wallet');
  const router = useRouter();
  const updateWallet = useUserStore((state) => state.updateWallet);
  const storedWallet = useUserStore((state) => state.user?.cryptoWallet ?? '');

  const [status, setStatus] = useState(storedWallet ? 'verified' : 'disconnected');
  const [walletAddress, setWalletAddress] = useState(storedWallet);
  const [error, setError] = useState('');
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (!accounts || accounts.length === 0) {
        setProvider(null);
        setWalletAddress('');
        setStatus('disconnected');
      } else {
        setWalletAddress(accounts[0]);
        setStatus('connected');
      }
    };

    const handleChainChanged = () => {
      setProvider(null);
      if (!storedWallet) {
        setStatus('disconnected');
      }
    };

    window.ethereum.on?.('accountsChanged', handleAccountsChanged);
    window.ethereum.on?.('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener?.('chainChanged', handleChainChanged);
    };
  }, [storedWallet]);

  const handleConnect = useCallback(async () => {
    setStatus('connecting');
    setError('');

    try {
      const { provider: p, address } = await connectWallet();
      setProvider(p);
      setWalletAddress(address);
      setStatus('connected');
    } catch (err) {
      setStatus('disconnected');
      setError(err.message || t('errorConnect'));
    }
  }, [t]);

  const handleSignIn = useCallback(async () => {
    if (!provider) return;

    setStatus('signing');
    setError('');

    try {
      const chainId = await getChainId(provider);
      const { message } = await getNonce(walletAddress, chainId);
      const signature = await signMessage(provider, message);
      const result = await verifyWalletSignature(message, signature);

      updateWallet(walletAddress);
      setStatus('verified');

      if (result.user?.role === 'mentor' || result.user?.role === 'evaluator') {
        router.push('/evaluations');
      } else {
        router.push('/home');
      }
    } catch (err) {
      setStatus('connected');
      setError(err.response?.data?.message || err.message || t('errorSign'));
    }
  }, [provider, walletAddress, router, updateWallet, t]);

  const handleLink = useCallback(async () => {
    if (!provider) return;

    setStatus('signing');
    setError('');

    try {
      const chainId = await getChainId(provider);
      const { message } = await getLinkNonce(walletAddress, chainId);
      const signature = await signMessage(provider, message);
      await verifyLinkSignature(message, signature);

      updateWallet(walletAddress);
      setStatus('verified');
    } catch (err) {
      setStatus('connected');
      setError(err.response?.data?.message || err.message || t('errorLink'));
    }
  }, [provider, walletAddress, updateWallet, t]);

  const handleUnlink = useCallback(async () => {
    setStatus('disconnecting');
    setError('');

    try {
      await unlinkWallet();
      updateWallet(null);
      setStatus('disconnected');
      setWalletAddress('');
      setProvider(null);
    } catch (err) {
      setStatus('connected');
      setError(err.response?.data?.message || err.message || t('errorUnlink'));
    }
  }, [updateWallet, t]);

  if (status === 'disconnected' || status === 'connecting') {
    return (
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={handleConnect}
          disabled={status === 'connecting'}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-white font-semibold transition disabled:opacity-50 cursor-pointer"
        >
          {status === 'connecting' ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Wallet size={20} />
          )}
          {status === 'connecting' ? t('connecting') : t('connectWallet')}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }

  if (status === 'signing') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 text-white">
          <Loader2 size={20} className="animate-spin" />
          <span>{t('awaitingSignature')}</span>
        </div>
        <p className="text-white/60 text-sm">{shortenAddress(walletAddress)}</p>
      </div>
    );
  }

  if (status === 'verified') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400">
          <Wallet size={20} />
          <span className="font-mono text-sm">{shortenAddress(walletAddress)}</span>
          <span className="text-xs bg-green-500/20 px-2 py-0.5 rounded-full">
            {t('verified')}
          </span>
        </div>
        {mode === 'link' && (
          <button
            type="button"
            onClick={handleUnlink}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition text-sm cursor-pointer"
          >
            <Unlink size={16} />
            {t('unlink')}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={mode === 'login' ? handleSignIn : handleLink}
        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-white font-semibold transition cursor-pointer"
      >
        <Wallet size={20} />
        {mode === 'login' ? t('signInWithWallet') : t('linkWallet')}
      </button>
      <p className="text-white/60 text-sm font-mono">{shortenAddress(walletAddress)}</p>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
