import { ethers } from "ethers";

(async () => {
  try {
    // Kết nối đến mạng Ethereum (Holesky)
    const provider = new ethers.providers.JsonRpcProvider("https://rpc.holesky.eth.dev");

    // Lấy ABI từ Etherscan
    const response = await fetch(
      "https://api-holesky.etherscan.io/api?module=contract&action=getabi&address=0xa6327CcF6f7652E570e376f471728Bb1995132a8&apikey=WBDX7BK8X7RU76J36IICU1WQFBCEHI6355"
    );
    const data = await response.json();

    if (data.status !== "1" || !data.result) {
      console.error("Failed to fetch ABI:", data.message);
      return;
    }

    const contractABI = JSON.parse(data.result);

    // Tạo instance của contract
    const contractAddress = "0xa6327CcF6f7652E570e376f471728Bb1995132a8";
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    // Gọi hàm memberId
    const memberIdResult = await contract.memberId("0xfe8ad7dd2f564a877cc23feea6c0a9cc2e783715");
    console.log("Result1 (memberId):", memberIdResult);

    // Gọi hàm members
    const membersResult = await contract.members(1);
    console.log("Result2 (members):", membersResult);
  } catch (error) {
    console.error("Error:", error);
  }
})();
