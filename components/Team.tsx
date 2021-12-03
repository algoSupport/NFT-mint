import Image from 'next/image';

import Creator from '../public/assets/creator.png';

export default function Team() {
  return (
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
  );
}
