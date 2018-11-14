var BSToken = artifacts.require("./BSToken.sol");

module.exports = function(deployer) {
  deployer.deploy(BSToken);
};