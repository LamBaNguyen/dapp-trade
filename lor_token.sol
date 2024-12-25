// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function info() external view returns(string memory x, string memory y);
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
}

contract LQH {
    string public name;
    string public symbol;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowed;

    event Transfer(address indexed from, address indexed to, uint256 value); 
    event Approve(address indexed from, address indexed to, uint256 value);  

    constructor() {
        name = "LqhToken";
        symbol = "LQH";
        totalSupply = 2024;
        balanceOf[msg.sender] = totalSupply; 
    }

    function info() public view returns (string memory x, string memory y) {
        return (name, symbol);
    }

    function transfer(address to, uint256 value) public returns (bool success) {
        require(to != address(0), "Invalid address in lqh");
        require(balanceOf[msg.sender] >= value, "Not enough balance in lqh");

        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address to, uint256 value) public returns (bool success) {
        allowed[msg.sender][to] = value;
        emit Approve(msg.sender, to, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool success) {
        require(to != address(0), "Invalid address in lqh");
        require(balanceOf[from] >= value, "Not enough balance in lqh");
        require(allowed[from][msg.sender] >= value, "Not enough allowed in lqh");

        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowed[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }
}

contract LOR {
    string public name;
    string public symbol;
    uint256 public totalSupply;
    address public owner;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowed;
    mapping(address => bool) received;
    mapping(address => uint256) fau;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approve(address indexed from, address indexed to, uint256 value);

    constructor() {
        name = "LorToken";
        symbol = "LOR";
        totalSupply = 20240000;
        owner = msg.sender;
        balanceOf[owner] = totalSupply;
    }

    function transfer(address to, uint256 value) public returns (bool success) {
        require(to != address(0), "Invalid address in lor");
        require(balanceOf[msg.sender] >= value, "Not enough balance in lor");

        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address to, uint256 value) public returns (bool success) {
        allowed[msg.sender][to] = value;
        emit Approve(msg.sender, to, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool success) {
        require(to != address(0), "Invalid address in lor");
        require(balanceOf[from] >= value, "Not enough balance in lor");
        require(allowed[from][msg.sender] >= value, "Not enough allowed in lor");

        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowed[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }

    function revceiveTokenInit(address to) public returns (bool) {
        require(!received[to], "You received token");
        
        uint256 value = 50; 
        require(balanceOf[owner] >= value, "admin's balance not enough");

        received[to] = true; 
        balanceOf[owner] -= value;
        balanceOf[to] += value;

        emit Transfer(owner, to, value);
        return true;
    }

    function faucent(address to) public returns (bool) {
        uint256 oneday = 3600 * 24;
        uint256 value = 5;
        require(block.timestamp >= fau[to], "You are faucent, wait 24h");
        fau[to] = block.timestamp + oneday;

        require(balanceOf[owner] >= value, "admin's balance not enough");

        balanceOf[owner] -= value;
        balanceOf[to] += value;
        emit Transfer(owner, to, value);
        return true;
    }
}

contract QNU {
    struct Transaction {
        address seller;
        address token;
        uint256 numberToken;
    }

    struct TransactionDetail {
        uint256 id;
        address seller;
        string name;
        string symbol;
        uint256 numberToken;
        uint256 price;
    }

    struct HistoryTransaction {
        address token;
        string name;
        string symbol;
        uint256 numberToken;
    }

    LOR public lor;
    address owner;
    mapping(address => uint256) tokenPrices;
    Transaction[] public transactions;
    mapping(address => HistoryTransaction[]) history;

    event CreateTransaction(uint256 id, address indexed seller, address indexed token, uint256 numToken);
    event BuyTransaction(uint256 id, address indexed seller, address indexed buyer, address indexed token, uint256 numTokenSell, uint256 numTokenBuy, uint256 numTokenRemain);
    event WithDrawTransaction(uint256 id, address indexed user, address indexed token, uint256 numToken);

    constructor(address x) {
        lor = LOR(x);
        owner = msg.sender;
    }

    modifier onlyCreater() {
        require(msg.sender == owner, "No access in qnu");
        _;
    }

    function setToken(address x, uint256 value) public onlyCreater {
        tokenPrices[x] = value;
    }

    function getTokenPrice(address x) public view returns (uint256) {
        require(tokenPrices[x] > 0, "Invalid token in qnu");
        return tokenPrices[x];
    }

    function getTokens() public view returns (TransactionDetail[] memory) {
        TransactionDetail[] memory x = new TransactionDetail[](transactions.length);
        for(uint256 i = 0; i < transactions.length; i++) {
            IERC20 token = IERC20(transactions[i].token);
            x[i].id = i;
            x[i].seller = transactions[i].seller;
            (x[i].name, x[i].symbol) = token.info();
            x[i].numberToken = transactions[i].numberToken;
            x[i].price = tokenPrices[transactions[i].token];
        }
        return x;
    }

    function createTransaction(address x, uint256 number) external {
        require(tokenPrices[x] > 0, "Invalid token in qnu");

        IERC20 token = IERC20(x);

        require(token.balanceOf(msg.sender) >= number, "Not enough balance in qnu");

        require(token.transferFrom(msg.sender, address(this), number), "TransferFrom not success in qnu");

        bool check = false;

        for(uint256 i = 0; i < transactions.length; i++) {
            if(transactions[i].seller == msg.sender && transactions[i].token == x) {
                check = true;
                transactions[i].numberToken += number;
                break;
            }
        }
        
        if(!check)
            transactions.push(Transaction(msg.sender, x, number));

        check = false;

        for(uint256 i = 0; i < history[msg.sender].length; i++) {
            if(history[msg.sender][i].token == x) {
                check = true;
                history[msg.sender][i].numberToken -= number;
                if(history[msg.sender][i].numberToken == 0) {
                    history[msg.sender][i] = history[msg.sender][history[msg.sender].length - 1];
                    history[msg.sender].pop();
                }
                break;
            }
        }

        emit CreateTransaction(transactions.length, msg.sender, x, number);
    }

    function buyTransaction(uint256 id, uint256 number) external {
        require(id < transactions.length, "Invalid trade ID in qnu");
        Transaction memory transaction = transactions[id];

        require(transaction.numberToken >= number, "Can buy less equal number token in qnu");

        uint256 needLor = tokenPrices[transaction.token] * number;

        require(lor.balanceOf(msg.sender) >= needLor, "Not enough lor token in qnu");
        require(lor.allowed(msg.sender, address(this)) >= needLor, "Not enough allowed in qnu");

        transactions[id].numberToken -= number;

        lor.transferFrom(msg.sender, address(this), needLor);

        IERC20 tokenBuy = IERC20(transaction.token);

        tokenBuy.transfer(msg.sender, number);

        lor.transfer(transaction.seller, needLor);

        emit BuyTransaction(id, transaction.seller, msg.sender, transaction.token, number, needLor, transactions[id].numberToken);
        
        bool check = false;

        for(uint256 i = 0; i < history[msg.sender].length; i++) {
            if(history[msg.sender][i].token == transaction.token) {
                history[msg.sender][i].numberToken += number;
                check = true;
                break;
            }
        }
        string memory name;
        string memory symbol;
        (name, symbol) = tokenBuy.info();
        if(!check) {
            history[msg.sender].push(HistoryTransaction(transaction.token, name, symbol, number));
        }

        if (transactions[id].numberToken == 0) {
            transactions[id] = transactions[transactions.length - 1];
            transactions.pop();
        }
    }

    function getHistory(address user) public view returns(HistoryTransaction[] memory) {
        return history[user];
    }

    function withDraw(uint256 id) external {
        require(id < transactions.length, "Invalid id in qnu");
        require(transactions[id].seller == msg.sender, "No access in qnu");
        require(transactions[id].numberToken > 0, "Balance is zero in qnu");

        Transaction memory transaction = transactions[id];

        IERC20 tokenDraw = IERC20(transaction.token);
        
        tokenDraw.transfer(transaction.seller, transaction.numberToken);

        emit WithDrawTransaction(id, msg.sender, transaction.token, transaction.numberToken);
        transactions[id] = transactions[transactions.length - 1];
        transactions.pop();
    }
}