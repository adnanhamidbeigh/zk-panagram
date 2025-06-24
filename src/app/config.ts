import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { metaMask, safe, walletConnect } from 'wagmi/connectors'
// import { vMainnet } from './tenderly.config'

const rpcUrl = process.env.NEXT_SEPOLIA_RPC_URL!
// const tenderlyRpcUrl = process.env.NEXT_TENDERLY_RPC_URL!
export const config = createConfig({
  chains: [sepolia],
  connectors: [
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID! }),
    metaMask(),
    safe(),
  ],
  transports: {
    // [vMainnet.id]: http(tenderlyRpcUrl),
    [sepolia.id]: http(rpcUrl),
  },
})