const chai = require('chai')
const assert = chai.assert

const NameFormatter = require('../nameFormatter')

describe('invert name', () => {
  it('should return an empty string when passed an empty string', () => {
    const nameFormatter = new NameFormatter()
    const inputName = ""
    const expectedOutput = ""
    assert.equal(nameFormatter.invertName(inputName), expectedOutput)
  })

  it('should return a single name when passed a single name', () => {
    const nameFormatter = new NameFormatter()
    const inputName = "name"
    const expectedOutput = "name"
    assert.equal(nameFormatter.invertName(inputName), expectedOutput)
  })

  it('should return a single name when passed a single name with extra spaces', () => {
    const nameFormatter = new NameFormatter()
    const inputName = " name "
    const expectedOutput = "name"
    assert.equal(nameFormatter.invertName(inputName), expectedOutput)
  })

  it('should return a lastName, firstName when passed a first and last name', () => {
    const nameFormatter = new NameFormatter()
    const inputName = "first last"
    const expectedOutput = "last, first"
    assert.equal(nameFormatter.invertName(inputName), expectedOutput)
  })

  it('should return a last-name, first-name when passed a first and last-name with extra spaces around the names', () => {
    const nameFormatter = new NameFormatter()
    const inputName = " first last"
    const expectedOutput = "last, first"
    assert.equal(nameFormatter.invertName(inputName), expectedOutput)
  })

  it('should return an empty string when passed a single honorific', () => {
    const nameFormatter = new NameFormatter()
    const inputName = "Dr. "
    const expectedOutput = ""
    assert.equal(nameFormatter.invertName(inputName), expectedOutput)
  })

  it('should return honorific first-name when passed honorific first-name', () => {
    const nameFormatter = new NameFormatter()
    const inputName = "Dr. first"
    const expectedOutput = "Dr. first"
    assert.equal(nameFormatter.invertName(inputName), expectedOutput)
  })

  it('should honorific last-name, first-name when passed honorific first-name last-name', () => {
    const nameFormatter = new NameFormatter()
    const inputName = "Dr. first-name last-name"
    const expectedOutput = "Dr. last-name, first-name"
    assert.equal(nameFormatter.invertName(inputName), expectedOutput)
  })

  it('honorific last-name, first-name when passed honorific first-name last-name', () => {
    const nameFormatter = new NameFormatter()
    const inputName = " Dr. first-name last-name "
    const expectedOutput = "Dr. last-name, first-name"
    assert.equal(nameFormatter.invertName(inputName), expectedOutput)
  })

  it('should throw an error when name is undefined', () => {
    const nameFormatter = new NameFormatter()
    assert.throws(nameFormatter.invertName, Error, 'No name provided.')
  })
})