import React, { useState, useEffect, useCallback } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { ethers } from "ethers";
import QNUABI from "../utils/QNUABI.json";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TokenTrade = () => {
  const { signer, qnuContract, lqhContract, account } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const tokenAddress = watch("tokenAddress");
  const tokenAmount = watch("tokenAmount");

  async function fetchData(address) {
    const response = await fetch(
      `https://api-holesky.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=WBDX7BK8X7RU76J36IICU1WQFBCEHI6355`
    );
    const data = await response.json();
    return data.result;
  }

  const onSubmit = async (data) => {
    console.log("data onSubmit:", data);
    if (!signer) {
      toast.error("Please connect your wallet.", {position: "bottom-left"});
      return;
    }
    if (!data) {
      toast.error("Invalid form data.", {position: "bottom-left"});
      return;
    }
    try {
      setLoading(true);

      const tokenAddress = data.tokenAddress;
      const tokenAmount = Number(data.tokenAmount);

      
      // get Contract on holesky
      let abiContract = await fetchData(tokenAddress);
      const icoContract = new ethers.Contract(tokenAddress, abiContract, signer);
      console.log('icocontract0', icoContract);
      const approval = await icoContract.approve(
        qnuContract.target,
        tokenAmount
      );
      await approval.wait();

      // lqh contract
      // const approval = await lqhContract.approve(
      //   qnuContract.target,
      //   tokenAmount
      // );
      // // console.log('approve',approval);
      // await approval.wait();

      const transaction = await qnuContract.createTransaction(
        tokenAddress,
        tokenAmount
      );
      await transaction.wait();
      toast.success("Create transaction successfully.", {position: "bottom-left"});
    } catch (error) {
      toast.error(`Error creating transaction: ${error.message}`, {position: "bottom-left"});
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (id, number) => {
    if (!signer || !qnuContract) {
      toast.error("Please connect your wallet.", {position: "bottom-left"});
      return;
    }
    try {
      setLoading(true);
      console.log("Before buyTransaction: ", id, number);
      const transaction = await qnuContract.buyTransaction(id, number);
      console.log("After buyTransaction: ", transaction);
      await transaction.wait();
      toast.success("Buy transaction successfully.", {position: "bottom-left"});
    } catch (error) {
      console.error("Error buying token:", error);
      toast.error(`Error buying token: ${error.message}`, {position: "bottom-left"});
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id) => {
    if (!signer || !qnuContract) {
      toast.error("Please connect your wallet.", {position: "bottom-left"});
      return;
    }
    try {
      setLoading(true);
      console.log("Before withDraw: ", id);
      const transaction = await qnuContract.withDraw(id);
      console.log("After withDraw: ", transaction);
      await transaction.wait();
      toast.success("Withdraw transaction successfully.", {position: "bottom-left"});
    } catch (error) {
      console.error("Error withdrawing token:", error);
      toast.error(`Error withdrawing token: ${error.message}`, {position: "bottom-left"});
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = useCallback(async () => {
    if (qnuContract) {
      try {
        const data = await qnuContract.getTokens();
        console.log("transactions from contract:", data);
        if (data && Array.isArray(data)) {
          setTransactions(data);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
  }, [qnuContract]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    const fetchPrice = async () => {
      if (tokenAddress && qnuContract && tokenAmount) {
        try {
          const price = await qnuContract.getTokenPrice(tokenAddress);
          setCalculatedPrice(Number(price.toString()) * tokenAmount);
          setValue("lorPrice", Number(price.toString()) * tokenAmount);
        } catch (e) {
          setCalculatedPrice(0);
          setValue("lorPrice", 0);
          console.log("Error fetch price: ", e);
        }
      }
    };
    fetchPrice();
  }, [tokenAddress, tokenAmount, qnuContract, setValue]);

  return (
    <div>
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Token Trade</h2>
      <h3 className="text-xl font-bold mb-2">Create Transaction</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
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
            {...register("tokenAddress", { required: true })}
          />
          {errors.tokenAddress && (
            <p className="text-red-500 text-xs italic">
              This field is required
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="tokenAmount"
          >
            Token Amount
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            placeholder="Enter Token Amount"
            {...register("tokenAmount", { required: true })}
          />
          {errors.tokenAmount && (
            <p className="text-red-500 text-xs italic">
              This field is required
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="lorPrice"
          >
            LOR Price
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            placeholder="Enter DVOTE Price"
            value={calculatedPrice}
            readOnly
            {...register("lorPrice", { required: true })}
          />
          {errors.lorPrice && (
            <p className="text-red-500 text-xs italic">
              This field is required
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Transaction"}
        </button>
      </form>
    </div>
  );
};

export default TokenTrade;
