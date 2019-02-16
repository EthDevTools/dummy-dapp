const abiDecoder = require('abi-decoder');

const processMethod = {
  eth_call: args => {
    const contractAddress = '' + args[1][0].to.toLowerCase();
    const methodSig = args[1][0].data;
    const decodedInput = abiDecoder.decodeMethod(methodSig);
    return `eth_call, address: ${contractAddress}, method: ${decodedInput.name}, params: ${JSON.stringify(decodedInput.params)}`;
  },
  eth_gasPrice: args => {
    return `eth_gasPrice`;
  },
  eth_sendTransaction: args => {
    const contractAddress = '' + args[1][0].to.toLowerCase();
    const methodSig = args[1][0].data;
    const decodedInput = abiDecoder.decodeMethod(methodSig);
    return `eth_sendTransactions, address: ${contractAddress}, method: ${decodedInput.name}, params: ${JSON.stringify(decodedInput.params)}`;
  },
  eth_getTransactionReceipt: args => {
    return `eth_getTransactionReceipt, id: ${args[1][0]}`;
  },
}

export const patchProvider = web3 => {
  const contractDecoders = {};
  const currentProvider = web3.currentProvider;
  const currentProviderSend = currentProvider.send;
  const newSend = function() {
    const web3Method = arguments[0];
    const processLogMessage = processMethod[web3Method] || (_ => web3Method);
    const logMessage = processLogMessage(arguments);
    console.log(logMessage);

    return currentProviderSend.apply(currentProvider, arguments);
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
``
