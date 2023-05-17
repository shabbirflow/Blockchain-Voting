import React, { useContext, useEffect } from "react";
import { VotingContext } from "../store/Voter";
import { useRouter } from "next/router";
import Head from "next/head";

const needConnect = () => {
  const router = useRouter();
  const { myAccount } = useContext(VotingContext);

  useEffect(() => {
    if (myAccount.isConnected) {
      router.push("/");
    }
  }, []);

  return (
    <>
      <Head>
        <title>Connection Required</title>
      </Head>
      <div>
        <h1 style={{ textAlign: "center", margin: "3rem" }}>
          Please Connect to your Smart Wallet
        </h1>
      </div>
    </>
  );
};

export default needConnect;
