import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Content from './components/content'
import Controls from './components/controls'
import logoPic from '../public/logo-with-text.jpeg'
import { Fade } from "react-awesome-reveal";

import React, {useRef,  useState } from 'react';

export default function Home() {
    const _chainIdToCompare = 1; //Ethereum
    // const _chainIdToCompare = 4; //Rinkeby

    const [userAddress, setUserAddress] = useState('CONNECT');
    const [mintAmount, setMintAmount] = useState(4444);
    const [mintForAllStartDate, setMintForAllStartDate] = useState(new Date());
    const [remaining, setRemaining] = useState(4444);
    const [tab, setTab] = useState(1)
  return (
    <div className={styles.container}>
      <Head>
        <title>MafiaKongs - Right from the jungle!</title>
        <meta name="description" content="MafiaKongs - Right from the jungle!" />
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/logo-with-text.jpeg" />
      </Head>

      <main className={styles.bgcontainer}>
        <div className={styles.navbar}>
          <img style={{margin:'auto'}} src='/logo-with-text.jpeg'/>
          <ul className={styles.ul_nav}>
            <li onClick={() => {setTab(1)}} className={styles.nav_item}><a >Home</a>
              <div className={styles.Frame}></div>
            </li>
            <li onClick={() => {setTab(2)}} className={styles.nav_item}><a >Roadmap</a>
              <div className={styles.Frame}></div>
            </li>
            <li onClick={() => {setTab(3)}} className={styles.nav_item}><a >Rewards</a>
              <div className={styles.Frame}></div>
            </li>
            <li onClick={() => {setTab(4)}} className={styles.nav_item}><a href='https://twitter.com/MafiaKongs'>Twitter</a>
              <div className={styles.Frame}></div>
            </li>
            <li className={styles.connect}>{userAddress}
            </li>
          </ul>
        </div>

        <Fade style={{marginTop:'10%'}}>
          <Content tab={tab}/>

        </Fade>
      </main>

    </div>
  )
}
