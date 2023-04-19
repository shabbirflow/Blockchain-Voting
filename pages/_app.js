import "../styles/global.css";
// src\styles\globals.css
import Navbar from "../components/Navbar/Navbar";
import { VotingProvider } from "../store/Voter";

export default function App({ Component, pageProps }) {
  return (
    <VotingProvider>
    <Navbar />
      <Component {...pageProps} />
    </VotingProvider>
  );
}
