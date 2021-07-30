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
const mongoose = require("mongoose")


// CRON FUNCTIONS
module.exports = {
  supplyCron: async function (initialSupply, tempSupply) {
    let done = true
    let supplyCron = cron.schedule('*/1 * * * * *', async function () {
      if (done == true) {
        done = false
        await fetch(`http://18.206.253.182:1300/supply/total`)
          .then(res => res.json())
          .then(json => {
            if ((tempSupply == json.height - 1) || (initialSupply == true)) {
              initialSupply = false
              console.log("SUPPLY HEIGHT:", parseInt(json.height))
              let obj = new Supply(json)
              obj.save()
              tempSupply = json.height
              done = true
            }
          })
          .catch(err => console.log("ERROR IN SUPPLY CRON\t", err.message))
      }
    });
  },
  blockCron: async function (blockHeight) {
    let done = true
    let limit = 10
    console.log("LOOP LIMIT: ", limit)
    let blockCron = cron.schedule('*/1 * * * * *', async function () {
      if (done == true) {
        done = false
        let data = []
        const promise = new Promise(async function (resolve, reject) {
          for (let i = 0; i < limit; i++) {
            blockHeight += 1
            await fetch(`http://18.206.253.182:1300/blocks/${blockHeight}`)
              .then(res => res.json())
              .then(async function (json) {
                if (json != undefined) {
                  let obj = new Block(json)
                  data.push(obj)
                  console.log("SAVED HEIGHT:\t", data[i].block.header.height)
                }
                if (i == limit - 1) {
                  resolve(data)
                }
              })
              .catch(err => console.log("ERROR IN BLOCK CRON\t", err.message))
          }
        })
        promise.then(async function (value) {
          await Block.insertMany(value)
          console.log("INSERTED LENGTH: ", value.length)
          let obb = await Block.findOne({
            'block.header.height': blockHeight
          })
          if (obb)
            done = true
        })
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
        await fetch(`http://18.206.253.182:1300/txs?tx.minheight=${minHeight}`)
          .then(res => res.json())
          .then(json => {
            if (((json.txs.length > 0) && (minHeight <= json.txs[0].height)) || (initialTxs == true)) {
              initialTxs = false
              for (let i = 0; i < json.txs.length; i++) {
                let obj = new Transaction(json.txs[i])
                obj.save()
              }
              console.log("TXS ADDED LENGTH:\t", json.txs.length)
              minHeight = parseInt(json.txs[json.txs.length - 1].height) + 1
              done = true
            }
          })
          .catch(err => console.log("ERROR IN TXS CRON\t", err.message))
      }
    });
  }
}
