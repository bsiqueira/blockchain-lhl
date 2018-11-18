pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract PropertyRegistry {
  
  ERC721 propertyContract;
  ERC20 propertyToken;

  struct Data {
    uint256 price;
    address requested;
    address approved;
    address occupant;
    uint256 checkIn;
    uint256 checkOut;
    uint256 stays;
    string uri;
  }

  mapping(uint256 => Data) public propertyDetails;

  modifier onlyOwner(uint256 _tokenId) {
    require(propertyContract.ownerOf(_tokenId) == msg.sender, "Only the asset's owner can perform this operation");
    _;
  }

  modifier notRequested(uint256 _tokenId) {
    require(propertyDetails[_tokenId].requested == address(0), "Property already requested");
    _;
  }

  constructor(address _propertyContract) public {
    propertyContract = ERC721(_propertyContract);
  }

  function getPropertyDetails(uint256 _tokenId) public view returns(uint256, address, string) {
    return (propertyDetails[_tokenId].price, propertyDetails[_tokenId].occupant, propertyDetails[_tokenId].uri);
  }

  function registerProperty(uint256 _tokenId, uint256 _price, string _uri) public onlyOwner(_tokenId) {
    propertyDetails[_tokenId] = Data(_price, address(0), address(0), address(0), 0, 0, 0, _uri); 
  }

  function requestStay(uint256 _tokenId, uint256 _checkIn, uint256 _checkOut) public notRequested(_tokenId) {
    propertyDetails[_tokenId].requested = msg.sender;
    propertyDetails[_tokenId].checkIn = _checkIn;
    propertyDetails[_tokenId].checkOut = _checkOut;
  }

  function approveRequest(uint256 _tokenId) public onlyOwner(_tokenId) {
    propertyDetails[_tokenId].approved = propertyDetails[_tokenId].requested;
  }

  function checkIn(uint256 _tokenId) public {
    require(propertyDetails[_tokenId].approved == msg.sender, "You're not approved");
    require(now > propertyDetails[_tokenId].checkIn, "Not within check in time");
    propertyDetails[_tokenId].occupant = msg.sender;
  }

  function checkOut(uint256 _tokenId) public {
    require(propertyDetails[_tokenId].occupant == msg.sender, "You're not the occupant");
    propertyDetails[_tokenId].requested = address(0);
    propertyDetails[_tokenId].stays++;
  }
}
