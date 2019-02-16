<template>
  <div id="app">
    <div>
      <button @click="read">Read</button>
    </div>
    <div>
      <button @click="poke">Poke</button>
    </div>
    <h1>{{pokes}} Pokes</h1>
    <div>
      <button @click="read2">Read2</button>
    </div>
    <div>
      <input v-model="manualPoke"><br>
      <button @click="poke2">set poke = {{manualPoke}}</button>
    </div>
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


export default {
  name: 'App',
  data() {
    return {
      poking: false,
      manualPoke: 0,
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
    async poke2 () {
      this.poking = true
      try {
        var tx = await global.contract.methods.poke2(this.manualPoke).send({
          from: this.account
        })
        this.poking = false
        await this.read()
      } catch(error) {
        this.poking = false
      }
    },
    async read () {
      this.pokes = await global.contract.methods.getPokes.call()
    },
    async read2 () {
      this.pokes = await global.contract.methods.getPokes2('1').call()
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
