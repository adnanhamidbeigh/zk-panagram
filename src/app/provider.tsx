"use client"
import React, {useState} from "react";
import { WagmiProvider } from "wagmi";
import { config } from "./config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Provider(props: {children: React.ReactNode}){
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div>
          {props.children}
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}