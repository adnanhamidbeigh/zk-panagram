"use client"
import Input from "./Input";
import PanagramImage from "./PanagramImage";
import ConnectWallet from "./ConnectWallet";
import NFTGalleryContainer from "./NFTGalleryContainer";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

function Panagram() {
  const { isConnected, address: userAddress } = useAccount();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
      setIsMounted(true);
    }, []);
  
    if (!isMounted) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 py-12">
      <div className="w-full max-w-7xl p-8 bg-white rounded-2xl shadow-xl">
        <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-8">
          Panagram
        </h1>

        {/* Connect Wallet at the top centre */}
        <div className="w-full flex justify-center mb-6">
          <ConnectWallet />
        </div>

        {isConnected ? (
          <>
            {/* Container for side-by-side layout on large screens */}
            <div className="flex flex-col lg:flex-row gap-8 justify-center">
              {/* Panagram Game */}
              <div className="w-full lg:w-1/2 flex flex-col items-center">
                <PanagramImage />
                <Input />
              </div>
              {/* NFT Gallery */}
              <div className="w-full lg:w-1/2 flex flex-col items-center">
                {userAddress ? (
                  <NFTGalleryContainer userAddress={userAddress} />
                ) : (
                  <p className="text-center text-gray-600">
                    No address available.
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">
            Please connect your wallet.
          </p>
        )}
      </div>
    </div>
  );
}

export default Panagram;
