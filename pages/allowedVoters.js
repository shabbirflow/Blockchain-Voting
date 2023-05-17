import React, { useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Web3Button } from "@web3modal/react";
import Head from "next/head";

//---------------INTERNAL IMPORTS--------------
import { VotingContext } from "../store/Voter";
import Input from "../components/Input/Input";
import myimage from "../public/images/upload.gif";
// import images from "../public/images";
import Style from "../styles/allowedVoters.module.css";
import { votingAddress, votingAddressAbi } from "../store/constants";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const allowedVoters = () => {
  const [fileUrl, setFileURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [formInput, setFormInput] = useState({
    name: "",
    address: "",
    position: "",
  });
  const router = useRouter();
  const { uploadToIPFS, createVoter, voterArray } = useContext(VotingContext);
  //-----------------VOTERS IMAGE DROP------------------------------------------
  const onDrop = useCallback(async (acceptedFile) => {
    setLoading(true);
    const url = await uploadToIPFS(acceptedFile[0]); //returns url once image file is uploaded
    // console.log(acceptedFile);
    setFileURL(url);
    console.log(url);
    setLoading(false);
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    }, // /* to accept all images
    maxSize: 5000000, //5mb
  });

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

  const voterFormStuff = (
    <div className={Style.voter}>
      <div className={Style.voterContainer}>
        <form className={Style.inputContainer}>
          <Input
            title="Name"
            inputType="text"
            placeholder="Enter Voter Name"
            handleChange={(e) => {
              setFormInput({ ...formInput, name: e.target.value });
            }}
            required={true}
          />
          <Input
            title="Address"
            inputType="text"
            placeholder="Enter Voter Address"
            handleChange={(e) => {
              setFormInput({ ...formInput, address: e.target.value });
            }}
            required={true}
          />
          <Input
            title="Position"
            inputType="text"
            placeholder="Enter Voter Position"
            handleChange={(e) => {
              setFormInput({ ...formInput, position: e.target.value });
            }}
            required={true}
          />
          <button
            className={Style.voterButton}
            onClick={(e) => {
              e.preventDefault();
              createVoter(formInput, fileUrl, router);
            }}
            disabled={
              !formInput.name ||
              !formInput.address ||
              !formInput.position ||
              !fileUrl
            }
          >
            Authorize Voter
          </button>
        </form>
      </div>
    </div>
  );
  console.log(voterArray);
  return (
    <>
      <Head>
        <title>Register Voter</title>
      </Head>
      <div className={Style.allowedVoters}>
        <div className={Style.left}>
          <div className={Style.leftTitle}>
            <h1>REGISTER A VOTER</h1>
            <div className={Style.leftTitleDesc}>
              You can register a voter to vote for the election. Only the voting
              organizer has the authority to register a voter. A transaction
              will be made between the organizer and the voter.
            </div>
          </div>
          <div className={Style.leftRecent}>
            <h1>Recently Registered</h1>
            <ul className={Style.leftRecentList}>
              {voterArray &&
                voterArray.length > 0 &&
                voterArray.map((x, ind) => (
                  <Card key={ind} className={Style.recentCard}>
                    <CardMedia
                      sx={{ height: "3rem", width: "3rem" }}
                      image={x[2]}
                      title="green iguana"
                    />
                    <CardContent className={Style.content}>
                      <Typography gutterBottom component="div">
                        {x[1]}
                      </Typography>
                      <Typography>{x[3].slice(0, 10)}...</Typography>
                    </CardContent>
                  </Card>
                ))}
            </ul>
          </div>
        </div>
        <div className={Style.right}>
          <div className={Style.rightForm}>
            <h1>Create New Voter</h1>
            {imgDropStuff}
            {voterFormStuff}
          </div>
        </div>
      </div>
    </>
  );
};

export default allowedVoters;
