// import "../styles/global.css";
// // src\styles\globals.css
// import Navbar from "../components/Navbar/Navbar";
// import { VotingProvider } from "../store/Voter";

// export default function App({ Component, pageProps }) {
//   return (
//     <VotingProvider>
//     <Navbar />
//       <Component {...pageProps} />
//     </VotingProvider>
//   );
// }
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon, localhost, hardhat } from "wagmi/chains";

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
import { VotingProvider } from "../store/Voter";

export default function App({ Component, pageProps }) {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <VotingProvider>
          <Navbar />
          <Component {...pageProps} />
        </VotingProvider>
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}
