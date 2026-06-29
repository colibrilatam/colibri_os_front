import { custom } from 'viem';
import { StoryClient } from '@story-protocol/core-sdk';

export function useStoryClient(wallet) {
  
    if (!wallet) {
      console.log('no wallet');
      return null;
    };

    const config = {
      wallet: wallet,
      transport: custom(wallet.transport),
      chainId: 'aeneid', // o tu cadena configurada
    };
    const client =  StoryClient.newClient(config);

    return client;
}