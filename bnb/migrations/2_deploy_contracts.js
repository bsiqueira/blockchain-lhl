const Property = artifacts.require("./Property.sol");
const PropertyToken = artifacts.require("./PropertyToken.sol");
const PropertyRegistry = artifacts.require("./PropertyRegistry.sol");

module.exports = function(deployer) {
    deployer.deploy(Property, 'Property', 'PRP').then(
        () => deployer.deploy(PropertyToken, 'PropertyToken', 'PRT', 0).then(
            () => deployer.deploy(PropertyRegistry, Property.address, PropertyToken.address)
        )
    )
};