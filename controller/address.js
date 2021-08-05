// IMPORT FILES
const {
  Transaction
} = require("../model/transaction");

// IMPORT LIBRARIES
let mongoose = require("mongoose");

// TRANSACTION ROUTE FUNCTION
module.exports = {
  searchByAddress: async function (req, res) {
    
    let queryArray=[]
    if(req.query.type == 'send')
    queryArray.push({"tx.value.msg.value.from_address": req.params.address})
    if(req.query.type == 'receive')
    queryArray.push({"tx.value.msg.value.to_address": req.params.address})
    if(req.query.coin)
    queryArray.push({"tx.value.msg.value.amount.denom": req.query.coin})
    if(req.query.from)
    queryArray.push({
      $and:[
        {timestamp: {$gte:req.query.from}},
        {$or:[{"tx.value.msg.value.from_address": req.params.address},{"tx.value.msg.value.to_address": req.params.address}]}
      ]
    })
    if(req.query.to)
    queryArray.push({timestamp: {$lte:req.query.to}})
    
    if(req.query.page && req.query.limit && queryArray.length>0){ // SEND PAGINATION
      const options = {
        page: req.query.page,
        limit: req.query.limit,
        sort: {
          _id: -1
        },
      };
        Transaction.paginate({$and:queryArray}, options, function (err, result) {
          if(result.docs.length>0)
          return res.status(200).send({Message: "pagination",Length: result.docs.length, Data: result.docs});
          else
          return res.status(404).send({Message: "Transactions 1Not Found"}) 
      });
    }


    else if(queryArray.length>0){ // SEND PAGINATION
      const options = {
        page: 1,
        limit: 10000,
        sort: {
          _id: -1
        },
      };
        Transaction.paginate({$and:queryArray}, options, function (err, result) {
          if(result.docs.length>0)
          return res.status(200).send({Message: "no pagination",Length: result.docs.length, Data: result.docs});
          else
          return res.status(404).send({Message: "Transactions 1Not Found"}) 
      });
    }



    // else if(req.query.receive == 1 && req.query.page && req.query.limit){ // RECEIVE PAGINATION
    //   const options = {
    //     page: req.query.page,
    //     limit: req.query.limit,
    //     sort: {
    //       _id: -1
    //     },
    //   };
    //     Transaction.paginate({"tx.value.msg.value.to_address": req.params.address}, options, function (err, result) {
    //       if(result.docs.length>0)
    //       return res.status(200).send({Message: "receive pagination",Length: result.docs.length, Data: result.docs});
    //       else
    //       return res.status(404).send({Message: "Transactions 2Not Found"}) 
    //   });
    // }




    // else if(req.query.coin && req.query.page && req.query.limit){ // COIN PAGINATION
    //   const options = {
    //     page: req.query.page,
    //     limit: req.query.limit,
    //     sort: {
    //       _id: -1
    //     },
    //   };

    //   Transaction.paginate({
    //     $and: [{
    //       $or:[
    //         {"tx.value.msg.value.from_address": req.query.address},
    //         {"tx.value.msg.value.to_address": req.query.address}
    //       ]},
    //       {"tx.value.msg.value.amount.denom": req.query.coin}]
    //     }, options, function (err, result) {
    //      if(result.docs.length>0)
    //       return res.status(200).send({Message: "coin pagination",Length: result.docs.length, Data: result.docs});
    //       else
    //       return res.status(404).send({Message: "Transactions 3Not Found"}) 
    //   });
    // }



    // else if(req.query.from_time && req.query.to_time && req.query.page && req.query.limit){ // TIMESTAMP PAGINATION
    //   const options = {
    //     page: req.query.page,
    //     limit: req.query.limit,
    //     sort: {
    //       _id: -1
    //     },
    //   };
    //   Transaction.paginate({
    //     $and: [{"timestamp": {$gte:req.query.from_time}},{ "timestamp":{$lte:req.query.to_time} }]
    //     }, options, function (err, result) {
    //       console.log("hiii")
    //       if(result.docs.length>0)
    //       return res.status(200).send({Message: "timestamp pagination",Length: result.docs.length, Data: result.docs});
    //       else
    //       return res.status(404).send({Message: "Transactions 4Not Found"}) 
    //   });
    // }




    // else if(req.query.send == 1){ // SEND ONLY
    //   const options = {
    //     page: 1,
    //     limit: 10,
    //     sort: {
    //       _id: -1
    //     },
    //   };
    //     Transaction.paginate({"tx.value.msg.value.from_address": req.params.address}, options, function (err, result) {
    //       if(result.docs.length>0)
    //       return res.status(200).send({Message: "send only",Length: result.docs.length, Data: result.docs});
    //       else
    //       return res.status(404).send({Message: "Transactions 5Not Found"}) 
    //   });
    // }



    // else if(req.query.receive == 1){ // RECEIVE ONLY
    //   const options = {
    //     page: 1,
    //     limit: 10,
    //     sort: {
    //       _id: -1
    //     },
    //   };
    //     Transaction.paginate({"tx.value.msg.value.to_address": req.params.address}, options, function (err, result) {
    //       if(result.docs.length>0)
    //       return res.status(200).send({Message: "receive only",Length: result.docs.length, Data: result.docs});
    //       else
    //       return res.status(404).send({Message: "Transactions 6Not Found"}) 
    //   });
    // }




    // else if(req.query.coin && req.params.address){ // COIN ONLY
    //   const options = {
    //     page: 1,
    //     limit: 10,
    //     sort: {
    //       _id: -1
    //     },
    //   };

    //   Transaction.paginate({
    //     $and: [{"tx.value.msg.value.from_address": req.query.address},
    //       {"tx.value.msg.value.amount.denom": req.query.coin}]
    //     }, options, function (err, result) {
    //      if(result.docs.length>0)
    //       return res.status(200).send({Message: "coin only",Length: result.docs.length, Data: result.docs});
    //       else
    //       return res.status(404).send({Message: "Transactions 7Not Found"}) 
    //   });
    // }




    // else if(req.query.from_time && req.query.to_time){ // TIMESTAMP ONLY
    //   const options = {
    //     page: 1,
    //     limit: 10,
    //     sort: {
    //       _id: -1
    //     },
    //   };
    //   Transaction.paginate({
    //     $and: [{"timestamp": {$gte:req.query.from_time}},{ "timestamp":{$lte:req.query.to_time}},{ "tx.value.msg.value.to_address":req.query.address}]
    //     }, options, function (err, result) {
    //           if(result.docs.length>0)
    //       return res.status(200).send({Message: "timestamp only",Length: result.docs.length, Data: result.docs});
    //       else
    //       return res.status(404).send({Message: "Transactions 8Not Found"}) 
    //   });
    // }
    
    
    
    // else if (req.query.page && req.query.limit) {// WITH ONLY PAGE NUMBER
    //   const options = {
    //     page: req.query.page,
    //     limit: req.query.limit,
    //     sort: {
    //       _id: -1
    //     },
    //   };
    //   Transaction.paginate({
    //     $or: [{"tx.value.msg.value.from_address": req.params.address},{ "tx.value.msg.value.to_address": req.params.address}]
    //     }, options, function (err, result) {
    //       if(result.docs.length>0)
    //       return res.status(200).send({Message: "pagination only",Length: result.docs.length, Data: result.docs});
    //       else
    //       return res.status(404).send({Message: "Transactions 9Not Found"}) 
    //   });
    // }

    else
    {
      const options = { // WITH NO QUERY
            page: 1,
            limit: 100000,
            sort: {
              _id: -1
            },
          };
          Transaction.paginate({
            $or: [{"tx.value.msg.value.from_address": req.params.address},{ "tx.value.msg.value.to_address": req.params.address}]
            }, options, function (err, result) {
              if(result.docs.length>0)
              return res.status(200).send({Message: "nothing",Length: result.docs.length, Data: result.docs});
              else
              return res.status(404).send({Message: "Transactions 0Not Found"}) 
          });
    }
  },
};