var Hello = artifacts.require("./Hello.sol");
var VoteForBest = artifacts.require("./VoteForBest.sol");

module.exports = function(deployer) {
    deployer.deploy(Hello);
    deployer.deploy(VoteForBest);
};