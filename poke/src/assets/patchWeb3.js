export const patchWeb3 = web3 => {
  console.log('patchWeb3')
  // const _createTxObject = web3.eth.Contract.prototype._createTxObject;

  // if (typeof web3.version === 'object') {
  //   // v0.20 ?
  //   web3.eth.Contract.prototype._createTxObject = newCreateTxObject;
  // } else {
  //   web3.eth.Contract.prototype._createTxObject = newCreateTxObject;
  // }


  const _send = web3.eth.send
  web3.eth.send = function () {
    console.log('send')
    return _send
  }


  const _sendAsync = web3.eth.sendAsync
  web3.eth.sendAsync = function () {
    console.log('sendAsync')
    return _sendAsync
  }


  const _createTxObject = web3.eth.Contract.prototype._createTxObject
  web3.eth.Contract.prototype._createTxObject = function () {
    console.log('_createTxObject')
    return _createTxObject
  }


  return web3
};

//Note: Do not change to arrow function, arrow functions don't support
//arguments variable
const newCreateTxObject = function() {
  console.log('newCreateTxObject')
  var args = Array.prototype.slice.call(arguments);
  var txObject = {};

  if (this.method.type === 'function') {
    const wrappedCall = function(txObject) {
      console.log(`Making a call to ${this.method.name} on ${this.parent._address}`);
      return this.parent._executeMethod.bind(txObject, 'call');
    }
    txObject.call = wrappedCall.bind(this)(txObject);
    txObject.call.request = this.parent._executeMethod.bind(txObject, 'call', true); // to make batch requests
  }

  txObject.send = this.parent._executeMethod.bind(txObject, 'send');
  txObject.send.request = this.parent._executeMethod.bind(txObject, 'send', true); // to make batch requests

  txObject.encodeABI = this.parent._encodeMethodABI.bind(txObject);
  txObject.estimateGas = this.parent._executeMethod.bind(txObject, 'estimate');

  if (args && this.method.inputs && args.length !== this.method.inputs.length) {
    if (this.nextMethod) {
      return this.nextMethod.apply(null, args);
    }
    var errors = require('web3-core-helpers').errors;
    throw errors.InvalidNumberOfParams(args.length, this.method.inputs.length, this.method.name);
  }

  txObject.arguments = args || [];
  txObject._method = this.method;
  txObject._parent = this.parent;
  txObject._ethAccounts = this.parent.constructor._ethAccounts || this._ethAccounts;

  if (this.deployData) {
    txObject._deployData = this.deployData;
  }

  return txObject;
}