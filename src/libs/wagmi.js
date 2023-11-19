import { createConfig, configureChains } from '@wagmi/core'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { mainnet, arbitrum } from '@wagmi/core/chains'

/**
 * 目前使用的是 walletconnect v2 的版本，但是
 * 2023-10-23 npmjs.com 上 @web3modal/ethereum 已经停止更新，将支持 v3 @web3modal/wagmi
 */


// 1. Get projectId
export const projectId = '0a3bd06ad2697a71e4662e217f1a4189'
export const chains = [mainnet, arbitrum]

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])

// Create wagmiConfig
export const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, chains }),
    publicClient
})
 
const ethereumClient = new EthereumClient(wagmiConfig, chains)
export const web3modal = new Web3Modal({ projectId }, ethereumClient)
console.log('-->>>>>>')