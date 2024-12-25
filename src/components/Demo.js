import React, { useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Token = () => {
  const { signer, lorContract, setdata, account} = useWeb3();
  const [loading, setLoading] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");

  const handleSubmit = async () => {
    if (!signer) {
      toast.error("Please connect your wallet.", {position: "bottom-left"});
      return;
    }

    if (!tokenAddress) {
      toast.error("Token address is required.", {position: "bottom-left"});
      return;
    }

    try {
      setLoading(true);
      const approval = await lorContract.faucent(
        tokenAddress
      );
      await approval.wait();
      if(tokenAddress.toLocaleLowerCase() == account) {
        console.log('ok');
        const balance = await lorContract.balanceOf(
          account
        );
        setdata({lorBalance: balance, symbol: "LOR"});
      }
      toast.success("Transaction submitted successfully.", {position: "bottom-left"});
    } catch (error) {
      console.error("Error submitting transaction:", error);
      toast.error(`Error submitting transaction: ${error.message}`, {position: "bottom-left"});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Faucent Token</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="max-w-md mx-auto"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="tokenAddress"
          >
            Token Address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Enter Token Address"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
          // onClick={}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Token;
