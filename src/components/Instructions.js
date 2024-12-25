import React from "react";
// import { Link } from "react-router-dom";

const intructions = () => {
  return (
    <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg overflow-auto">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">
        Hướng Dẫn Giao Dịch Trên LOR TRADE
      </h1>

      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">
          Checklist Của LOR TRADE
        </h2>
        <p class="text-gray-600">Smartcontract cần có các hàm:</p>
        <ul class="list-disc list-inside text-gray-600">
          <li>
            <span class="font-semibold">info():</span> Trả về tên (
            <span class="italic">name</span>) và biểu tượng (
            <span class="italic">symbol</span>) của token.
          </li>
          <li>
            <span class="font-semibold">
              transfer(address to, uint256 value):
            </span>{" "}
            Chuyển token từ người gọi sang một địa chỉ khác.
          </li>
          <li>
            <span class="font-semibold">
              approve(address to, uint256 value):
            </span>{" "}
            Phê duyệt một địa chỉ khác sử dụng một số lượng token nhất định.
          </li>
          <li>
            <span class="font-semibold">
              transferFrom(address from, address to, uint256 value):
            </span>{" "}
            Chuyển token từ một địa chỉ khác đã được phê duyệt.
          </li>
        </ul>
        <p class="text-gray-600">
          Các smartcontract này thực hiện trên testnet Holesky.
        </p>
        <a style={{ color: 'blue' }} href="https://ideone.com/H31uwV" target="_blank">Nhấn để xem contract token mẫu</a>
      </div>

      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">
          Lưu Ý Trước Khi Bán Token
        </h2>
        <p class="text-gray-600">
          Địa chỉ của smartcontract của bạn phải được Admin định giá trong{" "}
          <span class="font-semibold">Set Token </span>.
        </p>
        <span>Liên hệ: </span>
        <a style={{ color: 'blue' }} href="https://www.facebook.com/saomabiettentuiduoc" target="_blank">Nguyễn Bá Lâm</a><span>, </span>
        <a style={{ color: 'blue' }} href="https://www.facebook.com/vyxpepe" target="_blank">Lê Ngọc Quý</a><span>, </span>
        <a style={{ color: 'blue' }} href="https://www.facebook.com/dothanhhauqnu" target="_blank">Đỗ Thành Hậu</a>
        <span> để định giá đồng token của bạn.</span>
      </div>

      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">
          Hướng Dẫn Bán Token
        </h2>
        <p class="text-gray-600">Thực hiện các bước sau:</p>
        <ul class="list-disc list-inside text-gray-600">
          <li>
            Vào <span class="font-semibold">Token Trade</span>.
          </li>
          <li>
            Nhập địa chỉ của smartcontract tạo ra token của bạn vào ô{" "}
            <span class="font-semibold">Token Address</span>.
          </li>
          <li>
            Nhập số lượng token muốn bán trên sàn vào ô{" "}
            <span class="font-semibold">Token Amount</span>.
          </li>
        </ul>
        <p class="text-gray-600">
          Sau khi thực hiện thành công, bạn có thể xem thông tin token của mình
          tại <span class="font-semibold">Transactions</span>.
        </p>
      </div>

      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">
          Lưu Ý Trước Khi Mua Token
        </h2>
        <p class="text-gray-600">
          Tài khoản của bạn phải có đồng{" "}
          <span class="font-semibold">LOR</span> (đồng giao dịch chung của
          LOR TRADE).
        </p>
        <p class="text-gray-600">
          Bạn có thể nhận được 50 đồng{" "}
          <span class="font-semibold">LOR</span> miễn phí khi nhấn <span class="font-semibold">Get Token LOR Free</span> ở hàng nút dưới màn hình
        </p>
        <p class="text-gray-600">
          hoặc mỗi ngày có để đào 5 đồng <span class="font-semibold">LOR</span> ở <span class="font-semibold">Faucent Token</span>.
        </p>
      </div>

      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">
          Hướng Dẫn Mua Token
        </h2>
        <p class="text-gray-600">Thực hiện các bước sau:</p>
        <ul class="list-disc list-inside text-gray-600">
          <li>
            Vào <span class="font-semibold">Transactions</span>.
          </li>
          <li>Chọn đồng token muốn mua.</li>
          <li>Nhập số lượng token muốn mua.</li>
        </ul>
        <p class="text-gray-600">
          Sau khi mua thành công, bạn có thể xem lịch sử mua token tại{" "}
          <span class="font-semibold">History</span>.
        </p>
        <p class="h-10 text-center text-lg font-bold text-blue-600 mt-6 animate-pulse">
        Chúc mọi người có những trải nghiệm tốt ^^
      </p>
      </div>
      
    </div>
  );
};

export default intructions;
