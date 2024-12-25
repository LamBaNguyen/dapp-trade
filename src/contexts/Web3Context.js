import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import LORABI from "../utils/LORABI.json";
import QNUABI from "../utils/QNUABI.json";
import LQHABI from "../utils/LQHABI.json";

const Web3Context = createContext();

const LORAddress = "0x18B041AcBD5C0594fF026135302C9bE3951B8309"; // địa chỉ token sàn
const QNUAddress = "0xBb9Fb66C239Ee2D19e1F9b7b9D0766db786e80cc";// địa chỉ QNU sàn
const LQHAddress = "0x23509C9363d97cFD080c677D5721eFe23545cCdE";// địa chỉ token

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [lorContract, setlorContract] = useState(null);
  const [qnuContract, setQnuContract] = useState(null);
  const [lqhContract, setLqhContract] = useState(null);
  const [icoContract, setIcoContract] = useState(null);
  const [data, setdata] = useState(0);


  async function fetchData(address) {
    const response = await fetch(
      `https://api-holesky.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=WBDX7BK8X7RU76J36IICU1WQFBCEHI6355`
    );
    const data = await response.json();
    return data.result;
  }

  // Initialize connection to the wallet
  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      try {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts && accounts.length > 0) {
          const signer = await web3Provider.getSigner(accounts[0]);
          setSigner(signer);
          setAccount(accounts[0]);
          const lor = new ethers.Contract(LORAddress, await fetchData(LORAddress), signer);
          setlorContract(lor);
          const qnu = new ethers.Contract(QNUAddress, await fetchData(QNUAddress), signer);
          setQnuContract(qnu);
          const lqh = new ethers.Contract(LQHAddress, await fetchData(LQHAddress), signer);
          setLqhContract(lqh);
         }
      } catch (error) {
        console.error("Error connecting wallet", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  }, []);
  

    
  const disconnectWallet = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setlorContract(null);
    setQnuContract(null);
    setLqhContract(null);
    setdata(0);
  }, []);

  useEffect(() => {
    if (account) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnectWallet();
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
      }
    };
  }, [account, disconnectWallet]);

  useEffect(() => {
    const fetchBalance = async () => {

      if (lorContract && account) {
        try {
          const balance = await lorContract.balanceOf(account);
          setdata({lorBalance: Number(balance.toString()), symbol: "LOR"});
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };
    fetchBalance();
  }, [account, lorContract]);

  // Add Holesky network if it's not already added
  const addNetwork = async () => {
    if (window.ethereum) {
      const currentChainId = await window.ethereum.request({ method: "eth_chainId" });

      if (currentChainId !== "0x4268") {
        // 0x4268 is the Hexadecimal chainId for Holesky
        const params = [
          {
            chainId: "0x4268",
            chainName: "Holesky Test Network",
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: ["https://rpc.holesky.ethpandaops.io/"],
            blockExplorerUrls: ["https://holesky.etherscan.io/"],
          },
        ];

        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params,
          });
          console.log("Holesky Test Network added successfully.");
        } catch (error) {
          console.error("Error adding Holesky network:", error.message);
        }
      } else {
        console.log("Holesky Test Network is already selected.");
      }
    } else {
      console.log("Ethereum provider not found. Please install MetaMask.");
    }
  };

  const value = {
    provider,
    signer,
    account,
    lorContract,
    qnuContract,
    lqhContract,
    connectWallet,
    disconnectWallet,
    addNetwork,
    data,
    setdata,
    icoContract,
    setIcoContract,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => {
  return useContext(Web3Context);
};
