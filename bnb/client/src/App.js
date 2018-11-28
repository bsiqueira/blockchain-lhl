import React, { Component } from "react"
import Property from "./contracts/Property.json"
import PropertyToken from "./contracts/PropertyToken.json"
import PropertyRegistry from "./contracts/PropertyRegistry.json"
import getWeb3 from "./utils/getWeb3"
import truffleContract from "truffle-contract"
import styled from 'styled-components'

import "./App.css"

const Button = styled.button`
  width: 150px;
  margin: 10px;
  padding: 10px;
  border-radius: 8px;
  outline: none;
  border: none;
  background-color: darkgreen;
  color: white;
`
const Section = styled.div`
  margin: 20px 0;
`

const Row = styled.div`
  display: flex;
  width: 100%;
`

const Header = styled.h3`

`

const PropertyColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
`

const getContract = (json, web3) => {
  const contract = truffleContract(json);
  contract.setProvider(web3.currentProvider);
  return contract.deployed();
}

const mapBigNumberArr = arr => arr.map(number => number.toNumber())
const emptyAddress = '0x0000000000000000000000000000000000000000'
const isEmptyAddress = address => address === emptyAddress

class App extends Component {
  state = { 
    web3: null,
    account: null,
    contracts: {
      propertyInstance: null
    },
    allOwnedTokens: [],
    allTokens: [],
    registeringInput: {
      uriValue: '',
      registeringPrice: '',
      registeringToken: '',
    },
    registeredProperties: [],
    yourProperties: [],
  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3()
      const [ account ] = await web3.eth.getAccounts()
      const propertyInstance = await getContract(Property, web3)
      console.log(propertyInstance)
      const event = propertyInstance.allEvents({ fromBlock: 0, toBlock: 'latest' });
      event.on('data', (res) => console.log(res))
      event.on('changed', (res) => console.log(res))
      event.on('error', (error) => console.log(error))
      const propertyTokenInstance = await getContract(PropertyToken, web3)
      const propertyRegistryInstance = await getContract(PropertyRegistry, web3)
      this.setState({ web3, account, contracts: { propertyInstance, propertyTokenInstance, propertyRegistryInstance } })
      this.fetchTokensCreated()
      await this.fetchAllTokens()
      this.fetchOwnProperties()
      this.fetchRegisteredProperties()
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      )
      console.log(error)
    }
  }

  fetchRegisteredProperties = async () => {
    const { contracts: { propertyRegistryInstance }, account, allTokens} = this.state
    const registeredProperties = await Promise.all(allTokens.map(async token => {
      const property = await propertyRegistryInstance.getPropertyDetails(token, { from: account })
      return { tokenId: token, price: property[0].toNumber(), uri: property[1] }
    }))
    this.setState({
      registeredProperties: registeredProperties.filter(property => property.tokenId && property.price),
    })
  }
  fetchOwnProperties = async () => {
    const { contracts: { propertyRegistryInstance }, account, allOwnedTokens} = this.state
    const yourPropertiesCall = await Promise.all(allOwnedTokens.map(async token => {
      const property = await propertyRegistryInstance.getDetailedPropertyDetails(token, { from: account })
      return { tokenId: token, requested: property[0], approved: property[1], occupant: property[2], checkIn: property[3].toNumber(), checkOut: property[4].toNumber() }
    }))
    this.setState({ 
      yourProperties: yourPropertiesCall.filter(property => 
        (property.requested && !isEmptyAddress(property.requested)) || 
        (property.approved && !isEmptyAddress(property.approved)) || 
        (property.occupied && !isEmptyAddress(property.occupied))
      )
    })
  }

  //hack
  // autoAllocateCoins = async () => {
  //   const { contracts: { propertyTokenInstance }, account} = this.state
  //   await
  // }

  createProperty = async () => {
    const { contracts: { propertyInstance }, account} = this.state
    try {
      const tx = await propertyInstance.createProperty({ from: account })
      console.log(tx)
      console.log('Property Created!')
      this.fetchTokensCreated()
    } catch (e) {
      console.log(e)
      alert('Error creating property.')
    }
  }

  setURI = async () => {
    const { contracts: { propertyInstance }, account, registeringInput: { uriValue, registeringToken }} = this.state
    try {
      const tx = await propertyInstance.setURI(+registeringToken, uriValue, { from: account })
      console.log(tx)
      console.log('URI set.')
      this.setState({ registeringInput: { registeringToken: '', uriValue: '', price: ''}})
    } catch (e) {
      console.log(e)
      alert('Error setting URI')
    }
  }

  registerProperty = async () => {
    const { contracts: { propertyRegistryInstance }, account, registeringInput: { uriValue, registeringToken, registeringPrice }} = this.state
    try {
      const tx = await propertyRegistryInstance.registerProperty(+registeringToken, +registeringPrice, uriValue, { from: account, gas: 6712388, gasPrice: 1000000 })
      console.log(tx)
      console.log('Property registered.')
      this.setState({ 
        registeringInput: { registeringToken: '', uriValue: '', price: ''}, 
        allTokens: [...this.state.allTokens, +registeringToken],
        registeredProperties: [...this.state.registeredProperties, { tokenId: +registeringToken, price: +registeringPrice, uri: uriValue }]
      })
    } catch (e) {
      console.log(e)
      alert('Error registering property')
    }
  }

  fetchTokensCreated = async () => {
    const { contracts: { propertyInstance }, account} = this.state
    const allOwnedTokens = await propertyInstance.getAllOwnedTokens(account)
    this.setState({ allOwnedTokens: mapBigNumberArr(allOwnedTokens) })   
  }

  fetchAllTokens = async () => {
    const { contracts: { propertyInstance }, account} = this.state
    const allTokens = await propertyInstance.getAllTokens({ from: account })
    this.setState({ allTokens: mapBigNumberArr(allTokens) })
  }

  requestBooking = (token) => async () => {
    const { contracts: { propertyRegistryInstance }, account } = this.state
    try {
      const tx = await propertyRegistryInstance.requestStay(token, Date.now(), Date.now() + 86400000, { from: account })
      alert('Requested booking')
      console.log(tx)
      this.fetchRegisteredProperties()
    } catch (e) {
      console.log(e)
      alert('Error requesting booking')
    }
  }

  approveRequest = (token) => async () => {
    const { contracts: { propertyRegistryInstance }, account, yourProperties } = this.state
    try {
      const tx = await propertyRegistryInstance.approveRequest(token, { from: account })
      alert('Approved request')
      console.log(tx)
      this.setState({ yourProperties: yourProperties.map(property => {
        if (token === property.tokenId) {
          return { ...property, requested: emptyAddress, approved: property.requested }
        }
        return property
      })})
    } catch (e) {
      console.log(e)
      alert('Error approving booking')
    }
  }

  //tbd
  checkIn = (token) => async () => {

  }

  handleChangeRegisteringInput = (property) => (e) => this.setState({registeringInput: {...this.state.registeringInput, [property]: e.target.value}})

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contracts...</div>
    }

    console.log(this.state)

    const { 
      account,
      allOwnedTokens,
      registeringInput: { 
        uriValue,
        registeringToken,
        registeringPrice 
      },
      registeredProperties,
      yourProperties
    } = this.state
    return (
      <div className="App">
        <div>Current account: {account}</div>
        <Button onClick={this.createProperty}>Create Property</Button>
        {allOwnedTokens.length > 0 &&
          <div>
            <Section>
              <Header>Property Tokens Owned:</Header>
              <Row>
              {allOwnedTokens.join(', ')}
              </Row>
            </Section>
            <Section>
              <Header>Register Property</Header>
              <div>
                <span>Property Token</span><input value={registeringToken} onChange={this.handleChangeRegisteringInput('registeringToken')} />&nbsp;
                <span>URI</span><input value={uriValue} onChange={this.handleChangeRegisteringInput('uriValue')} />&nbsp;
                <span>Price</span><input value={registeringPrice} onChange={this.handleChangeRegisteringInput('registeringPrice')} />&nbsp;
                <Button onClick={this.registerProperty}>Register</Button>
              </div>
            </Section>
          </div>
        }
        {registeredProperties.length > 0 &&
          <Section>
            <Header>Registered Properties</Header>
            <Row>
              {registeredProperties.map((property, index) => 
                <PropertyColumn key={index}>
                  <img width={200} height={200} src={property.uri || 'https://vignette.wikia.nocookie.net/assassinscreed/images/3/39/Not-found.jpg/revision/latest?cb=20110517171552'} alt='' />
                  <div>Property #{property.tokenId}</div>
                  <div>$PRP {property.price}</div>
                  <Button onClick={this.requestBooking(property.tokenId)}>Request Booking</Button>
                  <Button onClick={this.checkIn(property.tokenId)}>Try CheckIn</Button>
                </PropertyColumn>
              )}
            </Row>
          </Section>
        }
        {yourProperties.length > 0 && 
          <Section>
            <Header>Your Active Properties</Header>
            <Row>
              {yourProperties.map((property, index) => 
                <PropertyColumn key={index}>
                  <div>Property #{property.tokenId}</div>
                  <div>
                    {!isEmptyAddress(property.requested) ? `Requested: ${property.requested}`: !isEmptyAddress(property.approved)
                    ? `Approved: ${property.approved}` : `Occupant: ${property.occupant}`}
                  </div>
                  <div>Check In: {new Date(property.checkIn).toLocaleString()}</div>
                  <div>Check Out: {new Date(property.checkOut).toLocaleString()}</div>
                  { !isEmptyAddress(property.requested) && 
                    <Button onClick={this.approveRequest(property.tokenId, index)} >Approve</Button>
                  }
                </PropertyColumn>
              )}
            </Row>
          </Section>
        }
      </div>
    )
  }
}

export default App
