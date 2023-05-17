import React, { useContext, useEffect } from "react";
import { VotingContext } from "../store/Voter";
import style from "../styles/index.module.css";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Head from "next/head";

const voterList = () => {
  const { getVoterList, voterArray, getCandidateList, candidateArray } =
    useContext(VotingContext);

  // console.log(voterArray, process.env.NEXT_PUBLIC_PINATA_API_KEY);
  console.log(voterArray);

  return (
    <>
      <Head>
        <title>Status</title>
      </Head>
      <div>
        <div className={style.statusTitle}>
          <h1>VOTERS STATUS</h1>
        </div>
        <div className={style.candidateGrid}>
          <ul>
            {voterArray &&
              voterArray.map((x, ind) => (
                <Card key={ind} className={style.card}>
                  <CardMedia
                    image={x[2]}
                    alt="voter image"
                    sx={{ width: "10rem", height: "10rem", margin: "0.3rem" }}
                    title="green iguana"
                  />
                  <CardContent>
                    <div>
                      <span className={style.a}>{x[1]}</span>
                    </div>
                    <div>
                      Address: <span>{x[3].slice(0, 10)}...</span>
                    </div>
                  </CardContent>
                  <CardActions>
                    <Button
                      disabled={true}
                      className={
                        x[6] ? style.voterListButton : style.voterListRed
                      }
                    >
                      {x[6] ? "VOTED" : "NOT VOTED YET"}
                    </Button>
                  </CardActions>
                </Card>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default voterList;
