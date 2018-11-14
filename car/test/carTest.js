const chai = require('chai') // 1
const assert = chai.assert

const shouldBuyCar = require('../shouldBuyCar.js') // 2

describe("#shouldBuyCar()", () => { // 3
  it("should throw an error if there is no car", () => { // 4
    assert.throws(shouldBuyCar, Error, 'No Car!')
  })

  it("should return false if there are no details of the car", () => { // 4
    const car = {}
    assert.isFalse(shouldBuyCar(car))
  })

  it("should return false if it's a hatchback", () => { // 4
    const car = {
      type: "hatchback"
    }
    assert.isFalse(shouldBuyCar(car))
  })

  it('should return true if it is pink', () => {
    const car = {
      color: 'pink'
    }
    assert.isTrue(shouldBuyCar(car))
  })

  it('should return false if it is pink and hatchback', () => {
    const car = {
      color: 'pink',
      type: 'hatchback',
    }
    assert.isFalse(shouldBuyCar(car))
  })

  it('should return true when the car has 6 litres/100km and is under or equal to $5,000', () => {
    const car1 = {
      litresPer100km: 6,
      price: 5000,
    }
    const car2 = {
      litresPer100km: 8,
      price: 4000,
    }
    assert.isTrue(shouldBuyCar(car1))
    assert.isTrue(shouldBuyCar(car2))
  })

  it('should return true when the car has 11 litres/100km and is under or equal to $5,000', () => {
    const car1 = {
      litresPer100km: 11,
      price: 5000,
    }
    const car2 = {
      litresPer100km: 8,
      price: 4000,
    }
    assert.isTrue(shouldBuyCar(car1))
    assert.isTrue(shouldBuyCar(car2))
  })

  it('should return false when the car has 6 litres/100km and is over $5,000', () => {
    const car1 = {
      litresPer100km: 6,
      price: 6000,
    }
    const car2 = {
      litresPer100km: 8,
      price: 7000,
    }
    assert.isFalse(shouldBuyCar(car1))
    assert.isFalse(shouldBuyCar(car2))
  })

  it('should return false when the car has 11 litres/100km and is over $5,000', () => {
    const car = {
      litresPer100km: 11,
      price: 6000,
    }
    assert.isFalse(shouldBuyCar(car))
  })

  it('should return false when the car has 5 litres/100km and is under or equal to $5,000', () => {
    const car = {
      litresPer100km: 5,
      price: 4000,
    }
    assert.isFalse(shouldBuyCar(car))
  })

  it('should return false when the car has 12 litres/100km and is under or equal to $5,000', () => {
    const car = {
      litresPer100km: 12,
      price: 4000,
    }
    assert.isFalse(shouldBuyCar(car))
  })
})