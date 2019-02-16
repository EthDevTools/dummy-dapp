const processMethod = {
  eth_call: args => {
    const contractAddress = '' + args[1][0].to.toLowerCase();
    const methodSig = args[1][0].data;
    const contractABI = web3.reverseLookups[contractAddress];
    const method = contractABI && contractABI[methodSig];
    const methodName = method && method.name;
    return `eth_call, address: ${contractAddress}, method: ${methodName}`;
  },
  eth_gasPrice: args => {
    return `eth_gasPrice`;
  },
  eth_sendTransaction: args => {
    const contractAddress = '' + args[1][0].to.toLowerCase();
    const methodSig = args[1][0].data;
    const contractABI = web3.reverseLookups[contractAddress];
    const method = contractABI && contractABI[methodSig];
    const methodName = method && method.name;
    return `eth_sendTransactions, address: ${contractAddress}, method: ${methodName}`;
  },
}

export const patchProvider = web3 => {
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
  web3.reverseLookups = {};
  const oldContract = web3.eth.Contract;
  const newContract = function() {
    console.log('Instantiating a contract');
    const contractAddress = ('' + arguments[1]).toLowerCase();
    const abi = arguments[0];
    const reverseABIs = abi.reduce((accum, abiEntry) => {
      accum[abiEntry.signature] = abiEntry;
      return accum;
    }, {});
    const contractReversal = {};
    contractReversal[contractAddress] = reverseABIs;
    web3.reverseLookups = Object.assign(
      {},
      web3.reverseLookups,
      contractReversal
    );
    return oldContract.apply(oldContract, arguments);
  }
  web3.eth.Contract = newContract;
}
``