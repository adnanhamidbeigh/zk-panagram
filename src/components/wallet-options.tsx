"use client"
import { useConnect } from "wagmi";
import { useState, useEffect } from "react";

export function WalletOptions() {
  const { connectors, connect } = useConnect();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Avoid hydration mismatch by only rendering on the client
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  return (
    <div className="flex flex-col space-y-4">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg shadow-md hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300"
        >
          {connector.name}
        </button>
      ))}
    </div>
  );
}
