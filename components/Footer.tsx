import { FaHome, FaTwitter, FaDiscord, FaShip } from 'react-icons/fa';

import Container from './Container';
import NextLink from './NextLink';

const getCurrentYear = () => new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t">
      <Container>
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center py-8">
          <div>
            © {getCurrentYear()} {process.env.NEXT_PUBLIC_NFT_NAME}
          </div>

          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <NextLink
              href="/"
              aria-label="Home"
              className="bg-gray-700 hover:bg-gray-600 rounded-full p-2"
            >
              <FaHome />
            </NextLink>
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
          </div>
        </div>
      </Container>
    </footer>
  );
}
