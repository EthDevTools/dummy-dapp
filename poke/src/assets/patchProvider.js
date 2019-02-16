
const abiDecoder = require('abi-decoder');
var sparkles = require('sparkles')(); // make sure to call the function
import { inspect } from 'util'
import BigNumber from 'bignumber.js'
const processMethod = {
  eth_accounts: args => {
    return {
      to: null,
      name: null,
      params: null
    };
  },
  eth_call: args => {
    const contractAddress = '' + args[1][0].to.toLowerCase();
    const methodSig = args[1][0].data;
    const decodedInput = abiDecoder.decodeMethod(methodSig);
    return {
      to: contractAddress,
      name: decodedInput.name + '(' + decodedInput.params.map(p => p.type).join(',') + ')',
      params: decodedInput.params.length ? decodedInput.params : null
    }
  },
  eth_gasPrice: args => {
    console.log('gas price', args)
    return {
      to: null,
      name: null,
      params: null
    }
  },
  eth_sendTransaction: args => {
    const contractAddress = '' + args[1][0].to.toLowerCase();
    const methodSig = args[1][0].data;
    const decodedInput = abiDecoder.decodeMethod(methodSig);
    return {
      to: contractAddress,
      name: decodedInput.name,
      params: decodedInput.params.length ? decodedInput.params : null
    }
  },
  eth_getTransactionReceipt: args => {
    return {
      to: null,
      name: null,
      params: {
        tx: args[1][0]
      }
    }
  },
  default: (args, method) => {
    console.log(`UNKNOWN MSG TYPE ${method}`, args)
    return {
      to: null,
      name: null,
      params: args
    }
  }
}

const processResult = {
  eth_accounts: (args, results) => {
    return {
      params: results.length ? results[0] : results
    }
  },
  eth_call: (args, results) => {
    let method = abiDecoder.getABIs().find((m) => m.signature === args[1][0].data.slice(0, 10))
    console.log(abiDecoder.getABIs().map(m => m.name + '-' + m.signature))
    console.log(args)
    if (method) {
      console.log('method', method)
      results = web3.eth.abi.decodeParameters(method.outputs, results.join(''))
      console.log(results)
    }
    return {
      params: results
    }
  },
  eth_getTransactionReceipt: (args, results) => {
    if (results.length && results[0] && results[0].logs) {
      const decodedLogs = abiDecoder.decodeLogs(results[0].logs);
      results[0].logsDecoded = decodedLogs
    }
    return {
      params: results.length ? results[0] : null
    }
  },
  eth_gasPrice: (args, results) => {
    let cost = new BigNumber(results[0], 16)
    let gasResult = {}
    gasResult.wei = cost.toString(10)
    gasResult.eth = cost.div(1e18).toString(10)
    gasResult.original = results[0]
    return {
      params: gasResult
    }
  },
  eth_sendTransaction: (args, results) => {
    return {
      params: {tx: results[0]}
    }
  },
  default: (args, results, method) => {
    console.log(`UNKNOWN MSG RETURN ${method}`, results)
    return {
      params: results
    }
  }
}

export const patchProvider = web3 => {
  const contractDecoders = {};
  const currentProvider = web3.currentProvider;

  const currentProviderSend = currentProvider.send;
  const newSend = function() {

    const web3Method = arguments[0];
    const processLogMessage = processMethod[web3Method] || processMethod.default
    const logMessage = processLogMessage(arguments, web3Method);
    logMessage.method = web3Method
    logMessage.id = uid()
    logMessage.time = + new Date()
    sparkles.emit('new-log', { logMessage });

    let prom = currentProviderSend.apply(currentProvider, arguments)
    prom.then((...results) => {
      const processLogResult = processResult[web3Method] || processResult.default;
      const logResult = processLogResult(arguments, results, web3Method);
      logResult.id = logMessage.id
      logResult.time = + new Date()
      logResult.method = web3Method
      sparkles.emit('new-result', { logResult });
    });
    return prom
  };
  currentProvider.send = newSend;
  web3.setProvider('');
  web3.setProvider(currentProvider);

  const oldContract = web3.eth.Contract;
  const newContract = function() {
    console.log('Instantiating a contract');
    const contractAddress = ('' + arguments[1]).toLowerCase();
    const abi = arguments[0];
    abiDecoder.addABI(abi);
    return oldContract.apply(oldContract, arguments);
  }
  web3.eth.Contract = newContract;
}

const uid = function () {
  var k = Math.floor(Math.random() * 1000000);
  return k;
}