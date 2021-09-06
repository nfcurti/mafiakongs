import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Content from './components/content'
import Controls from './components/controls'
import logoPic from '../public/logo-with-text.jpeg'
import { Fade } from "react-awesome-reveal";
import ContractData from '../config/Contract.json';
import React, {useRef,  useState, useEffect } from 'react';
import Modal from 'react-modal';
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
    function openModal() {
      setModalOpen(true);
    }

    function afterOpenModal() {
    }

    function closeModal() {
      setModalOpen(false);
    }

  const _chainIdToCompare = 4 //Ethereum
  // const _chainIdToCompare = 4; //Rinkeby

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


  const [mintForAllStartDate, setMintForAllStartDate] = useState(new Date());

  const [freeAvailableMints, setFreeAvailableMints] = useState(0);
  const [remainingCats, setRemainingCats] = useState(0);
  const [maxStock, setMaxStock] = useState(0);

  const loadIndependentData = async() => {
    var currentProvider = new Web3.providers.HttpProvider(`https://${_chainIdToCompare == 1 ? 'mainnet' : 'rinkeby'}.infura.io/v3/be634454ce5d4bf5b7f279daf860a825`);
    const web3 = new Web3(currentProvider);
    const contract = new web3.eth.Contract(ContractData.abi, ContractData.address);


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
              userAddress=='CONNECT' ? userAddress:`${userAddress.slice(0,3)}...${userAddress.slice(-3)}`}
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
          <Content tab={tab}/>

        </Fade>
      </main>

    </div>
  )
}
