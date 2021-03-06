// IMPORT FILES
const {
  Transaction
} = require("../model/transaction");
const {
  Block
} = require("../model/block");

// IMPORT LIBRARIES
let mongoose = require("mongoose");

// TRANSACTION ROUTE FUNCTION
module.exports = {

  transactions: async function (req, res) {


    if (req.query.block && req.query.page && req.query.limit) { // SEARCH BY BLOCK HEIGHT AND PAGINATION
      const options = {
        page: req.query.page,
        limit: req.query.limit,
        sort: {
          _id: -1
        },
      };
      Transaction.paginate({
        "height": parseInt(req.query.block)
      }, options, function (err, result) {
        if (result.docs.length > 0)
          return res.status(200).send({
            //Message: "txs with block height and pagination",
            total_count: result.totalDocs,
            count: result.docs.length,
            page_number: result.page,
            page_total: result.totalPages,
            limit: result.limit,
            txs: result.docs
          });
        else
          return res.status(404).send({
            Message: "Transactions Not Found"
          })
      });
    } else if (req.query.block) { // SEARCH BY BLOCK HEIGHT
      const options = {
        page: 1,
        limit: 10,
        sort: {
          _id: -1
        },
      };
      Transaction.paginate({
        "height": req.query.block
      }, options, function (err, result) {
        if (result.docs.length > 0)
          return res.status(200).send({
            //Message: "txs with block height",
            total_count: result.totalDocs,
            count: result.docs.length,
            page_number: result.page,
            page_total: result.totalPages,
            limit: result.limit,
            txs: result.docs
          });
        else
          return res.status(404).send({
            Message: "Transactions Not Found"
          })
      });




    } else if (req.query.page && req.query.limit) { // SEARCH BY PAGINATION
      const options = {
        page: req.query.page,
        limit: req.query.limit,
        sort: {
          _id: -1
        },
      };
      Transaction.paginate({}, options, function (err, result) {
        if (result.docs.length > 0)
          return res.status(200).send({
            //Message: "with pagination",
            total_count: result.totalDocs,
            count: result.docs.length,
            page_number: result.page,
            page_total: result.totalPages,
            limit: result.limit,
            txs: result.docs
          });
        else
          return res.status(404).send({
            Message: "Transactions Not Found"
          })
      });
    } else { // NOTHING
      const options = {
        page: 1,
        limit: 10,
        sort: {
          _id: -1
        },
      };
      Transaction.paginate({}, options, function (err, result) {
        if (result.docs.length > 0)
          return res.status(200).send({
            //Message: "txs only",
            total_count: result.totalDocs,
            count: result.docs.length,
            page_number: result.page,
            page_total: result.totalPages,
            limit: result.limit,
            txs: result.docs
          });
        else
          return res.status(404).send({
            Message: "Transactions Not Found"
          })
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
        return res.status(404).send({
          Message: "Transaction Not Found"
        });
    } catch (ex) {
      console.log(ex.message)
    }
  },
};