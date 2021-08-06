// IMPORT FILES
const {
  Transaction
} = require("../model/transaction");

// IMPORT LIBRARIES
let mongoose = require("mongoose");

// TRANSACTION ROUTE FUNCTION
module.exports = {
  searchByAddress: async function (req, res) {

    // ADDING QUERIES TO ARRAY TO MAKE IT WORK FOR DYNAMIC QUERIES
    let queryArray = []
    if (req.query.type == 'send')
      queryArray.push({
        "tx.value.msg.value.from_address": req.params.address
      })
    if (req.query.type == 'receive')
      queryArray.push({
        "tx.value.msg.value.to_address": req.params.address
      })
    if (req.query.coin)
      queryArray.push({
        "tx.value.msg.value.amount.denom": req.query.coin
      })
      if (req.query.from)
      queryArray.push({
        $and: [{
            timestamp: {
              $gte: req.query.from
            }
          },
          {
            $or: [{
              "tx.value.msg.value.from_address": req.params.address
            }, {
              "tx.value.msg.value.to_address": req.params.address
            }]
          }
        ]
      })  
      if (req.query.to)
      queryArray.push({
        $and: [{
            timestamp: {
              $lte: req.query.to
            }
          },
          {
            $or: [{
              "tx.value.msg.value.from_address": req.params.address
            }, {
              "tx.value.msg.value.to_address": req.params.address
            }]
          }
        ]
      })

    // REQUEST HANDLER
    if (req.query.page && req.query.limit && queryArray.length > 0) { // PAGINATION AND QUERIES
      const options = {
        page: req.query.page,
        limit: req.query.limit,
        sort: {
          _id: -1
        },
      };
      Transaction.paginate({
        $and: queryArray
      }, options, function (err, result) {
        if (result.docs.length > 0)
          return res.status(200).send({
            //Message: "queries with pagination",
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
    } else if (queryArray.length > 0) { // NO PAGINATION AND QUERIES
      const options = {
        page: 1,
        limit: 10,
        sort: {
          _id: -1
        },
      };
      Transaction.paginate({
        $and: queryArray
      }, options, function (err, result) {
        if (result.docs.length > 0)
          return res.status(200).send({
            //Message: "queries without pagination",
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
    } else if(req.query.page && req.query.limit){ // ONLY PAGINATION
      const options = {
        page: req.query.page,
        limit: req.query.limit,
        sort: {
          _id: -1
        },
      };
      Transaction.paginate({
        $or: [{
          "tx.value.msg.value.from_address": req.params.address
        }, {
          "tx.value.msg.value.to_address": req.params.address
        }]
      }, options, function (err, result) {
        if (result.docs.length > 0)
          return res.status(200).send({
            //Message: "pagination without query",
            Length: result.docs.length,
            Data: result.docs
          });
        else
          return res.status(404).send({
            Message: "Transactions Not Found"
          })
      });
    }
    else{ // NOTHING
      const options = {
        page: 1,
        limit: 10,
        sort: {
          _id: -1
        },
      };
      Transaction.paginate({
        $or: [{
          "tx.value.msg.value.from_address": req.params.address
        }, {
          "tx.value.msg.value.to_address": req.params.address
        }]
      }, options, function (err, result) {
        if (result.docs.length > 0)
          return res.status(200).send({
            //Message: "nothing",
            Length: result.docs.length,
            Data: result.docs
          });
        else
          return res.status(404).send({
            Message: "Transactions Not Found"
          })
      });
    }
  },
};