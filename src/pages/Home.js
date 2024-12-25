import React, { useState, useEffect } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { ethers } from "ethers";
import ElectionManagerABI from "../utils/ElectionManagerABI.json";
import TransactionList from "../components/TransactionList";
import SetToken from "../components/SetTokenForm";
import TokenTrade from "../components/TokenTrade";
import Demo from "../components/Demo";
import History from "../components/History";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
import Intructions from "../components/Instructions";

const ElectionManagerAddress = "0xE29FFC79c032945a8e84b4E63c4B56C183fFF219";

const Home = () => {
  const { provider, signer, qnuContract } = useWeb3();
  const [activeTab, setActiveTab] = useState("transactions");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElections = async () => {
      if (provider) {
        try {
          const contract = new ethers.Contract(
            ElectionManagerAddress,
            ElectionManagerABI,
            provider
          );
          const activeElectionIds = await contract.getActiveElections();
          toast.success("Fetched active elections successfully!");
        } catch (error) {
          // toast.error("Failed to fetch elections. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchElections();
  }, [provider]);

  const handleBuy = async (id, number) => {
    if (!signer || !qnuContract) {
      toast.error("Signer or contract is not available.");
      return;
    }
    try {
      const transaction = await qnuContract.buyTransaction(id, number);
      await transaction.wait();
      toast.success("Transaction completed successfully!");
    } catch (error) {
      toast.error("Failed to buy token. Please check the details and try again.");
    }
  };

  const handleWithdraw = async (id) => {
    if (!signer || !qnuContract) {
      toast.error("Signer or contract is not available.");
      return;
    }
    try {
      const transaction = await qnuContract.withDraw(id);
      await transaction.wait();
      toast.success("Withdrawal completed successfully!");
    } catch (error) {
      toast.error("Failed to withdraw token. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
    <ToastContainer />
    {/* Sidebar */}
    <div className="w-1/5 bg-gray-200 p-4 overflow-auto">
      <h2 className="text-lg font-bold mb-4">Menu</h2>
      <ul>
        <li
          className={`cursor-pointer p-2 mb-2 ${
            activeTab === "transactions" ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => setActiveTab("transactions")}
        >
          Transactions
        </li>
        <li
          className={`cursor-pointer p-2 mb-2 ${
            activeTab === "setToken" ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => setActiveTab("setToken")}
        >
          Set Token
        </li>
        <li
          className={`cursor-pointer p-2 ${
            activeTab === "tokenTrade" ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => setActiveTab("tokenTrade")}
        >
          Token Trade
        </li>
        <li
          className={`cursor-pointer p-2 mb-2 ${
            activeTab === "demo" ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => setActiveTab("demo")}
        >
          Token
        </li>
        <li
          className={`cursor-pointer p-2 mb-2 ${
            activeTab === "history" ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => setActiveTab("history")}
        >
          History
        </li>
        <li
          className={`cursor-pointer p-2 mb-2 ${
            activeTab === "intructions" ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => setActiveTab("intructions")}
        >
          Instructions
        </li>
      </ul>
    </div>
  
    {/* Main Content */}
    <div className="w-4/5 p-4 overflow-auto">
      {activeTab === "transactions" && (
        <TransactionList
          handleBuy={handleBuy}
          handleWithdraw={handleWithdraw}
          loading={loading}
        />
      )}
      {activeTab === "setToken" && <SetToken />}
      {activeTab === "tokenTrade" && <TokenTrade />}
      {activeTab === "demo" && <Demo />}
      {activeTab === "history" && <History />}
      {activeTab === "intructions" && <Intructions />}
    </div>
    <Footer />
  </div>
  
  );
};

export default Home;
