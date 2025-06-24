"use client"

import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { abi } from "../abi/abi";
import { PANAGRAM_CONTRACT_ADDRESS } from "../constant";
import Image from "next/image";

// Fix 1: Use NEXT_PUBLIC_ prefix for client-side environment variables
// Fix 2: Your specific gateway format
const GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs/";

const convertToReliableGateway = (url: string) => {
  // For your Pinata gateway, we need to add 'ipfs/' to the path
  const baseGateway = GATEWAY.endsWith('/') ? `${GATEWAY}ipfs/` : `${GATEWAY}/ipfs/`;

  if (url.startsWith("https://ipfs.io/ipfs/")) {
    const hash = url.split("https://ipfs.io/ipfs/")[1];
    return `${baseGateway}${hash}`;
  }

  if (url.startsWith("ipfs://")) {
    const hash = url.replace("ipfs://", "");
    return `${baseGateway}${hash}`;
  }

  return url;
};

const fetchMetadata = async (uri: string, token_id: number) => {
  const resolvedURI = uri.replace(/{id}/g, token_id.toString());
  const reliableUrl = convertToReliableGateway(resolvedURI);

  console.log(`Fetching metadata from: ${reliableUrl}`); // Debug log

  try {
    const response = await fetch(reliableUrl, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const metadata = await response.json();
    return {
      metadata,
      imageUrl: metadata.image
        ? convertToReliableGateway(metadata.image)
        : null,
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    console.error("Failed URL:", reliableUrl); // Additional debug info
    return { metadata: null, imageUrl: null };
  }
};

export default function NFTGallery({
  owner,
  token_id,
}: {
  owner: string;
  token_id: number;
}) {
  const [nftData, setNftData] = useState<{
    metadata: string | null;
    imageUrl: string | null;
  }>({
    metadata: null,
    imageUrl: null,
  });

  const balanceResult = useReadContract({
    address: PANAGRAM_CONTRACT_ADDRESS as `0x${string}`,
    abi,
    functionName: "balanceOf",
    args: [owner as `0x${string}`, BigInt(token_id)],
  });

  const uriResult = useReadContract({
    address: PANAGRAM_CONTRACT_ADDRESS as `0x${string}`,
    abi,
    functionName: "uri",
    args: [BigInt(token_id)],
  });

  useEffect(() => {
    if (!uriResult.data) return;

    console.log(`Raw URI from contract: ${uriResult.data}`); // Debug log
    fetchMetadata(uriResult.data as string, token_id).then(setNftData);
  }, [uriResult.data, token_id]);

  if (balanceResult.isLoading || uriResult.isLoading) return <p>Loading...</p>;
  if (balanceResult.isError || uriResult.isError)
    return <p>Error fetching NFT data</p>;

  const balance = balanceResult.data ? Number(balanceResult.data) : 0;

  return (
    <div className="nft-gallery my-8">
      <h2 className="text-xl font-semibold mb-4">
        {token_id === 0 ? "Times Won" : "Times got Correct (but not won)"}
      </h2>
      {balance > 0 ? (
        <NFTCard
          tokenId={token_id}
          balance={balance}
          imageUrl={nftData.imageUrl}
        />
      ) : (
        <p>No tokens owned.</p>
      )}
    </div>
  );
}

function NFTCard({
  tokenId,
  balance,
  imageUrl,
}: {
  tokenId: number;
  balance: number;
  imageUrl: string | null;

}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="nft-card border border-gray-300 rounded-lg bg-gray-50 p-4 text-center shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300 justify-center">
      <h3 className="text-lg font-semibold text-gray-800">
        Token ID: {tokenId}
      </h3>
      <p className="text-gray-600">Balance: {balance}</p>
      {imageUrl && !imageError ? (
        <div className="relative mt-4 w-56 h-56 bg-gray-100 rounded-md overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
            </div>
          )}
          <Image
            src={imageUrl}
            alt={`NFT ${tokenId}`}
            fill
            className={`object-contain rounded-md transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(false);
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="mt-4 w-full h-96 bg-gray-200 rounded-md flex items-center justify-center">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600">No image available</p>
          </div>
        </div>
      )}
    </div>
  );
}