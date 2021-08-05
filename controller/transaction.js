// IMPORT FILES
const {
  Transaction
} = require("../model/transaction");

// IMPORT LIBRARIES
let mongoose = require("mongoose");

// TRANSACTION ROUTE FUNCTION
module.exports = {
  transactions: async function (req, res) {
    if(req.query.address){ // SEND ONLY
      const options = {
        page: 1,
        limit: 30,
        sort: {
          _id: -1
        },
      };
        Transaction.paginate({"height": {$gte: req.query.address}}, options, function (err, result) {
          if(result.docs.length>0)
          return res.status(200).send({Message: "send only",Length: result.docs.length, Data: result.docs});
          else
          return res.status(404).send({Message: "Transactions 5Not Found"}) 
      });
    }

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
        return res.status(200).send({total_count:result.totalDocs, count:result.docs.length, page_number:result.page, page_total:result.totalPages, limit:result.limit, txs: result.docs});
        else
        return res.status(404).send({Message: "Transactions Not Found"}) 
      });
    } else {// IF PAGE NUMBER AND LIMIT IS NOT GIVEN
      const options = {
        page: 1,
        limit: 30,
        sort: {
          _id: -1
        },
      };
      Transaction.paginate({}, options, function (err, result) {
        if(result.docs.length>0)
        return res.status(200).send({total_count:result.totalDocs, count:result.docs.length, page_number:result.page, page_total:result.totalPages, limit:result.limit, txs: result.docs});
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