'use client'
import { useState, useEffect } from 'react'
import { useConnection, useConnect, useConnectors, useDisconnect, useSwitchChain } from 'wagmi'
import { storyAeneid } from 'wagmi/chains'
import StoryClientComponent from '@/components/StoryClient'

export default function WalletConnection() {
  const [mounted, setMounted] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)
  const { address, isConnected, chainId } = useConnection()
  const connectors = useConnectors()
  const connect = useConnect()
  const disconnect = useDisconnect()
  const { switchChain } = useSwitchChain()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Efecto para cambiar de red automáticamente cuando se conecta
  useEffect(() => {
    if (isConnected && chainId && chainId !== storyAeneid.id && !isSwitching) {
      setIsSwitching(true)
      switchChain({ chainId: storyAeneid.id })
      setIsSwitching(false)
    }
  }, [isConnected, chainId, switchChain, isSwitching])

  const handleConnect = async () => {
    const connector = connectors.find(c => c.id === 'metaMaskSDK') ?? connectors[0]
    await connect.mutateAsync({ connector })
  }

  if (!mounted) {
    return <button disabled>Connect MetaMask</button>
  }

  return (
    <div>
      {isConnected ? (
        <>
          <button
            className="p-4 bg-slate-900 text-white cursor-pointer rounded-2xl"
            onClick={() => disconnect.mutate()}
          >
            Disconnect
          </button>
          {chainId !== storyAeneid.id && (
            <p className="text-yellow-500">
              {isSwitching ? 'Cambiando a red Story...' : 'Red incorrecta. Cambiando...'}
            </p>
          )}
          {chainId === storyAeneid.id && (
            <p className="text-green-500">Conectado a Story Network (Aeneid)</p>
          )}
          <StoryClientComponent></StoryClientComponent>
        </>
      ) : (
        <button
          className="p-4 bg-slate-900 text-white cursor-pointer rounded-2xl"
          onClick={handleConnect}
        >
          Connect MetaMask
        </button>
      )}
      {address && (
        <p className="p-4 bg-slate-900 text-white rounded-2xl my-4 w-fit">
          Connected: {address}
        </p>
      )}
      {chainId && (
        <p className="p-4 bg-slate-900 text-white rounded-2xl w-fit">
          Chain ID: {chainId}
        </p>
      )}
    </div>
  )
}