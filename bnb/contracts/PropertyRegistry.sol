pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol";
import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract PropertyRegistry {
  
  ERC721Basic propertyContract;
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

  event Registered(uint256 indexed _tokenId); 
  event Approved(uint256 indexed _tokenId); 
  event Requested(uint256 indexed _tokenId); 
  event CheckIn(uint256 indexed _tokenId); 
  event CheckOut(uint256 indexed _tokenId); 

  constructor(address _propertyContract, address _propertyToken) public {
    propertyContract = ERC721Basic(_propertyContract);
    propertyToken = ERC20(_propertyToken);
  }

  function getPropertyDetails(uint256 _tokenId) public view returns(uint256, string) {
    return (propertyDetails[_tokenId].price, propertyDetails[_tokenId].uri);
  }

  function getDetailedPropertyDetails(uint256 _tokenId) public view onlyOwner(_tokenId) returns(address, address, address, uint256, uint256) {
    return (propertyDetails[_tokenId].requested, propertyDetails[_tokenId].approved,
    propertyDetails[_tokenId].occupant, propertyDetails[_tokenId].checkIn, propertyDetails[_tokenId].checkOut);
  }

  function getProperties() external view returns(uint256[]) {
    return ownedTokens[msg.sender];
  }

  function registerProperty(uint256 _tokenId, uint256 _price, string _uri) public onlyOwner(_tokenId) {
    propertyDetails[_tokenId] = Data(_price, address(0), address(0), address(0), 0, 0, 0, _uri);
    emit Registered(_tokenId); 
  }

  function requestStay(uint256 _tokenId, uint256 _checkIn, uint256 _checkOut) public notRequested(_tokenId) {
    propertyDetails[_tokenId].requested = msg.sender;
    propertyDetails[_tokenId].checkIn = _checkIn;
    propertyDetails[_tokenId].checkOut = _checkOut;
    emit Requested(_tokenId);
  }

  function approveRequest(uint256 _tokenId) public onlyOwner(_tokenId) {
    propertyDetails[_tokenId].approved = propertyDetails[_tokenId].requested;
    emit Approved(_tokenId);
  }

  function checkIn(uint256 _tokenId) public {
    require(propertyDetails[_tokenId].approved == msg.sender, "You're not approved");
    require(now > propertyDetails[_tokenId].checkIn, "Not within check in time");
    require(propertyToken.transferFrom(msg.sender, address(this), propertyDetails[_tokenId].price), "Could not pay fee.");
    propertyDetails[_tokenId].occupant = msg.sender;
    emit CheckIn(_tokenId);
  }

  function checkOut(uint256 _tokenId) public {
    require(propertyDetails[_tokenId].occupant == msg.sender, "You're not the occupant");
    propertyDetails[_tokenId].requested = address(0);
    require(propertyToken.transfer(propertyContract.ownerOf(_tokenId), propertyDetails[_tokenId].price), "Could not receive fee");
    propertyDetails[_tokenId].stays++;
    emit CheckOut(_tokenId);
  }
}
