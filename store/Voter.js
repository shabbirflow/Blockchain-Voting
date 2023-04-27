import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";
let initial = false;
//INTERNAL INPUTS
import { votingAddress, votingAddressAbi } from "./constants";
import { useAccount, useContract, useConnect, useSigner, useProvider } from "wagmi";

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
  const myAccount = useAccount();
  const connector = useConnect({
    onSuccess(data) {
      console.log("Connect", data);
    },
  });
  // const provider = useProvider();
  // const signer = useSigner();
  // const contract = useContract({
  //   address: votingAddress,
  //   abi: votingAddressAbi,
  //   signerOrProvider: signer.signer,
  // });

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
      console.log("UPLOAD DONE!", ImgHash);
      return ImgHash;
    } catch (error) {
      setError(error);
      console.log(error);
      console.log("ERROR WHILE UPLOADING TO IPFS");
    }
  };
  const uploadDataToIPFS = async (data) => {
    try {
      console.log(data);
      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: "a77cb06952379d906cab",
          pinata_secret_api_key:
            "fe4fbca6ee3abba2118369871c9076f0d84f0e465a749d7bd593ac45d0a79d6b",
          "Content-Type": "application/json",
        },
      });
      const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
      // https://gateway.pinata.cloud/ipfs/QmW3rq7ikx8GrTmop9JPxqeKCtkhjvPxzvB2L5erQpTgJh
      console.log("UPLOAD DONE!", ImgHash);
      return ImgHash;
    } catch (error) {
      setError(error);
      console.log(error);
      console.log("ERROR WHILE UPLOADING DATA TO IPFS");
    }
  };
  //  --------------------------------------------CREATE VOTER-------------------------------------------
  const createVoter = async (formInput, fileURL, router) => {
    try {
      const { name, address, position } = formInput;
      // console.log(name, address, position, fileURL, router);
      // ----------------------------CONNECT TO SMART CONTRACT---------------------------
      console.log("HEY");
      const data = JSON.stringify({ name, address, position, image: fileURL });
      const uploadedURL = await uploadDataToIPFS(data);
      console.log(uploadedURL);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const contract = fetchContract(signer);
      console.log(provider, signer, contract);
      const voter = await contract.voterRight(
        address,
        name,
        fileURL,
        uploadedURL
      );
      voter.wait();
      console.log(voter);
      router.push("/voterList");
    } catch (e) {
      console.log(e);
      setError("ERROR WHILE CREATING VOTER");
    }
  };

  //-------------------------GET VOTER LIST _ DATA OF ALL VOTERS-----------------------------------
  const getVoterList = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log(
      "PROVIDER: ",
      provider,
      "SIGNER: ",
      signer,
      "CONNECTED: ",
      connector.isConnected
    );
    const contract = fetchContract(signer);
    console.log(contract);
    console.log("I MADE IT");
    //VOTER LIST
    const voterList = await contract.getVoters();
    voterList.wait();
    console.log(voterList);
  };

  // useEffect(() => {
  //   getVoterList();
  // }, [])

  const votingTitle = "BC VOTINGGO Smart Contract App";
  const value = {
    votingTitle,
    checkIfWalletConnected,
    connectWallet,
    uploadToIPFS,
    createVoter,
    getVoterList,
  };
  return (
    <VotingContext.Provider value={value}>
      {props.children}
    </VotingContext.Provider>
  );
};
