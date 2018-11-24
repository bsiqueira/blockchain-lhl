pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";
import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";

contract PropertyToken is DetailedERC20, MintableToken {

  uint256 public leftToSell;

  constructor(string _name, string _symbol, uint8 _decimals) public DetailedERC20(_name, _symbol, _decimals) {
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