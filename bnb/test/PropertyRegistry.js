
//jshint ignore: start

const Property = artifacts.require("./Property.sol");
const PropertyRegistry = artifacts.require("./PropertyRegistry.sol");
const PropertyToken = artifacts.require("./PropertyToken.sol");

const ether = 10**18;

const now = Date.now() / 1000
const zeroAddress = '0x0000000000000000000000000000000000000000'

contract('Property Contract Tests', accounts => {
  bob = accounts[0];
  alice = accounts[1];

  it('should be deployed, Property', async () => {
    property = await Property.deployed()
    assert(property !== undefined, 'Property could not be deployed')
  });

  it('should be able to create a property, Property', async () => {
    try{
      const tx = await property.createProperty();
      assert(true, 'Couldn\'t create property')
    } catch(e) {
      assert(false, 'Couldn\'t create property')
    }
  });

  it('bob should be able to call setURI, Property', async () => {
    try{
      const tx = await property.setURI(1, 'test');

    } catch(e) {
      assert(false, 'Couldn\'t set uri')
    }
    const uri = await property.getURI(1)
    assert(uri === 'test', 'Couldn\'t set uri')
  });

  it('alice should not be able to call setURI, Property', async () => {
    try{
      const tx = await property.setURI(1, 'test2', { from: alice });
      assert(false, 'Could set uri')
    } catch(e) {
      assert(true, 'Couldn\'t set uri')
    }
  });
});

contract('PropertyToken Contract Tests', () => {
  it('should be deployed, PropertyToken', async () => {
    propertyToken = await PropertyToken.deployed()
    assert(propertyToken !== undefined, 'PropertyToken could not be deployed')
  });
});

contract('PropertyRegistry Contract Tests', () => {

  it('should be deployed, PropertyRegistry', async () => {
    propertyRegistry = await PropertyRegistry.deployed()
    assert(propertyRegistry !== undefined, 'PropertyRegistry could not be deployed')
  });

  const allocation = 100000;
  it('should allow bob to mint Property Token for alice', async () => {
    const tx = await propertyToken.mint(alice, allocation);
    const balance = await propertyToken.balanceOf.call(alice);
    assert.equal(balance.toNumber(), allocation, 'balance');
  });

  const price = 100000;
  it('should allow alice to approve the property registry to use her tokens', async () => {
    try {
      const tx = await propertyToken.approve(propertyRegistry.address, price, { from: alice });
      assert(tx, 'Property registry has been approved');
    } catch (e) {
      assert(false, 'Property registry has not been approved')
    }
  });

  it('should allow alice to approve herself to use her tokens', async () => {
		try {
			const tx = await propertyToken.approve(alice, allocation, { from: alice });
		} catch(e){
			assert(false, `Bob could not approve herself to use her tokens ${e}`)
		}
		assert(true, 'property registry has been approved');
	});

  it('should be able to register a property, PropertyRegistry', async () => {
    await property.createProperty()
    await propertyRegistry.registerProperty(1, price, 'https://test1');
    assert(propertyRegistry.getPropertyDetails(1), 'PropertyRegistry received registration for a new property')
  });

  it('should take a request from Alice to stay', async () => {
    await propertyRegistry.requestStay(1, now - 1000000000, now + 1000000000, { from: alice })
    const propertyDetails = await propertyRegistry.getDetailedPropertyDetails(1)
    assert(propertyDetails[0] === alice, 'PropertyRegistry registered a request from Alice')
  });

  it('It should not allow Alice to Check-In before Bob has approved the request', async () => {
		try{
			const tx = await propertyRegistry.checkIn(1, {from: alice})
		} catch(e) {
			assert(true, 'Alice could not check in before being approved')
			return
		}
		assert(false, 'Alice could check in before being approved')
  });
  
  it('It should allow Bob to approve Alice\'s request to stay', async () => {
		try{
			const tx = await propertyRegistry.approveRequest(1)
		} catch(e) {
			assert(true, 'Bob could not approve Alice\'s request')
		}
		let propertyDetails = await propertyRegistry.getDetailedPropertyDetails(1)
		assert(propertyDetails[1] === alice, 'Alice should be approved')
  })
  
  it('It should allow Alice to check-in after she has been approved', async () => {
		try{
      let propertyDetails = await propertyRegistry.getDetailedPropertyDetails(1)
      console.log(propertyDetails[3], now)
      const tx = await propertyRegistry.checkIn(1, {from: alice})
		} catch(e) {
			console.log(e)
			assert(false, 'Alice could not check in')
		}
    let propertyDetails = await propertyRegistry.getDetailedPropertyDetails(1)
    console.log(propertyDetails.checkIn, now)
		assert(propertyDetails[2] === alice, 'Alice check in transaction occurred, wrong result')
  })
  
  it('Bob, propertyRegistry, and Alice should all have the correct balance', async () => {
		const bobBalance = await propertyToken.balanceOf.call(bob);
		const registryBalance = await propertyToken.balanceOf.call(propertyRegistry.address);
		const aliceBalance = await propertyToken.balanceOf.call(alice);
    console.log(bobBalance)
    console.log(registryBalance)
    console.log(aliceBalance)
		assert(bobBalance.toNumber() === (allocation - price) , 'Bob does not have correct balance');
		assert(registryBalance.toNumber() === price , 'registry does not have correct balance');
		assert(aliceBalance.toNumber() === 0 , 'Alice does not have correct balance');
  })
  
  it('It should allow Alice to check out after she has checked in', async () => {
		try{	
			const tx = await propertyRegistry.checkOut(1, {from: alice})
		} catch(e) {
			assert(false, 'Alice could not check out even though she was approved')
		}
		let propertyDetails = await propertyRegistry.getDetailedPropertyDetails(1)
		assert(propertyDetails[0] === zeroAddress, 'Alice could check out')
	})

});