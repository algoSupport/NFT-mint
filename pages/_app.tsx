import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';

import { ContractProvider } from '../context/Contract';

function getLibrary(provider: any) {
  return new ethers.providers.Web3Provider(provider);
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ContractProvider>
        <Component {...pageProps} />
      </ContractProvider>
    </Web3ReactProvider>
  );
}

export default MyApp;
