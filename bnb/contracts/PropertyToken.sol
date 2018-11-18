pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract PropertyToken is StandardToken {

  string public constant name = "PropertyToken";
  string public constant symbol = "PPT";
  uint8 public constant decimals = 18;
  uint256 public leftToSell;

  constructor() public {
    totalSupply_ = 100*10**uint256(decimals);
    balances[address(this)] = totalSupply_;
    leftToSell = totalSupply_;
  }

  function() public payable {
    require(leftToSell > msg.value, "Not enough left to sell");
    leftToSell = leftToSell.sub(msg.value);
    require(this.transfer(msg.sender, msg.value), "Could not transfer");
  }
}