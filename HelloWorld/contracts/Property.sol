pragma solidity ^0.4.24;

import "./HelloWorld.sol";

contract Property is HelloWorld {
  address public guest;
  uint propertyFee = 1 ether;

  modifier onlyGuest (){
    require(msg.sender == guest, "Not an invited guest!");
    _;
  }

  function inviteGuest(address _guest) external onlyOwner returns(address) {
    guest = _guest;
    return guest;
  }

  function reserveRoom() external payable onlyGuest returns(bool) {
    if(msg.sender.balance >= propertyFee) {
      owner.transfer(propertyFee);
      return true;
    } else {
      revert("Balance too low");
    }
  }
}