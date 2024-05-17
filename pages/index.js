import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

const App = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [showAddress, setShowAddress] = useState(true); // State to show/hide address

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
  }, []);

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      getBalance(accounts[0]);
    } else {
      setAccount(null);
      setBalance(null);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        getBalance(accounts[0]);
      } catch (error) {
        console.error("Error connecting to wallet", error);
      }
    } else {
      alert("MetaMask is not installed");
    }
  };

  const getBalance = async (address) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(address);
    setBalance(ethers.utils.formatEther(balance));
  };

  const depositOneEth = async () => {
    if (!account) return;
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", atm_abi.abi, signer);
  
      const transaction = await signer.sendTransaction({
        to: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        value: ethers.utils.parseEther("1")
      });
      await transaction.wait();
  
      getBalance(account);
    } catch (error) {
      console.error("Error depositing funds:", error);
    }
  };
  
  const withdrawOneEth = async () => {
    if (!account) return;
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", atm_abi.abi, signer);
    
      const transaction = await contract.withdraw(ethers.utils.parseEther("1"));
      await transaction.wait();
    
      getBalance(account);
    } catch (error) {
      console.error("Error withdrawing funds:", error);
    }
  };

  const toggleShowAddress = () => {
    setShowAddress(!showAddress);
  };

  const styles = {
    body: {
      width: '400px',
      margin: '0 auto',
      padding: '20px',
      textAlign: 'center'
    },
    button: {
      margin: '7px',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#dddddd', 
        color: 'black', 
      }
    },
    buttonPrimary: {
      backgroundColor: '#84cdee',
      color: 'black',
      width: '300px',
      height: '40px',
      borderRadius: '50px',
      border: '2px solid black',
    },
    buttonSuccess: {
      backgroundColor: '#b9e2f5',
      color: 'black',
      borderRadius: '50px',
      border: '2px solid black',
    },
    buttonWarning: {
      backgroundColor: '#b9e2f5',
      color: 'black',
      borderRadius: '50px',
      border: '2px solid black'
    },
    div: {
      margin: '15px 0'
    },
    label: {
      fontWeight: 'bold'
    },
    span: {
      marginLeft: '10px'
    },
    title: {
      fontSize: '30px'
    }
  };

  return (
    <div style={styles.body}>
        <div style={styles.div}>
          <label style={styles.title}>Welcome to Sky Wallet! </label>
        </div> <br></br>
        <div style={styles.div}>
          <label style={styles.label}>Account Address: </label>
          <span style={styles.span}>
            {showAddress ? (account || "0x0000000000000000000000000000000000000000") : "Hidden"}
          </span>
          <button onClick={toggleShowAddress} style={{ ...styles.button, ...styles.buttonPrimary }}>
            {showAddress ? "Hide" : "Show"}
          </button>
        </div>
        <div style={styles.div}>
          <label style={styles.label}>Balance: </label> <br></br>
          <span style={styles.span}>{balance !== null ? `${balance} ETH` : "ETH"}</span>
        </div>
      <br></br>
      <button onClick={depositOneEth} style={{ ...styles.button, ...styles.buttonSuccess }}>
        Deposit: 1 ETH
      </button>
      <button onClick={withdrawOneEth} style={{ ...styles.button, ...styles.buttonWarning }}>
        Withdraw: 1 ETH
      </button> <br></br>
      <button
        onClick={connectWallet}
        style={{ ...styles.button, ...styles.buttonPrimary }}
      >
        Connect your wallet
      </button>
    </div>
  );
};

export default App;
