import React, { useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Web3Button } from "@web3modal/react";

//---------------INTERNAL IMPORTS--------------
import { VotingContext } from "../store/Voter";
import Input from "../components/Input/Input";
import myimage from "../public/images/64.png";
// import images from "../public/images";
import Style from "../styles/allowedVoters.module.css";
import { votingAddress, votingAddressAbi } from "../store/constants";

const allowedVoters = () => {
  const [fileUrl, setFileURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [formInput, setFormInput] = useState({
    name: "",
    address: "",
    position: "",
  });
  const router = useRouter();
  const { uploadToIPFS, createVoter } =
    useContext(VotingContext);
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

  return (
    <div className={Style.createVoter}>
      <div>
        {fileUrl && (
          <div className={Style.voterInfo}>
            <img
              crossOrigin="anonymous"
              src={fileUrl}
              alt="voter image"
              style={{ maxHeight: "50rem", maxWidth: "50rem" }}
            />
            <div className={Style.voterInfoPara}>
              <p>
                Name: <span>{formInput.name}</span>
              </p>
              <p>
                Address: <span>{formInput.address.slice(0, 20)}</span>
              </p>
              <p>
                Position: <span>{formInput.position}</span>
              </p>
            </div>
          </div>
        )}
        {!fileUrl && (
          <div className={Style.sideInfo}>
            {/* //LEFTMOST */}
            <div className={Style.sideInfoBox}>
              <h3>Create Candidate to stand for Election</h3>
              <p>
                Enroll a candidate to stand for the decentralized election with
                ethereum ecosystem
              </p>
              <p className={Style.sideInfoPara}>Candidate Contract</p>
            </div>
            <div className={Style.sideInfoCard}>
              MAP voterArray & DISPLAY INFO
            </div>
          </div>
        )}
      </div>
      <div className={Style.voter}>
        <div className={Style.voterContainer}>
          <h1>Create New Voter</h1>
          <div className={Style.voterContainerBox}>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <div className={Style.voterDropInput}>
                <p>
                  Upload File: <span>JPG, PNG, GIF, WEBM Max 10Mb</span>
                </p>
                <div className={Style.voterDropImage}>
                  <Image
                    src={myimage}
                    alt="voter uploaded image"
                    style={{ width: 250, height: 250, objectFit: "contain" }}
                  />
                  <p>Drag & Drop Image File</p>
                  <p>Or upload file from your device</p>
                </div>
              </div>
            </div>
          </div>
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
      {/* {/////////////////////////////////////////////////////////////////////////////////////////////////////////} */}
      <div className={Style.createdVoter}>
        {/* //RiGHT MOST DIV */}
        <div className={Style.createdVoterInfo}>
          <img
            src={fileUrl ? fileUrl : ""}
            alt="User Profile"
            crossOrigin="anonymous"
          />
          <p>Notice For User</p>
          <p>
            Address <span>0x83747someaddress897</span>
          </p>
          <p>
            Only Organizer of the voting contract can create a voter for
            election
          </p>
        </div>
      </div>
      <Web3Button>CONNECT</Web3Button>
      {/* {myAccount && <div> Connected </div>} */}
    </div>
  );
};

export default allowedVoters;
