import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Head from "next/head";
import Countdown from "react-countdown";
import Tilt from "react-parallax-tilt";
//Internal IMPORTS
import { VotingContext } from "../store/Voter";
import style from "../styles/index.module.css";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button"; // import Card from "../components/Card/Card";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";

const modalstyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.7)",
};

const tiltStyle = {
  width: "30rem",
  height: "30rem",
  backgroundColor: "#282A3A",
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}

const HOME = () => {
  const {
    voterLength,
    candidateLength,
    candidateArray,
    vote,
    winner,
    findWinner,
  } = useContext(VotingContext);
  const [winnerView, setWinnerView] = useState(false);
  const voteHandler = (add) => {
    vote({ id: add[2].toNumber(), address: add[6] });
  };
  // console.log("WINNER", winner);
  const color = typeof account !== "undefined" ? "red" : "blue";
  const handleWinner = () => {
    findWinner();
    setWinnerView(true);
  };
  const handleClose = () => {
    setWinnerView(false);
  };
  // console.log(winner);
  const stuff = (
    <>
      <div className={style.numbers}>
        <h3>
          No. of Candidates: <span> {candidateLength}</span>
        </h3>
        <h3>
          No. of Voters: <span>{voterLength}</span>
        </h3>
      </div>
      <div className={style.candidateGrid}>
        <ul>
          {candidateArray &&
            candidateArray.map((x, ind) => (
              <Card key={ind} className={style.card}>
                <CardMedia
                  image={x[3]}
                  alt="candidate image"
                  sx={{ width: "10rem", height: "10rem", margin: "0.3rem" }}
                  title="green iguana"
                />
                <CardContent>
                  <div>
                    <span className={style.a}>{x[0]}</span>
                  </div>
                  <div>
                    Age: <span>{x[1]}</span>
                  </div>
                  <div>
                    Votes: <span>{x[4].toNumber()}</span>
                  </div>
                </CardContent>
                <CardActions>
                  <Button
                    className={style.vote}
                    onClick={(e) => {
                      e.preventDefault();
                      voteHandler(x);
                    }}
                  >
                    VOTE
                  </Button>
                </CardActions>
              </Card>
            ))}
        </ul>
      </div>
      <div>
        <button onClick={handleWinner} className={style.winnerButton}>
          Get Winner
        </button>
        <Modal open={winnerView} onClose={handleClose} sx={modalstyle}>
          {winner && winner[3] && winner[4] ? (
            <>
              <Tilt
                style={tiltStyle}
              >
                <h1 className={style.neonText}>WINNER</h1>
                <Card className={style.card}>
                  <CardMedia
                    image={winner[3]}
                    alt="candidate image"
                    sx={{ width: "10rem", height: "10rem", margin: "0.3rem" }}
                    title="green iguana"
                  />
                  <CardContent>
                    <div>
                      <span className={style.a}>{winner[0]}</span>
                    </div>
                    <div>
                      Age: <span>{winner[1]}</span>
                    </div>
                    <div>
                      Address: <span>{winner[6].slice(0, 9)}...</span>
                    </div>

                    <div>
                      {/* Votes: <span>{winner[4].toNumber()}</span> */}
                    </div>
                  </CardContent>
                  {/* <div>YOU WON !!</div> */}
                </Card>
              </Tilt>
            </>
          ) : (
            <div>WINNER NOT FOUND YET</div>
          )}
        </Modal>
      </div>
    </>
  );

  return (
    <div>
      <Head>
        <title>HOME PAGE</title>
      </Head>
      {stuff}
    </div>
  );
};

export default HOME;
