import detectEthereumProvider from '@metamask/detect-provider'
import {InjectedConnector} from '@web3-react/injected-connector'
import {WalletConnectConnector} from '@web3-react/walletconnect-connector'
import {WalletLinkConnector} from '@web3-react/walletlink-connector'


const RPC_URL='https://mainnet.infura.io/v3/1b9b87cc48994172bae3f2e3856c8221'

const RPC_URLS: { [chainId: number]: string } = {
  1: RPC_URL as string,
  3: RPC_URL as string,
  4: RPC_URL as string,
  5: RPC_URL as string,
}

export const Injected= new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42]
})

export const WalletConnect = new WalletConnectConnector({
    rpc: RPC_URLS,
    chainId: 1,
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
  })

export const CoinbaseWallet= new WalletLinkConnector({
    url: RPC_URLS[1],
    appName: 'nft-app',
    supportedChainIds: [1, 3, 4, 5, 42, 10, 137, 69, 420, 80001],
    
})

export const connectorInfo= {
    metaMask: Injected,
    walletConnect: WalletConnect,
    coinbaseWallet: CoinbaseWallet
}
