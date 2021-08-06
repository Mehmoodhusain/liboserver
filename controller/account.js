// IMPORT FILES
const {
  Supply
} = require("../model/supply");

// IMPORT LIBRARIES
const fetch = require('node-fetch');

// SUPPLY ROUTE FUNCTION
module.exports = {

  authAccountAddress: async function (req, res) {
    await fetch(`http://18.206.253.182:1300/auth/accounts/${req.params.address}`)
      .then(res => res.json())
      .then(async function (json) {
        return res.status(200).send(json);
      })
      .catch(err => console.log("ERROR IN SUPPLY CRON\t", err.message))
  },



  bankBalanceAddress: async function (req, res) {
    await fetch(`http://18.206.253.182:1300/bank/balances/${req.params.address}`)
      .then(res => res.json())
      .then(async function (json) {
        return res.status(200).send(json);
      })
      .catch(err => console.log("ERROR IN SUPPLY CRON\t", err.message))
  }
}