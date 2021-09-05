import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Content from './components/content'
import Controls from './components/controls'
import logoPic from '../public/logo-with-text.jpeg'
import { Fade } from "react-awesome-reveal";
import React, {useRef,  useState } from 'react';
import Modal from 'react-modal';
Modal.defaultStyles.overlay.backgroundColor = 'rgba(0,0,0,0.4)';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    fontFamily:'Super Mario',
    letterSpacing: '5px',
    webkitTextStrokeColor: 'black',
    webkitTextStrokeWidth: '1.00px',
    background: `url('/box_med.svg')`,
    border:'none',
    backgroundSize:'contain',
    backgroundRepeat:'no-repeat',
    width:'min-content'
  },
};

export default function Home() {
    const _chainIdToCompare = 1;
    const [userAddress, setUserAddress] = useState('CONNECT');
    const [mintAmount, setMintAmount] = useState(4444);
    const [mintForAllStartDate, setMintForAllStartDate] = useState(new Date());
    const [remaining, setRemaining] = useState(4444);
    const [tab, setTab] = useState(1)
    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
      setIsOpen(true);
    }

    function afterOpenModal() {
    }

    function closeModal() {
      setIsOpen(false);
    }


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
            <li className={styles.nav_item}><a href='https://twitter.com/MafiaKongs'>Twitter</a>
              <div className={styles.Frame}></div>
            </li>
            <li onClick={openModal} className={styles.connect}>{userAddress}
            </li>
          </ul>
          <Fade>
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Connect Modal"
          >
            <h1 className={styles.connect_h1}>
              <span style={{color:'#049CD8'}}>C</span>
              <span style={{color:'#FBD000'}}>O</span>
              <span style={{color:'#E52521'}}>N</span>
              <span style={{color:'#43B047'}}>N</span>
              <span style={{color:'#FBD000'}}>E</span>
              <span style={{color:'#E52521'}}>C</span>
              <span style={{color:'#43B047'}}>T</span>
            </h1>
            <div className={styles.connect_but}><img src='https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg' />MetaMask</div>
            <div className={styles.connect_but}><img src='https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/d45b64841c7c5251183a4f2495ed1954fcf8401b/svg/walletconnect-logo.svg' />WalletConnect</div>
          </Modal>
          </Fade>
        </div>

        <Fade style={{marginTop:'10%'}}>
          <Content tab={tab}/>

        </Fade>
      </main>

    </div>
  )
}
