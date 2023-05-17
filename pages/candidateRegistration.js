import React, { useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Web3Button } from "@web3modal/react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Head from "next/head";

//---------------INTERNAL IMPORTS--------------
import { VotingContext } from "../store/Voter";
import Input from "../components/Input/Input";
import myimage from "../public/images/upload.gif";
// import images from "../public/images";
import Style from "../styles/allowedVoters.module.css";
import { votingAddress, votingAddressAbi } from "../store/constants";
let initial = true;

const candidateRegistration = () => {
  console.log("CANDIDATE REGISTRATION LOAD");
  const [fileUrl, setFileURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [formInput, setFormInput] = useState({
    name: "",
    address: "",
    age: "",
  });
  const [candidates, setCandidates] = useState([]);
  const router = useRouter();

  const {
    uploadToIPFS,
    createCandidate,
    candidateArray,
    setCandidateArray,
    getCandidateList,
  } = useContext(VotingContext);

  //-----------------CANDIDATE IMAGE DROP------------------------------------------
  const onDrop = useCallback(async (acceptedFile) => {
    setLoading(true);
    const url = await uploadToIPFS(acceptedFile[0]); //returns url once image file is uploaded
    // console.log(acceptedFile);
    setFileURL(url);
    // console.log(url);
    setLoading(false);
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    }, // /* to accept all images
    maxSize: 5000000, //5mb
  });

  const recentCandidates = (
    <ul>
      {candidateArray &&
        candidateArray.map((x, ind) => (
          <li key={ind}>
            <div>{x[0]}</div>
            <div>{x[1]}</div>
            <img src={x[3]} style={{ maxHeight: "100px", maxWidth: "100px" }} />
          </li>
        ))}
    </ul>
  );

  const candidateForm = (
    <form className={Style.inputContainer}>
      <Input
        title="Name"
        inputType="text"
        placeholder="Enter Candidate Name"
        handleChange={(e) => {
          setFormInput({ ...formInput, name: e.target.value });
        }}
        required={true}
      />
      <Input
        title="Address"
        inputType="text"
        placeholder="Enter Candidate Address"
        handleChange={(e) => {
          setFormInput({ ...formInput, address: e.target.value });
        }}
        required={true}
      />
      <Input
        title="Age"
        inputType="number"
        placeholder="Enter Candidate Age"
        handleChange={(e) => {
          setFormInput({ ...formInput, age: e.target.value });
        }}
        required={true}
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          createCandidate(formInput, fileUrl, router);
        }}
        disabled={
          !formInput.name || !formInput.address || !formInput.age || !fileUrl
        }
        className={Style.voterButton}
      >
        Authorize Candidate
      </button>
    </form>
  );

  const imgDropStuff = (
    <div className={Style.imgDropBox}>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className={Style.voterDropInput}>
          <div className={Style.voterDropImage}>
            {!fileUrl && (
              <Image
                src={myimage}
                alt="upload image"
                style={{
                  width: "75px",
                  height: "75px",
                  objectFit: "contain",
                  margin: "1rem",
                }}
              />
            )}
            {fileUrl && (
              <img
                src={fileUrl}
                alt="voter uploaded image"
                style={{
                  width: "75px",
                  height: "75px",
                  objectFit: "contain",
                  margin: "1rem",
                }}
              />
            )}
            <div>
              <p>
                Upload File: <span>JPG, PNG, GIF, WEBM Max 10Mb</span>
              </p>
              <p>Drag & Drop Image File</p>
              <p>Or upload file from your device</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Register Candidate</title>
      </Head>
      <div className={Style.createVoter}>
        <div className={Style.allowedVoters}>
          <div className={Style.left}>
            <div className={Style.leftTitle}>
              <h1>REGISTER A CANDIDATE</h1>
              <div className={Style.leftTitleDesc}>
                You can register as a candidate to stand in the election. You
                must provide your smart wallet address, age & name. The voting
                organizer initiates a transaction by sending it to the smart
                wallet address of the registered candidate.
              </div>
            </div>
            <div className={Style.leftRecent}>
              <h1>Recently Registered</h1>
              <ul className={Style.leftRecentList}>
                {candidateArray &&
                  candidateArray.length > 0 &&
                  candidateArray.map((x, ind) => (
                    <Card key={ind} className={Style.recentCard}>
                      <CardMedia
                        sx={{ height: "3rem", width: "3rem" }}
                        image={x[3]}
                        title="green iguana"
                      />
                      <CardContent className={Style.content}>
                        <Typography gutterBottom component="div">
                          {x[0]}
                        </Typography>
                        <Typography>{x[6].slice(0, 10)}...</Typography>
                      </CardContent>
                    </Card>
                  ))}
              </ul>
            </div>
          </div>
          <div className={Style.right}>
            <div className={Style.rightForm}>
              <h1>Create New Candidate</h1>
              {imgDropStuff}
              {candidateForm}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default candidateRegistration;
