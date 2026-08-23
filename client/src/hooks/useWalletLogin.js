import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { walletAuthService } from '@/services/walletAuth';
import { userService } from '@/services/user';
import { useUserStore } from '@/lib/store';
import { queryKeys } from '@/lib/query-keys';

export const useWalletLogin = () => {
  const setToken = useUserStore((state) => state.setToken);
  const setRol = useUserStore((state) => state.setRol);
  const setUser = useUserStore((state) => state.setUser);
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('idle'); // idle | connecting | signing | authenticating

  const walletLoginMutation = useMutation({
    mutationFn: async ({ address, message, signature }) => {
      setStatus('authenticating');
      const authResult = await walletAuthService.verifySignature(address, message, signature);
      setToken(authResult.token);

      const userData = await userService.profile();
      setRol(userData.role);
      setUser(userData);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile });

      return { ...authResult, user: userData };
    },
  });

  const connectAndSign = async () => {
    if (!window.ethereum) {
      return { success: false, error: 'MetaMask no instalado. Por favor instala MetaMask para continuar.' };
    }

    try {
      setStatus('connecting');
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const address = accounts[0];

      setStatus('signing');
      const { message } = await walletAuthService.requestNonce(address);

      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });

      const result = await walletLoginMutation.mutateAsync({ address, message, signature });
      setStatus('idle');
      return { success: true, data: result };
    } catch (err) {
      setStatus('idle');
      let message = 'Error al autenticar con wallet';

      if (err.code === 4001) {
        message = 'Firma requerida. Por favor firma el mensaje en MetaMask.';
      } else if (err.code === -32002) {
        message = 'Solicitud pendiente en MetaMask. Revisa la extensión.';
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }

      return { success: false, error: message };
    }
  };

  return { connectAndSign, status, retrying: walletLoginMutation.isPending };
};
