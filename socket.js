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
let config = require("./config/index")

// IMPORT LIBRARIES  
const socketio = require("socket.io")
const io = socketio(server)

// SOCKET.IO CODE
config.Emmiter = io
io.on('connection', async function (socket) {

    let lastFiveTransactions = await Transaction.find({}).sort({
        _id: -1
    }).limit(5)
    let lastFiveBlocks = await Block.find({}).sort({
        _id: -1
    }).limit(5)
    let node = await Node.findOne()
    tempId = lastFiveTransactions[0]._id
    socket.emit('latestTransactions', {
        Transactions: lastFiveTransactions
    });
    socket.emit('dashboard', {
        Network: node,
        'Latest Blocks': lastFiveBlocks[0]
    });
    socket.emit('latestBlocks', {
        Height: lastFiveBlocks
    });
})