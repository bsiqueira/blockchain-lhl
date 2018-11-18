
//jshint ignore: start

const Property = artifacts.require("./Property.sol");
const PropertyRegistry = artifacts.require("./PropertyRegistry.sol");
const PropertyToken = artifacts.require("./PropertyToken.sol");

contract('Property Contract Tests', () => {
  it('should be deployed, Property', async () => {
    property = await Property.deployed()
    assert(property !== undefined, 'Property could not be deployed')
  });
});

contract('PropertyToken Contract Tests', () => {
  it('should be deployed, PropertyToken', async () => {
    propertyToken = await PropertyToken.deployed()
    assert(propertyToken !== undefined, 'PropertyToken could not be deployed')
  });
});

contract('PropertyRegistry Contract Tests', accounts => {

  bob = accounts[0];
  alice = accounts[1];

  it('should be able to create a property, Property', async () => {
    try{
      const tx = await property.createProperty();
    } catch(e) {
      assert(false, 'Couldn\'t create property')
    }
    assert(true, 'Couldn\'t create property')
  });

  it('should be deployed, PropertyRegistry', async () => {
    propertyRegistry = await PropertyRegistry.deployed()
    assert(propertyRegistry !== undefined, 'PropertyRegistry could not be deployed')
  });

  it('should be able to register a property, PropertyRegistry', async () => {
   propertyRegistry = await PropertyRegistry.deployed()
   await propertyRegistry.registerProperty(5, 100000, 'https://test1', { from: bob });
   assert(propertyRegistry.propertyDetails.length == 1, 'PropertyRegistry received registration for a new property')
  });

  // it('should take a request from Bob, PropertyRegistry', async () => {
  //   await propertyRegistry.registerProperty(1, 100000, 'https://');
  //   await propertyRegistry.requestStay(property.address, { from: bob });
  //   assert(propertyRegistry.propertyDetails[1].requested, 'PropertyRegistry took a request from Bob')
  // });
});