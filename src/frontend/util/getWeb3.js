import Web3 from 'web3'
import store from '../store/store.js';

export const START_WEB3 = "START_WEB3"

const startWeb3 = (results) => ({
  type: START_WEB3,
  web3: results.web3
})

const getAccounts = (accounts) => ({
  type: "GET_ACCOUNTS",
  accounts: accounts
})

export const fetchAccounts = (web3) => {
  web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        alert('There was an error fetching your accounts.');
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly");
        return;
      }

      store.dispatch(getAccounts(accs))
    });
}


export const getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function() {
    var results
    var web3 = window.web3

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider)


      results = {
        web3: web3
      }

      console.log('Injected web3 detected.');

      resolve(store.dispatch(startWeb3(results)))
    } else {
      // Fallback to localhost if no web3 injection. We've configured this to
      // use the development console's port by default.
      var provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545')

      web3 = new Web3(provider)

      results = {
        web3: web3
      }



      console.log('No web3 instance injected, using Local web3.');

      resolve(store.dispatch(startWeb3(results)))
    }
  })
})
