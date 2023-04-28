import React from "react";
import { Web3Button } from "@web3modal/react";
import { Typography } from "@mui/material";
import Image from "next/image";
import icon from "../../public/images/bcnode.png";
import style from "./Navbar.module.css";
import Link from "next/link";

const Navbar = () => {
  return (
    <ul className={style.ul}>
      <Image src={icon} className={style.icon} alt="icon" />
      <Link href="/" style={{textDecoration: "none"}}>
        <Typography variant="h6" className={style.title}>
          BLOCKCHAIN VOTING SYSTEM
        </Typography>{" "}
      </Link>
      <div className={style.buttonDiv}>
        <Web3Button>Connect Wallet</Web3Button>
      </div>
    </ul>
  );
};

export default Navbar;
