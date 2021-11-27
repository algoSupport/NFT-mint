import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { IconContext } from 'react-icons';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';

import Layout from '../components/Layout';
import Prose from '../components/Prose';
import { useContractContext } from '../context/Contract';
import topImage from '../public/assets/1920x600.png';
import Creator from '../public/assets/creator.png';

import ABI from '../contract/abi.json';

const Home: NextPage = () => {
  const { chainId, account, active } = useWeb3React();

  const { message, errMsg, setMessage } = useContractContext();

  const [totalSupply, setTotalSupply] = useState('?');
  const [isPending, setIsPending] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintAmount, setMintAmount] = useState(1);

  async function claimNFTs() {
    if (active && account && !errMsg) {
      const cost = process.env.NEXT_PUBLIC_WEI_COST;
      const gasLimit = process.env.NEXT_PUBLIC_GAS_LIMIT;
      const totalCostWei = (Number(cost) * mintAmount).toString();
      const totalGasLimit = (Number(gasLimit) * mintAmount).toString();
      setMessage('');
      setIsPending(true);
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
          ABI,
          signer
        );
        const transaction = await contract.mint(mintAmount, {
          value: totalCostWei,
          gasLimit: totalGasLimit.toString(),
        });
        setIsPending(false);
        setIsMinting(true);
        await transaction.wait();
        setIsMinting(false);
        setMessage(
          `Yay! ${mintAmount} ${
            process.env.NEXT_PUBLIC_NFT_SYMBOL
          } successfully sent to ${account.substring(
            0,
            6
          )}...${account.substring(account.length - 4)}`
        );
      } catch (error) {
        setIsPending(false);
      }
    }
  }

  function decrementMintAmount() {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1);
    }
  }

  function incrementMintAmount() {
    if (mintAmount < 10) {
      setMintAmount(mintAmount + 1);
    }
  }

  useEffect(() => {
    async function fetchTotalSupply() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        ABI,
        provider
      );
      const totalSupply = await contract.totalSupply();
      setTotalSupply(totalSupply.toString());
    }
    if (
      active &&
      chainId &&
      chainId.toString() === process.env.NEXT_PUBLIC_NETWORK_ID
    ) {
      fetchTotalSupply();
    } else {
      setTotalSupply('?');
    }
  }, [active, chainId]);

  return (
    <Layout>
      <Head>
        <title>{process.env.NEXT_PUBLIC_NFT_NAME}</title>
      </Head>

      <Image src={topImage} alt={process.env.NEXT_PUBLIC_NFT_NAME} />

      <div className="bg-pink-600 py-8">
        <Prose>
          <h1 className="text-5xl font-bold text-gray-100 mb-2">
            {process.env.NEXT_PUBLIC_NFT_NAME}
          </h1>
          <p className="text-xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>

          <div className="space-y-4 mt-4">
            <div className="bg-gray-800 border-dashed border-4 border-gray-400 rounded p-8 space-y-4">
              <div className="text-3xl font-bold text-center">
                {totalSupply} / {process.env.NEXT_PUBLIC_MAX_SUPPLY}
              </div>
              <div className="text-center">
                <p className="text-xl">{`${process.env.NEXT_PUBLIC_DISPLAY_COST} ${process.env.NEXT_PUBLIC_CHAIN} per 1 NFT`}</p>
                <p>(excluding gas fees)</p>
              </div>
              <div className="flex justify-center items-center space-x-4">
                <IconContext.Provider value={{ size: '1.5em' }}>
                  <button
                    type="button"
                    className={
                      mintAmount === 1 ? 'text-gray-500 cursor-default' : ''
                    }
                    onClick={decrementMintAmount}
                    disabled={false}
                  >
                    <FaMinusCircle />
                  </button>
                  <span className="text-xl">{mintAmount}</span>
                  <button
                    type="button"
                    className={
                      mintAmount === 10 ? 'text-gray-500 cursor-default' : ''
                    }
                    onClick={incrementMintAmount}
                    disabled={false}
                  >
                    <FaPlusCircle />
                  </button>
                </IconContext.Provider>
              </div>

              <div className="flex justify-center">
                {!active || errMsg ? (
                  <button
                    type="button"
                    className={`rounded px-4 py-2 bg-gray-700 font-bold w-40 cursor-not-allowed`}
                    disabled={true}
                    onClick={claimNFTs}
                  >
                    Buy
                  </button>
                ) : (
                  <>
                    {isPending || isMinting ? (
                      <button
                        type="button"
                        className="flex justify-center items-center rounded px-4 py-2 bg-red-700 font-bold w-40 cursor-not-allowed"
                        disabled
                      >
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {isPending && 'Pending'}
                        {isMinting && 'Minting'}
                        {!isPending && !isMinting && 'Processing'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={`rounded px-4 py-2 bg-blue-700 hover:bg-blue-600 font-bold w-40`}
                        onClick={claimNFTs}
                      >
                        Buy
                      </button>
                    )}
                  </>
                )}
              </div>

              {message && (
                <div className="text-green-500 text-center">{message}</div>
              )}
              {errMsg && (
                <div className="text-red-500 text-center">{errMsg}</div>
              )}
            </div>

            <div className="space-y-4">
              <p>
                Please make sure you are connected to the correct address and
                the correct network (Polygon Mainnet) before purchasing. The
                operation cannot be undone after purchase.
              </p>
              <p>
                We have set the gas limit to 285000 to successfully mint your
                NFT. We recommend that you do not lower the gas limit.
              </p>
            </div>
          </div>
        </Prose>
      </div>

      <div className="bg-yellow-600 py-8">
        <Prose>
          <h2 className="text-4xl text-gray-100 mb-4">FAQ</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-2xl text-gray-100 mb-2">{`How do I get a ${process.env.NEXT_PUBLIC_NFT_NAME} NFT?`}</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Install{' '}
                  <a
                    href="https://metamask.io/"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="font-bold text-gray-800"
                  >
                    MetaMask
                  </a>{' '}
                  for your browser
                </li>

                <li>
                  Buy <span className="text-gray-100 font-bold">MATIC</span> on
                  major exchanges including{' '}
                  <a
                    href="https://www.binance.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="font-bold text-gray-800"
                  >
                    Binance
                  </a>{' '}
                  and{' '}
                  <a
                    href="https://www.coinbase.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="font-bold text-gray-800"
                  >
                    Coinbase
                  </a>
                  , or swap <span className="text-gray-100 font-bold">ETH</span>{' '}
                  to <span className="text-gray-100 font-bold">MATIC</span>
                </li>

                <li>
                  Click the{' '}
                  <span className="text-gray-100 font-bold">Connect</span>{' '}
                  button at the top of this website to connect to your wallet
                </li>

                <li>
                  Set the quantity you want and click the{' '}
                  <span className="text-gray-100 font-bold">Buy</span> button
                </li>

                <li>
                  Go to{' '}
                  <a
                    href="https://opensea.io/"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="font-bold text-gray-800"
                  >
                    OpenSea
                  </a>{' '}
                  to see the artwork(s) you purchased!
                </li>
              </ol>
            </div>
          </div>
        </Prose>
      </div>

      <div className="bg-green-600 py-8">
        <Prose>
          <h2 className="text-4xl text-gray-100 mb-4">Roadmap</h2>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </li>
            <li>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </li>
          </ul>
        </Prose>
      </div>

      <div className="bg-gray-800 py-8">
        <Prose>
          <div className="text-center">
            <h2 className="text-2xl text-gray-100 mb-4">Creator & Developer</h2>
            <Image
              src={Creator}
              alt="Koji Mochizuki"
              width={200}
              height={200}
              className="rounded-full"
            />
            <p className="mt-4">
              <a
                href="https://twitter.com/kjmczk"
                rel="noopener noreferrer"
                target="_blank"
                className="text-blue-400"
              >
                <span className="border-2 border-gray-700 hover:border-gray-600 rounded-full px-4 py-2 bg-gray-900">
                  @kjmczk
                </span>
              </a>
            </p>
          </div>
        </Prose>
      </div>
    </Layout>
  );
};

export default Home;
