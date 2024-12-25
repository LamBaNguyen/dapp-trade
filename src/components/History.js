import React, { useEffect, useState, useCallback } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PurchasedTokens = () => {
  const { qnuContract, account } = useWeb3();
  const [purchasedTokens, setPurchasedTokens] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPurchasedTokens = useCallback(async () => {
    
    if (!qnuContract || !account) {
      toast.error("Wallet is not connected or contract not found.", {position: "bottom-left"});
      return;
    }
    try {
      setLoading(true);
      const tokens = await qnuContract.getHistory(account);
      console.log("Purchased tokens:", tokens);
      setPurchasedTokens(tokens);
    } catch (error) {
      console.error("Error fetching purchased tokens:", error);
    //   toast.error("Error fetching purchased tokens. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [qnuContract, account]);

  useEffect(() => {
    fetchPurchasedTokens();
  }, [fetchPurchasedTokens]);
// console.log('Pur',PurchasedTokens);
  return (
    <div className="mt-4">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-center mb-4">Purchased Tokens</h2>
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : purchasedTokens && purchasedTokens.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
          <table className="table-auto w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Address Token</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Symbol</th>
                <th className="px-6 py-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {purchasedTokens.map((token, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{token.token}</td>
                  <td className="px-6 py-4">{token.name}</td>
                  <td className="px-6 py-4">{token.symbol}</td>
                  <td className="px-6 py-4">{Number(token.numberToken)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No purchased tokens found.</p>
      )}
    </div>
  );
};

export default PurchasedTokens;
