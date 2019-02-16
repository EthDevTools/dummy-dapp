export const patchProvider = web3 => {
  const currentProvider = web3.currentProvider;
  const currentProviderSend = currentProvider.send;
  const newSend = function() {
    console.log('Sending a call');
    console.log(arguments)
    console.log(this);
    return currentProviderSend.apply(currentProvider, arguments);
  };
  currentProvider.send = newSend;
  web3.setProvider('');
  web3.setProvider(currentProvider);
}
