import React, {useState, useEffect, useContext} from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Countdown from 'react-countdown';
//Internal IMPORTS
import { VotingContext } from '../store/Voter';
import Style from '../styles/index.module.css';
import Card from '../components/Card/Card';
import image from '../public/images/13.png'


const HOME =  () => {
  const {votingTitle} = useContext(VotingContext);

  return(
    <div>
      <Head>
        <title>Index</title>
      </Head>
      SANITY CHECK
      BC VOTING
      <Image src={image} alt='guysitting' style={{width: '100px', height: '100px'}}/>
      <h2>{votingTitle}</h2>
    </div>
  )

}

export default HOME;