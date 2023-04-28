import { Karla } from "@next/font/google";
import BottomNavbar from "../components/BottomNavigation/BottomNavbar";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon, localhost, hardhat } from "wagmi/chains";
import VotingProvider, { VotingContext } from "../store/Voter";
const chains = [hardhat, localhost];
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 2, chains }),
  provider,
});
const ethereumClient = new EthereumClient(wagmiClient, chains);

import "../styles/global.css";
// src\styles\globals.css
import Navbar from "../components/Navbar/Navbar";
import Head from "next/head";
import { useContext } from "react";

const karla = Karla({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function App({ Component, pageProps }) {

  return (
    <>
      <VotingProvider>
        <main className={karla.className}>
          <WagmiConfig client={wagmiClient}>
            <Navbar />
            <Component {...pageProps} />
          </WagmiConfig>
          <BottomNavbar />
          <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        </main>
      </VotingProvider>
    </>
  );
}
