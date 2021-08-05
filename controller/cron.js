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
const {
  blockCron,
  nodeCron,
  txsCron,
  supplyCron
} = require("./cronCode")

// IMPORT LIBRARIES
const fetch = require('node-fetch');
const cron = require("node-cron");
const mongoose = require("mongoose")

// CRON FUNCTION
module.exports = {
  block: async function () {
    let prev = await Block.find().sort({
      _id: -1
    }).limit(1);
    if (prev.length == 0) {
      let blockHeight = 3540000
      blockCron(blockHeight)
    } else {
      let blockHeight = parseInt(prev[0].block.header.height) + 1
      console.log("\t\t\tBLOCK DOC FOUND WIT MAX COUNT: ", blockHeight - 1)
      blockCron(blockHeight)
    }
  },

  supply: async function () {
    let tempSupply = -1
    let initialSupply = true
    let supp = await Supply.findOne().sort({
      _id: -1
    })
    if (!supp) {
      console.log("SUPPLY AT INITIAL POINT")
      supplyCron(initialSupply, tempSupply)
    } else {
      tempSupply = supp.height
      console.log("\t\t\tSUPPLY DOC FOUND HEIGHT: ", parseInt(tempSupply))
      mongoose.connection.db.dropCollection('supplies', function (err, result) {
        console.log("\t\t\tSUPPLY COLLECTION DELETED")
        return 0
      });
      supplyCron(initialSupply, tempSupply)

    }
  },

  node: async function () {
    let initialNode = true
    let nodeVersion = 1
    let node = await Node.find().sort({
      _id: -1
    });
    if (node.length == 0) {
      console.log("NODE AT INITIAL STAGE")
      nodeCron(initialNode, nodeVersion)
    } else {
      nodeVersion = node[0].node_info.version
      console.log("\t\t\tNODE DOC FOUND WITH VERSION:\t", nodeVersion)
      mongoose.connection.db.dropCollection('nodes', function (err, result) {
        console.log("\t\t\tNODE COLLECTION DELETED")
        return 0
      });
      nodeCron(initialNode, nodeVersion)
    }
  },

  transaction: async function () {
    let initialTxs = true
    let minHeight = 1
    let txs = await Transaction.find().sort({
      _id: -1
    }).limit(1);
    if (txs.length == 0) {
      console.log("TRANSACTION AT INITIAL STAGE")
      txsCron(minHeight, initialTxs)
    } else {
      initialTxs = false
      console.log("\t\t\tTRANSACTIONS FOUND")
      minHeight = parseInt(txs[0].height)
      txsCron(minHeight, initialTxs)
    }
  },

};