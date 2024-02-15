import { createWeb3Modal } from '@web3modal/wagmi/vue'
import { walletConnectProvider, EIP6963Connector } from '@web3modal/wagmi'
import { blastsepolia } from './blasttest'
import { configureChains, createConfig } from '@wagmi/core'
import { mainnet, polygonMumbai, polygon } from 'viem/chains'
import { publicProvider } from '@wagmi/core/providers/public'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { InjectedConnector } from '@wagmi/core'
import { CoinbaseWalletConnector } from '@wagmi/core/connectors/coinbaseWallet'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'

// 1. Define constants
const projectId = '0a3bd06ad2697a71e4662e217f1a4189'

// 2. Configure wagmi client
const { chains, publicClient } = configureChains(
    [mainnet, polygon, blastsepolia, polygonMumbai],
    [
        jsonRpcProvider({
            rpc: (chain) => ({
                // http: `https://rpc-mumbai.maticvigil.com`,
                http: `https://sepolia.blast.io`,
            }),
        }),
    ]
)

const metadata = {
    name: 'DormyAI',
    description: 'DormyAI',
    url: 'https://web3modal.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

export const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
        new WalletConnectConnector({ chains, options: { projectId, showQrModal: false, metadata } }),
        new EIP6963Connector({ chains }),
        new InjectedConnector({ chains, options: { shimDisconnect: true } }),
        // new CoinbaseWalletConnector({ chains, options: { appName: metadata.name } })
    ],
    publicClient
})

// 3. Create modal
createWeb3Modal({ 
    wagmiConfig, 
    projectId, 
    defaultChain: blastsepolia,
    chains,
    themeMode: 'dark',
    themeVariables: {
        '--w3m-font-size-master': 12,
        '--w3m-accent': 'rgba(59, 92, 255, 1)',
    }
})

export {
    chains
}