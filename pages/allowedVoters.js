import React, { useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
//---------------INTERNAL IMPORTS--------------
import { VotingContext } from "../store/Voter";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import images from "../public";

const allowedVoters = () => {
  const [fileUrl, setFileURL] = useState(null);
  const [formInput, setFormInput] = useState({
    name: "",
    address: "",
    position: "",
  });
  const router = useRouter();
  // const {uploadToIPFS} = useContext(VotingContext);

  //-----------------VOTERS IMAGE DROP------------------------------------------
  const onDrop = useCallback( async (acceptedFile) => {
    const url = await uploadToIPFS(acceptedFile[0]); //returns url once image file is uploaded
    setFileURL(url);
  })  

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept: "image/*", // /* to accept all images
    maxSize: 5000000, //5mb
  })


  return <div>allowedVoters</div>;
};

export default allowedVoters;