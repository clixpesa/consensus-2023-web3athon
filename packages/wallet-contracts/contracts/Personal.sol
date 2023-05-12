// SPDX-License-Identifier: Apache 2.0
pragma solidity ^0.8.7;

// Importing OpenZeppelin's SafeMath Implementation
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './utils.sol';
import 'hardhat/console.sol';



contract personal  { 
  
 using SafeMath for uint256; 

using Counters for Counters.Counter;
Counters.Counter private _id;

struct MySaving {
    address owner;
    uint id;
    string name;
    IERC20 token;
    uint256 goalAmount;
    uint256 deadline;
    uint256 balance;
    bool exist;
    bool goalReached;
    CheckStatus Status; 
}

    enum CheckStatus {
        CREATED,
        COMPLETED,
        WITHDRAW
    }
    

mapping(uint256 => MySaving) savings;
event CreateNewSavings(address owner, uint256 amt, uint indexed _id);
event Deposit(address depositor, uint256 amount);

function createSavings(string memory _name, uint256 _targetAmount, uint256 _deadline, address _token) external {
    require(bytes(_name).length > 0, "name of saving cannot be empty");
    require(_targetAmount > 0, 'amount must be greater than zero');
    require(_deadline > 0, "Invalid date");

    _id.increment();
    uint256 Id = _id.current();
    MySaving memory newSaving;
    newSaving.owner = msg.sender;
    newSaving.id = Id;
    newSaving.name = _name;
    newSaving.token = IERC20(_token);
    newSaving.goalAmount = _targetAmount;
    newSaving.exist = true;
    newSaving.deadline =block.timestamp + _deadline;
    newSaving.Status = CheckStatus.CREATED;

    // map the newsaving to savings;
    savings[Id] = newSaving;

    
    emit CreateNewSavings(msg.sender, _targetAmount, Id);
}

// Function to receive Ether. msg.data must be empty
receive() external payable {}

function depositNew(uint256 id, uint256 _amount) authorise(id) external {
    require(savings[id].Status == CheckStatus.CREATED, "Goal reached");
    require(_amount > 0, "Deposit amount must be greater than zero");
    require(savings[id].token.balanceOf(msg.sender) >= _amount, "Insufficient Funds");
    require(savings[id].token.transferFrom(msg.sender, address(this), _amount), "Failed to deposit");

    savings[id].balance = savings[id].balance.add(_amount);
    if(savings[id].balance == savings[id].goalAmount ){
        savings[id].Status = CheckStatus.COMPLETED;
    }
    emit Deposit(msg.sender, _amount);
}


// function checkAllownce(uint id) external view returns(uint){
//    return savings[id].token.allowance(msg.sender, address(this));
// }
modifier authorise(uint256 id){
    require(savings[id].owner == msg.sender, "Savings does not exist or not authorized");
    _;
}


// function approve(uint256 id, uint256 _amount ) external authorise(id) {]
//         savings[id].token.approve(address(this), _amount);
//         savings[id].token.allowance(msg.sender, address(this)) ;

// }

function withdraw(uint256 id) public authorise(id) returns(bool){
    require(savings[id].Status == CheckStatus.COMPLETED, "Savings not yet completed");
    require(savings[id].token.balanceOf(msg.sender) > 0, "Insufficient Funds");
    require(savings[id].token.transfer(msg.sender, savings[id].balance), "Payment failed");

    savings[id].Status == CheckStatus.WITHDRAW;
    savings[id].goalReached = true;
    savings[id].balance = 0;
    return true;
}

// get all savings
function getSavings(uint256 id) external view returns(MySaving memory) {
    return savings[id];
}
function balance(uint id)public view returns (uint){
  return savings[id].token.balanceOf(msg.sender);
}

}