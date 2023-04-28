import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";
//INTERNAL INPUTS
import { votingAddress, votingAddressAbi } from "./constants";
import {
  useAccount,
  useContract,
  useConnect,
  useSigner,
  useProvider,
} from "wagmi";

//fetch contract and communicate with solidity
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(votingAddress, votingAddressAbi, signerOrProvider);

export const VotingContext = React.createContext();

const VotingProvider = ({ children }) => {
  const account = useAccount();
  const router = useRouter();
  const [currentAccount, setCurrentAccount] = useState("");
  const [candidateLength, setCandidateLength] = useState("");
  const pushCandidate = [];
  const [candidateArray, setCandidateArray] = useState([]);
  const [winner, setWinner] = useState({ name: "UNDEFINED" });
  //-------------------END OF CANDIDATE DATA--------------------
  const [error, setError] = useState();
  const [count, setCount] = useState(1);
  const highestVote = [];

  //---------------------VOTER SECTION-----------------------
  const [voterArray, setVoterArray] = useState([]);
  const [voterLength, setVoterLength] = useState("");
  const [voterAddress, setVoterAddress] = useState([]);
  // console.log(candidateLength, candidateArray, "IN VOTER");

  //----------------CONNECT TO METAMASK---------------------
  const myAccount = useAccount();

  useEffect(() => {
    if (error) {
      router.push("/error");
    }
  }, [error]);

  useEffect(() => {
    if (!myAccount.isConnected) {
      router.push("/needConnect");
    }
  }, [myAccount]);

  useEffect(() => {
    const idk = async () => {
      await getCandidateList().then(() => {
        findWinner();
      });
      await getVoterList();
    };
    idk();
  }, []);

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

  const findWinner = () => {
    console.log(candidateArray);
    let winner = null;
    candidateArray.map((x) => {
      !winner || x[4].toNumber() > winner[4].toNumber() ? (winner = x) : null;
    });
    setWinner(winner);
  };

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
      // console.log(formData);
      // console.log(file);
      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
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
      // console.log("ERROR WHILE UPLOADING TO IPFS");
    }
  };
  const uploadDataToIPFS = async (data) => {
    try {
      // console.log(data);
      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
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
      // console.log("ERROR WHILE UPLOADING DATA TO IPFS");
    }
  };
  //  --------------------------------------------CREATE VOTER-------------------------------------------
  const createVoter = async (formInput, fileURL, router) => {
    try {
      const { name, address, position } = formInput;
      // console.log(name, address, position, fileURL, router);
      // ----------------------------CONNECT TO SMART CONTRACT---------------------------
      // console.log("HEY");
      const data = JSON.stringify({ name, address, position, image: fileURL });
      const uploadedURL = await uploadDataToIPFS(data);
      // console.log(uploadedURL);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      // console.log(provider, signer, contract);
      const voter = await contract.voterRight(
        address,
        name,
        fileURL,
        uploadedURL
      );
      voter.wait().then(async (res) => {
        await getVoterList();
      });
      console.log(voter);
      await getVoterList();
      router.push("/voterList");
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  //-------------------------GET VOTER LIST _ DATA OF ALL VOTERS-----------------------------------
  const getVoterList = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    // console.log(
    //   "PROVIDER: ",
    //   provider,
    //   "SIGNER: ",
    //   signer,
    //   "CONNECTED: ",
    //   connector.isConnected
    // );
    const contract = fetchContract(signer);
    // console.log(contract);
    // console.log("I MADE IT");
    //VOTER LIST
    let pushCandidate = [];
    try {
      const voterList = await contract.getVoters();
      pushCandidate = [];
      voterList.map(async (ele) => {
        const singleVoterData = await contract.getVoterData(ele);
        // console.log(singleVoterData);
        pushCandidate.push(singleVoterData);
      });
      // console.log(pushCandidate);
      setVoterArray(pushCandidate);
      const voterLength = await contract.getVoterLength();
      setVoterLength(voterLength.toNumber());
      // console.log(voterLength.toNumber());
    } catch (e) {
      setError(e);
      console.log(e);
    }
  };

  //------------------VOTE FUNCTION------------------------------------------------
  const vote = async (id) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      const voted = await contract.vote(id.address, id.id).then(async () => {
        await getCandidateList();
        findWinner();
      });
      console.log(voted);
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  //---------------------------------------------------CANDIDATE SECTION-----------------------------------------------------
  //_---------------------------------------------------------------------------------------------------------------------
  const createCandidate = async (formInput, fileURL, router) => {
    try {
      const { name, address, age } = formInput;
      // console.log(name, address, position, fileURL, router);
      // ----------------------------CONNECT TO SMART CONTRACT---------------------------
      // console.log("HEY");
      const data = JSON.stringify({ name, address, age, image: fileURL });
      const uploadedURL = await uploadDataToIPFS(data);
      // console.log(uploadedURL);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = fetchContract(signer);
      // console.log(provider, signer, contract);
      const candidate = await contract.setCandidate(
        address,
        name,
        age,
        uploadedURL,
        fileURL
      );
      candidate.wait().then(async (res) => {
        await getCandidateList();
      });
      console.log(candidate);

      router.push("/voterList");
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  //------------------------------GET ALL CANDIDATE DATA--------------------------
  const getCandidateList = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    // console.log(
    //   "PROVIDER: ",
    //   provider,
    //   "SIGNER: ",
    //   signer,
    //   "CONNECTED: ",
    //   connector.isConnected
    // );
    const contract = fetchContract(signer);
    // console.log(contract);
    // console.log("I MADE IT");
    let pushCandidate = [];
    try {
      const candidateList = await contract.getCandidate();
      candidateList.map(async (ele) => {
        const singleCandidate = await contract.getcandidatedata(ele);
        // console.log(singleVoterData);
        pushCandidate.push(singleCandidate);
        // candidateIn
      });
      // console.log(pushCandidate);
      setCandidateArray(pushCandidate);
      const candidatesLength = await contract.getCandidateLength();
      setCandidateLength(candidatesLength.toNumber());
      // console.log(pushCandidate, candidatesLength.toNumber(), candidateArray);
      return pushCandidate;
    } catch (e) {
      setError(e);
      console.log(e);
    }
  };

  const votingTitle = "BC VOTINGG Smart Contract App";
  const value = {
    votingTitle,
    checkIfWalletConnected,
    connectWallet,
    uploadToIPFS,
    createVoter,
    getVoterList,
    createCandidate,
    getCandidateList,
    error,
    voterArray,
    voterAddress,
    voterLength,
    currentAccount,
    createCandidate,
    setCandidateArray,
    candidateArray,
    candidateLength,
    vote,
    winner,
    findWinner,
    myAccount,
  };
  return (
    <VotingContext.Provider value={value}>{children}</VotingContext.Provider>
  );
};

export default VotingProvider;
