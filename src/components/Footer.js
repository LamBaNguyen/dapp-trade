import React from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";

const Footer = () => {
  const { addNetwork, lorContract, lqhContract, account, setdata } = useWeb3();
  // console.log(lorContract.revceiveTokenInit(account[0]))
  // Add token to wallet (import ICOToken)
  // console.log(account);
  const handleTokenInit = async () => {
    try {
      if (account) {
        await lorContract.receiveTokenInit(account);
        setdata({lorBalance: await lorContract.balanceOf(account), symbol: "LOR"})
      }
      toast.success('Succefull', {position: "bottom-left"});
    } catch (error) {
      toast.error(error, {position: "bottom-left"});
    }
  };

  const handlerAccessFaucent = () => {
    window.open('https://cloud.google.com/application/web3/faucet/ethereum/holesky', '_blank');
  }

  const handleImportLORToken = async () => {
    if (!lorContract) {
      toast.error("LOR contract not initialized.", {position: "bottom-left"});
      return;
    }

    try {
      console.log("LOR Contract Address:", lorContract.target);
      // Get the token details
      const symbol = await lorContract.symbol();
      const decimals = 0;

      // Use wallet_watchAsset to add the token to MetaMask
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: lorContract.target,
            symbol: symbol,
            decimals: decimals,
          },
        },
      });

      if (wasAdded) {
        toast.success("LOR Token added to wallet.", {position: "bottom-left"});
      } else {
        toast.error("User rejected adding the token.", {position: "bottom-left"});
      }
    } catch (error) {
      console.error("Error adding token:", error);
      toast.error("Error adding token. Please check the console.", {position: "bottom-left"});
    }
  };
  const handleImportLQHToken = async () => {
    if (!lqhContract) {
      toast.error("LQH contract not initialized.", {position: "bottom-left"});
      return;
    }

    try {
      console.log("LQH Contract Address:", lqhContract.target);
      // Get the token details
      const symbol = await lqhContract.symbol();
      const decimals = 0;

      // Use wallet_watchAsset to add the token to MetaMask
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: lqhContract.target,
            symbol: symbol,
            decimals: decimals,
          },
        },
      });

      if (wasAdded) {
        toast.success("LQH Token added to wallet.", {position: "bottom-left"});
      } else {
        toast.error("User rejected adding the token.", {position: "bottom-left"});
      }
    } catch (error) {
      console.error("Error adding token:", error);
      toast.error("Error adding token. Please check the console.", {position: "bottom-left"});
    }
  };
  const handleAddNetwork = async () => {
    try {
      await addNetwork("web3");
      toast.success("Holesky Test Network added successfully.", {position: "bottom-left"});
    } catch (error) {
      toast.error(`Error adding Holesky network: ${error.message}`, {position: "bottom-left"});
    }
  };
  return (
    // <ToastContainer/>
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg flex space-x-4">
      {/* Button to Provide Token */}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        onClick={handleTokenInit}
      >
        Get Token LOR Free (only one^^)
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        onClick={handleImportLQHToken}
      >
        Add LQH Token
      </button>{" "}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        onClick={handleImportLORToken}
      >
        Add LOR Token
      </button>{" "}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        onClick={handleAddNetwork}
      >
        Add Holesky Testnet
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        onClick={handlerAccessFaucent}
      >
        Faucent Holesky Token
      </button>
      {/* Holesky Testnet Link
      <a
        href="#" //link đào
        onClick={handleAddNetwork}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-300 hover:text-blue-500 font-semibold transition duration-300 ease-in-out transform hover:scale-105"
      >
        Holesky Testnet
      </a> */}
    </div>
  );
};

export default Footer;
