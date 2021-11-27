import Image from 'next/image';
import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import Blockies from 'react-blockies';
import { FaTwitter, FaDiscord, FaShip } from 'react-icons/fa';

import ConnectButton from './ConnectButton';
import Container from './Container';
import NextLink from './NextLink';
import { useContractContext } from '../context/Contract';
import { injected } from '../utils/wallet/connectors';
import Logo from '../public/assets/logo.png';

export default function Header() {
  const { activate, setError, chainId, account, active } = useWeb3React();

  const { errMsg, setErrMsg } = useContractContext();

  useEffect(() => {
    async function loadInjectedWallet() {
      const isAuthorized = await injected.isAuthorized();
      if (isAuthorized) {
        await activate(injected);
      }
    }
    if (typeof window.ethereum !== 'undefined') {
      try {
        loadInjectedWallet();
      } catch (error) {
        if (error instanceof Error) setError(error);
      }
    }
  }, [activate, setError]);

  useEffect(() => {
    if (active) {
      if (
        chainId &&
        chainId.toString() !== process.env.NEXT_PUBLIC_NETWORK_ID
      ) {
        setErrMsg(
          `Change the network to ${process.env.NEXT_PUBLIC_NETWORK_ID}.`
        );
      } else {
        setErrMsg('');
      }
    } else {
      setErrMsg('');
    }
  }, [active, chainId, setErrMsg]);

  return (
    <div className="sticky top-0 z-50">
      <header className="bg-gray-900 border-b py-2">
        <Container>
          <div className="flex justify-between items-center">
            <NextLink href="/" className="text-2xl font-bold text-white">
              <span className="flex items-center">
                <Image
                  src={Logo}
                  alt={process.env.NEXT_PUBLIC_NFT_NAME}
                  width={35}
                  height={35}
                  className="rounded-full"
                />
                <span className="hidden sm:block ml-2">
                  {process.env.NEXT_PUBLIC_NFT_NAME}
                </span>
              </span>
            </NextLink>

            <div className="flex items-center space-x-2 ml-2 sm:ml-0">
              <a
                href={process.env.NEXT_PUBLIC_TWITTER_URL}
                aria-label={`${process.env.NEXT_PUBLIC_NFT_NAME} on Twitter`}
                rel="noopener noreferrer"
                target="_blank"
                className="bg-gray-700 hover:bg-gray-600 rounded-full p-2"
              >
                <FaTwitter />
              </a>
              <a
                href={process.env.NEXT_PUBLIC_DISCORD_URL}
                aria-label={`${process.env.NEXT_PUBLIC_NFT_NAME} on Discord`}
                rel="noopener noreferrer"
                target="_blank"
                className="bg-gray-700 hover:bg-gray-600 rounded-full p-2"
              >
                <FaDiscord />
              </a>
              <a
                href={process.env.NEXT_PUBLIC_OPENSEA_URL}
                aria-label={`${process.env.NEXT_PUBLIC_NFT_NAME} on OpenSea`}
                rel="noopener noreferrer"
                target="_blank"
                className="bg-gray-700 hover:bg-gray-600 rounded-full p-2"
              >
                <FaShip />
              </a>

              {active && account ? (
                <span className="flex items-center space-x-2 p-2 bg-gray-700 rounded-full">
                  <span>
                    <Blockies
                      seed={account.toLowerCase()}
                      className="rounded-full"
                    />
                  </span>
                  <span>
                    {`${account.substring(0, 6)}...${account.substring(
                      account.length - 4
                    )}`}
                  </span>
                </span>
              ) : (
                <ConnectButton />
              )}
            </div>
          </div>
        </Container>
      </header>

      {errMsg && <div className="bg-red-400 p-4 text-center">{errMsg}</div>}
    </div>
  );
}
