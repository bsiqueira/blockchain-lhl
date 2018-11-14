//jshint ignore: start

// contracts
const Property = artifacts.require("./Property.sol");

/**************************************
* Tests
**************************************/

contract('Property Contract Tests', function(accounts) {

  let property;
  const message = 'hello world!'
  const alice = accounts[0], bob = accounts[1], john = accounts[2];

  it('should be deployed, Property', async () => {
    property = await Property.deployed();
    assert(property !== undefined, 'Property was NOT deployed');
  });

  it('should NOT let Bob say "' + message + '"', async () => {
    try {
      const tx = await property.hello(message, { from: bob }); //say message value from Bob
    } catch(e) {
      assert(true, 'Bob was not allowed to say "hello"');
      return
    }
    assert(false, 'Bob should not be able to say Hello, but he could'); 
  });

  it('should assign Bob as guest', async () => {
    await property.inviteGuest(bob)
    guest = await property.guest()
    assert(guest === bob, 'Bob is the guest')
  })

  it('should not allow John to reserve the property', async () => {
    try{
      const tx = await property.reserveRoom({ from: john })
    } catch(e) {
      assert(true, 'John was not allowed to reserve the property')
    }
    assert(false, 'John should not be able to reserve the property, but he could')
  })

  // it('should allow Bob to reserve the property', async () => {
  //   const tx = await property.reserveRoom({ from: bob })
  // })

});