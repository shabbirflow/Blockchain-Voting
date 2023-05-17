import React, { useContext } from "react";
import charlie from "../public/images/filibusta.gif";
import Image from "next/image";
import { VotingContext } from "../store/Voter";
import Head from "next/head";

const error = () => {
  const { error } = useContext(VotingContext);
  if (error) {
    console.log(typeof error, Object.keys(error), error.reason);
  }
  return (
    <>
      {" "}
      <Head>
        <title>Error!</title>
      </Head>
      <div
        style={{
          width: "100vw",
          height: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>ERROR</h1>
        <div>
          {error && error.reason
            ? error.reason
            : error && error.message
            ? error.message
            : error && typeof error === "string"
            ? error
            : "SOMETHING WENT WRONG"}
        </div>
        <div style={{ margin: "1.5rem" }}>
          <Image src={charlie} alt="filibuster" />
        </div>
      </div>
    </>
  );
};

export default error;
