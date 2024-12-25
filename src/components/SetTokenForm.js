import React, { useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SetTokenForm = () => {
  const { signer, qnuContract, account } = useWeb3();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const ADMIN_ADDRESS = "0xE29FFC79c032945a8e84b4E63c4B56C183fFF219";

  const isAdmin = () => account == ADMIN_ADDRESS.toLowerCase();
  
  const onSubmit = async (data) => {
    if (!signer) {
      toast.error("Please connect your wallet to proceed.");
      return;
    }
    try {
      setLoading(true);
      const transaction = await qnuContract.setToken(
        data.tokenAddress,
        data.price
      );
      await transaction.wait();
      toast.success("Token price updated successfully!");
    } catch (error) {
      toast.error(`Failed to update token price: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin()) {
    toast.warn(
      "Access Denied: You do not have permission to access this page."
    );
    return (
      <div className="text-center mt-8">
        <p className="text-red-500 font-bold">⛔ Access Denied</p>
        <p className="text-gray-600">
          You do not have permission to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <ToastContainer />
      <h3 className="text-2xl font-bold text-center mb-6 text-gray-700">
        Set Token Price
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="tokenAddress"
          >
            Token Address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            type="text"
            placeholder="Enter Token Address"
            {...register("tokenAddress", { required: true })}
          />
          {errors.tokenAddress && (
            <p className="text-red-500 text-xs mt-1">
              Token address is required.
            </p>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-medium mb-2"
            htmlFor="price"
          >
            Price
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            type="number"
            placeholder="Enter Price"
            {...register("price", { required: true })}
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">Price is required.</p>
          )}
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 text-white font-bold rounded-lg transition duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Set Price"}
        </button>
      </form>
    </div>
  );
};

export default SetTokenForm;
