import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import logoPic from '../public/logo-with-text.jpeg'
import { Fade } from "react-awesome-reveal";
import ContractData from '../config/Contract.json';
import React, {useRef,  useState, useEffect } from 'react';
import Modal from 'react-modal';
import Countdown from 'react-countdown'
Modal.defaultStyles.overlay.backgroundColor = 'rgba(0,0,0,0.4)';
import WalletConnectProvider from "@walletconnect/web3-provider";
const Web3 = require('web3');
import detectEthereumProvider from '@metamask/detect-provider'

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
    WebkitTextStrokeColor: 'black',
    WebkitTextStrokeWidth: '1.00px',
    background: `url('/box_med.svg')`,
    border:'none',
    backgroundSize:'contain',
    backgroundRepeat:'no-repeat',
    width:'min-content'
  },
};

export default function Home() {
    const [mintAmount, setMintAmount] = useState(5000);
    const [tab, setTab] = useState(1)
    const [modalIsOpen, setIsOpen] = React.useState(false);

    const [modalOpen, setModalOpen] = useState(false);

    const Completionist = () => <span className='countdown'>Minting is live!</span>

    const renderer = ({ days, hours, minutes, seconds, completed }) => {
      if (completed) {
        return <Completionist />
      } else {
        return <span className={styles.countdown}>{days} DAYS {hours} HRS {minutes} MIN {seconds} SEC</span>
      }
    }
    function openModal() {
      setModalOpen(true);
    }

    function afterOpenModal() {
    }

    function closeModal() {
      setModalOpen(false);
    }

  //const _chainIdToCompare = 1; //Ethereum
   const _chainIdToCompare = 4; //Rinkeby

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [userAddress, setUserAddress] = useState('Connect');
  const [usingMetamask, setUsingMetamask] = useState(false);
  const [usingWalletConnect, setUsingWalletConnect] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
  }

  useEffect(async () => {
    
    loadData();
    loadIndependentData();
  }, []);

  
  const [mintValue, setMintValue] = useState(1);


  const [freemintStartDate, setFreemintStartDate] = useState(new Date());
  const [freemintStopDate, setFreemintStopDate] = useState(new Date());
  const [mintForAllStartDate, setMintForAllStartDate] = useState(new Date());

  const [freeAvailableMints, setFreeAvailableMints] = useState(0);
  const [remainingCats, setRemainingCats] = useState(0);
  const [maxStock, setMaxStock] = useState(0);

  const loadIndependentData = async() => {
    var currentProvider = new Web3.providers.HttpProvider(`https://${_chainIdToCompare == 1 ? 'mainnet' : 'rinkeby'}.infura.io/v3/be634454ce5d4bf5b7f279daf860a825`);
    const web3 = new Web3(currentProvider);
    const contract = new web3.eth.Contract(ContractData.abi, ContractData.address);



      const mintForAllStartDate = await contract.methods._startDate().call();
      var _date = new Date(0)
      _date.setUTCSeconds(mintForAllStartDate);
      setMintForAllStartDate(_date);

      const maxSupply = await contract.methods.maxSupply().call();
      const totalSupply = await contract.methods.totalSupply().call();
      setRemainingCats(maxSupply - totalSupply);
      setMaxStock(maxSupply);
  }

  const loadDataWithMetamask = async(userAddress) => {
    
      const provider = await detectEthereumProvider()
    
    if (provider && userAddress!='') {
      const web3 = new Web3(provider);
      const contract = new web3.eth.Contract(ContractData.abi, ContractData.address);
      const _freeAvailableMints = await contract.methods.getFreeMintableCount(userAddress).call();
      setFreeAvailableMints(_freeAvailableMints);
    }
    
  }

  const requestAccountMetamask = async() => {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    
    if(accounts.length > 0) {
      setUserAddress(accounts[0]);
      setUsingMetamask(true);
      setUsingWalletConnect(false);
      setModalOpen(false);
      loadDataWithMetamask(accounts[0]);

      const chainId = await ethereum.request({ method: 'eth_chainId' });
      handleChainChanged(chainId);

      ethereum.on('chainChanged', handleChainChanged);

      function handleChainChanged(_chainId) {
        if(_chainId != _chainIdToCompare) {
          window.location.reload();
        }
      }

      ethereum.on('accountsChanged', handleAccountsChanged);

      async function handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
          setUserAddress('');
          setUsingMetamask(false);
          setUsingWalletConnect(false);
          setModalOpen(false);
          setFreeAvailableMints(0);
          
          // loadDataAfterAccountDetected();
        } else if (accounts[0] !== userAddress) {
          const chainId = await ethereum.request({ method: 'eth_chainId' });
          setUserAddress(chainId == _chainIdToCompare ? accounts[0] : 'CONNECT');
          
          setUsingMetamask(chainId == _chainIdToCompare);
          setUsingWalletConnect(false);
          setModalOpen(false);
          loadDataWithMetamask(accounts[0]);
          
        }
      }
    }
  }

  const connectWalletConnectPressed = async () => {
    const _rpc = _chainIdToCompare == 1 ? 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161' : 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
    const provider = new WalletConnectProvider({
      infuraId: "be634454ce5d4bf5b7f279daf860a825",
      supportedChainIds: [_chainIdToCompare]
    });
    
    //  Enable session (triggers QR Code modal)
    await provider.enable();
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();

    if(accounts.length > 0) {
      setUserAddress(accounts[0]);
      setUsingMetamask(false);
      setUsingWalletConnect(true);
      setModalOpen(false);
    }
  }

  const connectMetamaskPressed = async () => {
    try { 
      await window.ethereum.enable();
      requestAccountMetamask();
   } catch(e) {
      // User has denied account access to DApp...
   }
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x'+_chainIdToCompare }],
      });
      requestAccountMetamask();
    } catch (error) {
      
      // This error code indicates that the chain has not been added to MetaMask.
      if (error.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{ chainId: '0x'+_chainIdToCompare, rpcUrl: 'https://...' /* ... */ }],
          });
          requestAccountMetamask();
        } catch (addError) {
        }
      }
    }
  }

  const mintFree = async() => {
    if(usingMetamask) {
      
      
      if(userAddress == '') {
        return alert('User is not connected');
      }
      
      
      if(freeAvailableMints < mintValue) {
        return alert('Not enough frens!')
       }
      if(mintValue == 0) { return; }

      const provider = await detectEthereumProvider();
    
      if (provider && userAddress!='') {
        const web3 = new Web3(provider);
        const contract = new web3.eth.Contract(ContractData.abi, ContractData.address);
        
        await contract.methods.mintForPreOwners(
          mintValue
        ).send({
          from: userAddress,
          value: 0
        });
        alert('Minted successfuly!');
        window.location.reload();
      }
    }else if(usingWalletConnect){
      const _rpc = _chainIdToCompare == 1 ? 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161' : 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
      const provider = new WalletConnectProvider({
        infuraId: "be634454ce5d4bf5b7f279daf860a825",
        supportedChainIds: [_chainIdToCompare]
      });
      
      //  Enable session (triggers QR Code modal)
      await provider.enable();
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();

      if(accounts.length > 0) {
        setUserAddress(accounts[0])
        const web3 = new Web3(provider);
        const contract = new web3.eth.Contract(ContractData.abi, ContractData.address);

        await contract.methods.mintForPreOwners(
          mintValue
        ).send({
          from: userAddress,
          value: 0
        });
        alert('Minted successfuly!');
        window.location.reload();
      }
    }else {
      await requestAccountMetamask();
      if(userAddress && (usingMetamask || usingWalletConnect)) {
        mint();
      }
    }
  }

  const mint = async() => {
    if(usingMetamask) {
      if(userAddress == '') {
        return alert('User is not connected');
      }
      
      if(mintValue == 0) { return; }
      setIsLoading(true);
      const provider = await detectEthereumProvider()
    
      if (provider && userAddress!='') {
        const web3 = new Web3(provider);
        
        const contract = new web3.eth.Contract(ContractData.abi, ContractData.address);

        const _priceWei = await contract.methods.getCurrentPrice().call();
        
        var block = await web3.eth.getBlock("latest");
        var gasLimit = block.gasLimit/block.transactions.length;
        const gasPrice = await contract.methods.mint(
          mintValue
        ).estimateGas({from: userAddress, value: (mintValue*_priceWei)});

        await contract.methods.mint(
          mintValue
        ).send({
          from: userAddress,
          value: (mintValue*_priceWei),
          gas: gasPrice,
          gasLimit: gasLimit
        });
        loadDataWithMetamask(userAddress);
        alert('Minted successfuly!');
        setIsLoading(false);
        window.location.reload();
      }
    }else if(usingWalletConnect){
      const _rpc = _chainIdToCompare == 1 ? 'https://mainnet.infura.io/v3/be634454ce5d4bf5b7f279daf860a825' : 'https://rinkeby.infura.io/v3/be634454ce5d4bf5b7f279daf860a825';
      const provider = new WalletConnectProvider({
        infuraId: "be634454ce5d4bf5b7f279daf860a825",
        supportedChainIds: [_chainIdToCompare]
      });
      
      //  Enable session (triggers QR Code modal)
      await provider.enable();
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();

      if(accounts.length > 0) {
        setUserAddress(accounts[0])
        const web3 = new Web3(provider);
        const contract = new web3.eth.Contract(ContractData.abi, ContractData.address);

        const _priceWei = await contract.methods.getCurrentPrice().call();
        
        await contract.methods.mint(
          mintValue
        ).send({
          from: userAddress,
          value: (mintValue*_priceWei)
        });
        setIsLoading(false);
        alert('Minted successfuly!');
        window.location.reload();
      }
    }else{
      setIsLoading(false);
      await requestAccountMetamask();
      if(userAddress && (usingMetamask || usingWalletConnect)) {
        mint();
      }
    }
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
            <li onClick={openModal} className={styles.connect}>{
              userAddress=='Connect' ? userAddress:`${userAddress.slice(0,3)}...${userAddress.slice(-3)}`}
            </li>
          </ul>
          <Fade>
          <Modal
            isOpen={modalOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Connect Modal"
            ariaHideApp={false}
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
            <div onClick={()=>connectMetamaskPressed()} className={styles.connect_but}><img src='https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg' />MetaMask</div>
            <div onClick={()=>connectWalletConnectPressed()} className={styles.connect_but}><img src='https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/d45b64841c7c5251183a4f2495ed1954fcf8401b/svg/walletconnect-logo.svg' />WalletConnect</div>
          </Modal>
          </Fade>
        </div>

        <Fade style={{marginTop:'10%'}}>
          <div className={styles.content_container}>
     
      {tab == 1 ? <div className={styles.blue_box}>
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
        <Countdown  date={1630936800000} renderer={renderer}/>
      </div>
      </Fade>
      </div>:''}
      {tab == 2 ? <div className={styles.blue_box}>
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
      {tab == 3 ? <div className={styles.blue_box}>
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
      <div className={styles.box_wrapper}>

      <div className={styles.control_big_box}>
        <div className={styles.div_wrapper}>Mint Status: Unavailable</div>
        <div className={styles.div_wrapper}>Mint Price: 0.05 Ξ</div>
        <div className={styles.div_wrapper}>Amount: {maxStock} Kongs</div>
      </div>
      <div className={styles.control_small_box}>
        <p className={styles.bet_p}>Available to Mint:</p>
        <div className={styles.div_wrapper}>
          <span className={styles.div_wrapper_input}>{remainingCats} Kongs</span>
        </div>
      </div>
      {(Date.now() >= mintForAllStartDate) ?
            <div className={styles.control_big_box}>
              <p className={styles.time_left}>Mint</p>
              <div className={styles.button_wrapper}>
                <div onClick={() => {setMintValue(1)}} className={styles.button_box}>1x</div>
                <div onClick={() => {setMintValue(5)}} className={styles.button_box}>5x</div>
                <div onClick={() => {setMintValue(10)}} className={styles.button_box}>10x</div>
              </div>
              <div onClick={() => {mint()}} className={styles.button_box_send}>Mint {mintValue}</div>
            </div> : <div className={styles.control_big_box}>
              <p className={styles.time_left}>Mint</p>
              <p className={styles.time_left_cs}>COMING SOON</p>
              
            </div>}

    </div>  
    </div>

        </Fade>
      </main>

    </div>
  )
}
