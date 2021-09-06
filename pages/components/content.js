import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import React, {useRef,  useState } from 'react';
import logoPic from '../../public/logo-with-text.png'
import Controls from './controls'
import Countdown from 'react-countdown';
import { Fade } from "react-awesome-reveal";


export default function content(props) {
  const [userAddress, setUserAddress] = useState('CONNECT')
  const [mintAmount, setMintAmount] = useState(4444)
    // Random component
  const Completionist = () => <span className='countdown'>Minting is live!</span>;

  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return <span className={styles.countdown}>{days} DAYS {hours} HRS {minutes} MIN {seconds} SEC</span>;
    }
  }



  return (
    <div className={styles.content_container}>
     
      {props.tab == 1 ? <div className={styles.blue_box}>
      	<Fade>
      	<h1>
	      	<span style={{color:'#049CD8'}}>M</span>
	      	<span style={{color:'#FBD000'}}>a</span>
	      	<span style={{color:'#E52521'}}>f</span>
	      	<span style={{color:'#43B047'}}>i</span>
	      	<span style={{color:'#FBD000'}}>a</span>
	      	<span style={{color:'#E52521'}}>K</span>
	      	<span style={{color:'#43B047'}}>o</span>
	      	<span style={{color:'#FBD000'}}>n</span>
	      	<span style={{color:'#049CD8'}}>g</span>
	      	<span style={{color:'#43B047'}}>s</span>
      	</h1>
      	<p>MafiaKongs is a collection of 5,000 randomly generated Mafia Kong NFTs on the ETH blockchain. They are well known to wander around the Crypto Jungle in search of Banana Serum.</p>
      	<br/>
      	<p> Launching In:</p>
      	<div className={styles.time_wrap}>
	    	<Countdown  date={1631037600000} renderer={renderer}/>
	    </div>
	    </Fade>
      </div>:''}
      {props.tab == 2 ? <div className={styles.blue_box}>
      	<Fade>
      	<h1>
	      	<span style={{color:'#049CD8'}}>R</span>
	      	<span style={{color:'#FBD000'}}>O</span>
	      	<span style={{color:'#E52521'}}>A</span>
	      	<span style={{color:'#43B047'}}>D</span>
	      	<span style={{color:'#FBD000'}}>M</span>
	      	<span style={{color:'#E52521'}}>A</span>
	      	<span style={{color:'#43B047'}}>P</span>
      	</h1>
      	<Fade delay={300}>
      	<div className={styles.roadmap_item}>
      		<img src='Frame (2).svg'/>
      		<p>1/1 LEGENDARY KONGS GIVEAWAY </p>
      	</div>
      	</Fade>
      	<Fade delay={500}>
      	<div className={styles.roadmap_item}>
      		<img src='Frame (3).svg'/>
      		<p>BANANA SERUM AIRDROP (CURRENT HOLDERS)</p>
      	</div>
      	</Fade>
      	<Fade delay={700}>
      	<div className={styles.roadmap_item}>
      		<img src='Frame (4).svg'/>
      		<p>4ETH DONATION TO GorillaFund NGO</p>
      	</div>
      	</Fade>
      	<Fade delay={1000}>
      	<div className={styles.roadmap_item}>
      		<img src='Frame (5).svg'/>
      		<p>TREASURY SPLIT BETWEEN SERUM HOLDERS  SECRET COMMUNITY REWARD</p>
      	</div>
      	</Fade>
      	</Fade>
      </div>:''}
      {props.tab == 3 ? <div className={styles.blue_box}>
      	<Fade>
      	<h1>
	      	<span style={{color:'#049CD8'}}>R</span>
	      	<span style={{color:'#FBD000'}}>E</span>
	      	<span style={{color:'#E52521'}}>W</span>
	      	<span style={{color:'#43B047'}}>A</span>
	      	<span style={{color:'#FBD000'}}>R</span>
	      	<span style={{color:'#E52521'}}>D</span>
	      	<span style={{color:'#43B047'}}>S</span>
      	</h1>
      	<img className={styles.banana} src='banana.svg' />
      	<p className={styles.banana_text}>Banana Serum</p>
      	<p className={styles.banana_text}>Get 1 Banana Serum a month per Kong held</p>
      	<p className={styles.banana_text}>Ocasionally giveaways will drop them </p>
      	<p className={styles.banana_text}>1x Banana Serum for each under 50% mint </p>
      	<br/>
      	<p className={styles.banana_text}>
      	<div className={styles.banana_text_xp}><span style={{color:'#FBD000'}}>Every month</span>, <span style={{color:'#E52521'}}>treasury</span> <span style={{color:'#049CD8'}}>will be</span> <span style={{color:'#43B047'}}>distributed</span> <span style={{color:'#FBD000'}}>to <span style={{color:'#E52521'}}>serum</span> holders </span></div>
      	</p>
      	<p className={styles.banana_text}>Treasury = 5% of primary and secondary sales</p>
      	</Fade>
      </div>:''}
      <Controls />
    </div>
  )
}
