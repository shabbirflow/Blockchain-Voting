import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import style from './BottomNavbar.module.css';

const BottomNavbar = () => {
  const router = useRouter();

  return (
    <div
      className = {style.bottomNav}
    >
      <Link href="/" className={style.link}>
        Home
      </Link>
      <Link href="/candidateRegistration" className={style.link}>
        Register Candidate
      </Link>
      <Link href="/allowedVoters" className={style.link}>
        Register Voter
      </Link>
      <Link href="/voterList" className={style.link}>
        Status
      </Link>
    </div>
  );
};

export default BottomNavbar;
