import React from "react";
import { useWeb3 } from "../contexts/Web3Context";

const Header = () => {
  const { connectWallet, account, data } = useWeb3();
  console.log('data', data);

  return (
    <header className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">LOR TRADE</h1>
      <div>
        {account ? (
          <span className="mr-4">
            Connected: {account.substring(0, 6)}...
            {account.substring(account.length - 4)}
          </span>
        ) : null}
        <span className="mr-4"> {data.lorBalance}{" "}{data.symbol}</span>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={connectWallet}
        >
          {account ? "Disconnect Wallet" : "Connect Wallet"}
        </button>
      </div>
    </header>
  );
};

export default Header;
