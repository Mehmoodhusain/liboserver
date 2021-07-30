// IMPORT FILES
const {
  Transaction
} = require("../model/transaction");

// IMPORT LIBRARIES
let mongoose = require("mongoose");

// TRANSACTION ROUTE FUNCTION
module.exports = {
  searchByAddress: async function (req, res) {
    if (req.query.page && req.query.limit) {// IF PAGE NUMBER AND LIMIT IS GIVEN
      const options = {
        page: req.query.page,
        limit: req.query.limit,
        sort: {
          _id: -1
        },
      };
      Transaction.paginate({
        $or: [{"tx.value.msg.value.from_address": req.params.address},{ "tx.value.msg.value.to_address": req.params.address}]
        }, options, function (err, result) {
          if(result.docs.length>0)
          return res.status(200).send({Length: result.docs.length, Data: result.docs});
          else
          return res.status(404).send({Message: "Transactions Not Found"}) 
      });
    } else {// IF PAGE NUMBER AND LIMIT IS NOT GIVEN
      const options = {
        page: 1,
        limit: 10,
        sort: {
          _id: -1
        },
      };
      Transaction.paginate({
        $or: [{"tx.value.msg.value.from_address": req.params.address},{ "tx.value.msg.value.to_address": req.params.address}]
        }, options, function (err, result) {
          if(result.docs.length>0)
          return res.status(200).send({Length: result.docs.length, Data: result.docs});
          else
          return res.status(404).send({Message: "Transactions Not Found"}) 
      });
    }
  },
  transactions: async function (req, res) {
    if (req.query.page && req.query.limit) {// IF PAGE NUMBER AND LIMIT IS GIVEN
      const options = {
        page: req.query.page,
        limit: req.query.limit,
        sort: {
          _id: -1
        },
      };
      Transaction.paginate({}, options, function (err, result) {
        if(result.docs.length>0)
        return res.status(200).send({Length: result.docs.length, Data: result.docs});
        else
        return res.status(404).send({Message: "Transactions Not Found"}) 
      });
    } else {// IF PAGE NUMBER AND LIMIT IS NOT GIVEN
      const options = {
        page: 1,
        limit: 10,
        sort: {
          _id: -1
        },
      };
      Transaction.paginate({}, options, function (err, result) {
        if(result.docs.length>0)
        return res.status(200).send({Length: result.docs.length, Data: result.docs});
        else
        return res.status(404).send({Message: "Transactions Not Found"}) 
      });
    }
  },
  transactionByHash: async function (req, res) {
    try {
      let transaction = await Transaction.findOne({
        txhash: req.params.txHash
      })
      if (transaction)
        return res.status(200).send(transaction);
      else
        return res.status(404).send({Message: "Transaction Not Found"});
    } catch (ex) {
      console.log(ex.message)
    }
  },
};