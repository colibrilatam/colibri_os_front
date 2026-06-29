'use client';
import { custom } from 'viem';
import { useWalletClient } from "wagmi"; 
import { StoryClient } from "@story-protocol/core-sdk";
import { useEffect } from 'react';

export default function StoryClientComponent() {
  const { data: wallet, isLoading, isError, error } = useWalletClient();

  async function setupStoryClient(wallet) {
      const config = {
        wallet: wallet,
        transport: custom(wallet.transport),
        chainId: "aeneid",
      };
      const client = StoryClient.newClient(config);
      return client;
    }

  useEffect(() => {
    if(isError){
      console.log(error);
    }
    if (!wallet) {
      console.log('no wallet');
      return;
    }
   const client = setupStoryClient(wallet);
  }, [wallet]);

  return;
}