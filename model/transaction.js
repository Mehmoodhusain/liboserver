// IMPORT FILES
const config = require("../config/index")

// IMPORT LIBRARIES
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// SCHEMA
const transaction = new mongoose.Schema({
  height: String,
  txhash: String,
  code: Number,
  raw_log: String,
  logs: [{
    msg_index: Number,
    success: Boolean,
    log: String,
    events: [{
      type: {
        type: String
      },
      attributes: [{
        key: String,
        value: String,
      }, ]
    }, ]
  }],
  gas_wanted: String,
  gas_used: String,
  tx: {
    type: {
      type: String
    },
    value: {
      msg: [{
        type: {
          type: String
        },
        value: {
          from_address: String,
          to_address: String,
          amount: [{
            denom: String,
            amount: String
          }]
        }
      }],
      fee: {
        amount: [{
          denom: String,
          amount: String
        }],
        gas: String
      },
      signatures: [{
        pub_key: {
          type: {
            type: String
          },
          value: String
        },
        signature: String
      }],
      memo: String
    }
  },
  timestamp: String,
  events: [{
    type: {
      type: String
    },
    attributes: [{
      key: String,
      value: String,
    }, ]
  }, ]
});

// EMIT AFTER EVERYTIME A TRANSACTION IS SAVED
transaction.post('save', async function (doc) {
  let lastFiveTransactions = await Transaction.find({}).sort({
    _id: -1
  }).limit(5)
  tempId = lastFiveTransactions[0]._id
  config.Emmiter.emit('latestTransactions', {
    Transactions: lastFiveTransactions
  });
});
transaction.plugin(mongoosePaginate);
const Transaction = mongoose.model('transaction', transaction);
module.exports = {
  Transaction
}