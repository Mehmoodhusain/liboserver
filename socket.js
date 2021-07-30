// IMPORT FILES
const server = require('./server')
const {
    Block
} = require("./model/block");
const {
    Node
} = require("./model/node");
const {
    Transaction
} = require("./model/transaction");

// IMPORT LIBRARIES  
const socketio = require("socket.io")
const io = socketio(server)
const cron = require("node-cron");


// SOCKET FUNCTION
io.on('connection', async function (socket) {
    let initialBlock = true
    let tempBlock = -1
    let tempId = 1
    let initialTxs = true
    let condition = true
    let libonomyDashboard = cron.schedule('*/1 * * * * *', async function () {
        try {
            let lastFiveTransactions = await Transaction.find({}).sort({
                _id: -1
            }).limit(5)
            if (lastFiveTransactions.length > 0) {
                if (`${tempId}` === `${lastFiveTransactions[0]._id}`)
                    condition = true
                else
                    condition = false
                if (condition == false || initialTxs == true) {
                    initialTxs = false
                    tempId = lastFiveTransactions[0]._id
                    socket.emit('latestTransactions', {
                        Transactions: lastFiveTransactions
                    });
                }
            }
            let lastFiveBlocks = await Block.find({}).sort({
               _id: -1
            }).limit(5)
            let node = await Node.findOne()
            if (lastFiveBlocks && node) {
                if ((tempBlock < lastFiveBlocks[0].block.header.height) || (initialBlock == true)) {
                    initialBlock = false
                    tempBlock = lastFiveBlocks[0].block.header.height

                    socket.emit('dashboard', {
                        Network: node,
                        'Latest Blocks': lastFiveBlocks[0]
                    });
                    socket.emit('latestBlocks', {
                        Height: lastFiveBlocks
                    });
                }
            }
        } catch (ex) {
            initialBlock = false
        }
    })
})