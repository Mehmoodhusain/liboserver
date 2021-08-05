// IMPORT FILES
const {
  Supply
} = require("../model/supply");
const {
  Block
} = require("../model/block");
const {
  Node
} = require("../model/node");
const {
  Transaction
} = require("../model/transaction");

// IMPORT LIBRARIES
const fetch = require('node-fetch');
const cron = require("node-cron");
const mongoose = require("mongoose");

// CRON FUNCTIONS
module.exports = {


  supplyCron: async function (initialSupply, previousHeight) {
    let done = true
    let supplyCron = cron.schedule('*/1 * * * * *', async function () {
      if (done == true) {
        done = false
        await fetch(`http://18.206.253.182:1300/supply/total`)
          .then(res => res.json())
          .then(async function(json) {
            if(json.height!=previousHeight){
                let supp = await Supply.findOne()
                console.log("SUPPLY HEIGHT:", parseInt(json.height))
                let obj = new Supply(json)
                if(supp){
                  await Supply.findByIdAndUpdate(
                    { _id: supp._id },
                    {
                      $set: {
                        height: obj.height,
                        result: obj.result
                      }
                    }
                  );
                }
                else
                  obj.save()
                previousHeight = json.height
            }
              done = true
          })
          .catch(err => console.log("ERROR IN SUPPLY CRON\t", err.message))
      }
    });
  },




  nodeCron: async function (initialNode, nodeVersion) {
    let done = true
    let nodeCron = cron.schedule('*/1 * * * * *', async function () {
      if (done == true) {
        done = false
        await fetch(`http://18.206.253.182:1300/node_info`)
          .then(res => res.json())
          .then(json => {
            if ((nodeVersion != json.node_info.version) || (initialNode == true)) {
              initialNode = false
              console.log("NODE VERSION: ", json.node_info.version)
              let obj = new Node(json)
              obj.save()
              nodeVersion = json.node_info.version
              done = true
            }
          })
          .catch(err => console.log("ERROR IN NODE CRON\t", err.message))
      }
    });
  },


  txsCron: async function (minHeight, initialTxs) {
    let done = true
    let txsCron = cron.schedule('*/1 * * * * *', async function () {
      if (done == true) {
        done = false
        await fetch(`http://18.206.253.182:1300/txs?tx.minheight=${minHeight}&limit=100`)
          .then(res => res.json())
          .then(async function (json) {
            if (json.txs.length > 0) {
              for (let i = 0; i < json.txs.length; i++) {
                let transaction = await Transaction.findOne({
                  $and: [{
                    height: json.txs[i].height
                  }, {
                    txhash: json.txs[i].txhash
                  }]
                })
                if (!transaction) {
                  let obj = new Transaction(json.txs[i])
                  obj.save()
                }
              }
              minHeight = parseInt(json.txs[json.txs.length - 1].height)
            }
          })
          .catch(err => console.log("ERROR IN TXS CRON\t", err.message))
        done = true
      }
    });
  },



  blockCron: async function (blockHeight) { //, achieved) {
    let done = true
    let blockCron = cron.schedule('*/1 * * * * *', async function () {
      if (done == true) {
        done = false
        await fetch(`http://18.206.253.182:1300/blocks/${blockHeight}`)
          .then(res => res.json())
          .then(async function (json) {
            let obj = new Block(json)
            if (obj.block.header.height == undefined)
              done = true
            else {
              await obj.save()
              console.log("INSERTED BLOCK HEIGHT: ", obj.block.header.height)
              blockHeight += 1
              done = true
            }
          })
          .catch(err => console.log("ERROR IN BLOCK CRON\t", err.message))
      }
    });
  },
}