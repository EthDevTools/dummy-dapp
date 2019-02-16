<template>
  <div id="app"><button @click="read">Read</button><button @click="poke">Poke</button>{{pokes}} Pokes
      <button @click="read2">Read2</button>
      <input v-model="manualPoke">
      <button @click="poke2">set poke = {{manualPoke}}</button>
    {{poking ? 'poking...' : ''}}
    <logs :logs="logs" :results="results" />
    <!-- <div :key="log" v-for="log in logs">
      {{log}}
    </div> -->
  </div>
</template>

<script>
import Web3 from 'Web3'
import Logs from '@/components/Logs'
var sparkles = require('sparkles')(); // make sure to call the function

const pokeArtifacts = require('../../build/contracts/Sample.json')


if (global.ethereum) {
  global.web3 = new Web3(global.ethereum)
} else if (global.web3) {
  global.web3 = new Web3(global.web3.currentProvider)
}


export default {
  name: 'App',
  components: {
    Logs
  },
  data() {
    return {
      poking: false,
      manualPoke: 0,
      pokes: 0,
      acount: null,
      logs: [],
      results: {}
    }
  },
  computed: {
    headers () {
      return this.logs.length ? Object.keys(this.logs[0]) : []
    }
  },
  async mounted () {
    sparkles.on('new-log', message => {
      // console.log('new log', message.logMessage)
      this.logs.push(message.logMessage)
    });
    sparkles.on('new-result', message => {
      // console.log('new result', message.logResult)
      this.$set(this.results, message.logResult.id, message.logResult);
    });
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
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.flex {
   display: flex;
 }
.col {
  width: 25%;
}
 div{
    /* border: 1px solid black; */
 }
</style>
