import React, { useState, useEffect } from "react";
import { Web3Modal } from "@web3modal/react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";

//INTERNAL INPUTS
import { votingAddress, votingAddressAbi } from "./constants";

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
      const formData = new FormData();
      formData.append("file", file);
      console.log(formData);
      console.log(file);
      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: "a77cb06952379d906cab",
          pinata_secret_api_key:
            "fe4fbca6ee3abba2118369871c9076f0d84f0e465a749d7bd593ac45d0a79d6b",
          "Content-Type": "multipart/form-data",
        },
      });
      const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
      // https://gateway.pinata.cloud/ipfs/QmW3rq7ikx8GrTmop9JPxqeKCtkhjvPxzvB2L5erQpTgJh
      console.log(ImgHash);
      return ImgHash;
    } catch (error) {
      console.log("Error sending File to IPFS: ");
      console.log(error);
    }
  };

  const votingTitle = "BC VOTINGGO Smart Contract App";
  const value = {
    votingTitle,
    checkIfWalletConnected,
    connectWallet,
    uploadToIPFS,
  };
  return (
    <VotingContext.Provider value={value}>
      {props.children}
    </VotingContext.Provider>
  );
};
