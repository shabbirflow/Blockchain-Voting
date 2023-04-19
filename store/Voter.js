import React, { useState, useEffect } from "react";
import { Web3Modal } from "@web3modal/react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";

//INTERNAL INPUTS
import { votingAddress, votingAddressAbi } from "./constants";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

//fetch contract and communicate with solidity
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(votingAddress, votingAddressAbi, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = (props) => {
  const router = useRouter();
  const [currentAccount, setCurrentAccount] = useState("");
  const [candidateLength, setCandidateLength] = useState("");
  const pushCandidate = [];
  const [candidateArray, setCandidateArray] = useState(pushCandidate);
  //-------------------END OF CANDIDATE DATA--------------------
  const [error, setError] = useState();
  const highestVote = [];

  //---------------------VOTER SECTION-----------------------
  const pushVoter = [];
  const [voterArray, setVoterArray] = useState(pushVoter);
  const [voterLength, setVoterLength] = useState("");
  const [voterAddress, setVoterAddress] = useState([]);

  //----------------CONNECT TO METAMASK---------------------
  const checkIfWalletConnected = async () => {
    if (!window.ethereum) {
      return setError("Please install MetaMask");
    }
    const account = await window.ethereum.request({ method: "eth_accounts" });
    if (account.length) {
      setCurrentAccount(account[0]);
    } else {
      setError("Please install MetaMask, Connect & Reload");
    }
  };
  //------------------CONNECT WALLET-------------------------------
  const connectWallet = async () => {
    if (!window.ethereum) {
      return setError("Please install MetaMask & Try Again");
    }
    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAccount(account[0]);
  };
  //---------------UPLOAD IMAGE TO IPFS FOR VOTER------------------------
  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return url;
    } catch (error) {
      setError("ERROR Uploading Image to IPFS");
    }
  };

  const votingTitle = "BC VOTINGGO Smart Contract App";
  const value = {votingTitle, checkIfWalletConnected, connectWallet, uploadToIPFS};
  return (
    <VotingContext.Provider value = {value}>
      {props.children}
    </VotingContext.Provider>
  );
};

