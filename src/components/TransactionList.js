import React, { useState, useEffect, useCallback } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TransactionList = ({ loading }) => {
  const { lorContract, qnuContract, setdata, account } = useWeb3();
  const [transactions, setTransactions] = useState([]);
  const [buyAmounts, setBuyAmounts] = useState(0);

  const handleBuyClick = (id) => {
    setBuyAmounts(1);
  };
  const handleWithdraw = async (id) => {
    try {
      const transaction = await qnuContract.withDraw(id);
      await transaction.wait();
      const data = await qnuContract.getTokens();
      setTransactions(data);
      toast.success('Successfull^^')
    } catch (error) {
      toast.error('Happen a few err!')
    }

  };
  const handleBuySubmit = async (id, number, price) => {
    setBuyAmounts(0);
    if (isNaN(number) || number <= 0) {
      toast.error("Please enter a valid positive number.");
      return;
    }

    try {
      await lorContract.approve(qnuContract.target, number * price);
      const approval = await lorContract.approve(
        qnuContract.target,
        number * price
      );
      await approval.wait();
      const transaction = await qnuContract.buyTransaction(id, number);
      await transaction.wait();
      toast.success("Token purchased successfully!");
      setdata({lorBalance: await lorContract.balanceOf(account), symbol: "LOR"})
      const data = await qnuContract.getTokens();
      setTransactions(data);
    } catch (error) {
      console.error("Error during buy submission:", error);
      if (error.code === "ACTION_REJECTED") {
        toast.error("Transaction was rejected by the user.");
      } else if (error.message.includes("user denied transaction")) {
        toast.error(
          "You declined the transaction. Please accept it to continue."
        );
      } else {
        toast.error(
          `Failed to buy token. Please try again later. ${
            error.message ? `Details: ${error.message}` : ""
          }`
        );
      }
    }
  };

  const fetchTransactions = useCallback(async () => {
    if (!qnuContract) {
      console.error("qnuContract is not available.");
      return;
    }
    try {
      const data = await qnuContract.getTokens();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error(
        `Error retrieving transactions. Please check the connection and try again later. ${
          error.message ? `Details: ${error.message}` : ""
        }`
      );
    }
  }, [qnuContract]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="mt-4">
      <ToastContainer />
      {transactions && transactions.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-2xl font-bold text-center mb-4">
            Danh sách các Token được bán
          </h2>
          <table className="table-auto w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Symbol</th>
                <th className="px-6 py-3">Number token</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction, index) => {
                try {
                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">{transaction?.name}</td>
                      <td className="px-6 py-4">{transaction?.symbol}</td>
                      <td className="px-6 py-4">
                        {Number(transaction?.numberToken?.toString())}
                      </td>
                      <td className="px-6 py-4">
                        {Number(transaction?.price?.toString())}
                      </td>
                      <td className="px-6 py-4">
                        {!buyAmounts ? (
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                            onClick={() => handleBuyClick(index)}
                            disabled={loading}
                          >
                            Buy
                          </button>
                        ) : (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const amount = e.target.elements[0].value;
                              if (amount) {
                                handleBuySubmit(
                                  Number(index),
                                  Number(amount),
                                  Number(transaction.price)
                                );
                              }
                            }}
                          >
                            <input
                              type="number"
                              placeholder="Amount"
                              className="shadow appearance-none border rounded w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <button
                              type="submit"
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                              Ok
                            </button>
                          </form>
                        )}
                        <button
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => handleWithdraw(index)}
                          disabled={loading}
                        >
                          Withdraw
                        </button>
                      </td>
                    </tr>
                  );
                } catch (e) {
                  console.log("Error mapping transaction:", index, e);
                  return (
                    <tr key={index}>
                      <td>Error render data</td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No transaction created yet</p>
      )}
    </div>
  );
};

export default TransactionList;
