pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract Property is ERC721Token {
  address public guest;
  uint propertyFee = 1 ether;

  constructor (string _name, string _symbol) public ERC721Token(_name, _symbol) {

  }

  modifier onlyOwner(uint256 _tokenId) {
    require(tokenOwner[_tokenId] == msg.sender, "Only the asset's owner can perform this operation");
    _;
  }

  modifier onlyGuest (){
    require(msg.sender == guest, "Not an invited guest!");
    _;
  }
  
  function createProperty() external {
    _mint(msg.sender, allTokens.length + 1);
  }

  function setURI(uint256 _tokenId, string _uri) external onlyOwner(_tokenId) {
    _setTokenURI(_tokenId, _uri);
  }

  function getURI(uint256 _tokenId) external view returns(string) {
    return tokenURIs[_tokenId];
  }

  function getAllTokens() external view returns(uint256[]) {
    return allTokens;
  }

  function getAllOwnedTokens(address owner) external view returns(uint256[]) {
    return ownedTokens[owner];
  }
}