<template>
  <div id="app">
    <h1>{{pokes}} Pokes</h1>
    <button @click="read">Read</button>
    <button @click="poke">Poke</button>
    <div>{{poking ? 'poking...' : ''}}</div>
  </div>
</template>

<script>
import Web3 from 'Web3'

const pokeArtifacts = require('../../build/contracts/Sample.json')

if (global.ethereum) {
  global.web3 = new Web3(global.ethereum)
} else if (global.web3) {
  global.web3 = new Web3(global.web3.currentProvider)
}

import { patchProvider } from './assets/patchProvider';
patchProvider(global.web3);

export default {
  name: 'App',
  data() {
    return {
      poking: false,
      pokes: 0,
      acount: null
    }
  },
  async mounted () {
    if (global.ethereum) {
      await global.ethereum.enable()
    }
    let accounts = await global.web3.eth.getAccounts()
    if (accounts.length) {
      this.account = accounts[0]
    }
    global.contract = await new global.web3.eth.Contract(
      pokeArtifacts.abi,
      pokeArtifacts.networks[4].address
    )
    await this.read()
  },
  methods: {
    async poke () {
      this.poking = true
      try {
        var tx = await global.contract.methods.poke.send({
          from: this.account
        })
        this.poking = false
        await this.read()
      } catch(error) {
        this.poking = false
      }
    },
    read () {
      global.contract.methods.getPokes.call().then((pokes) => {
        this.pokes = pokes
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
