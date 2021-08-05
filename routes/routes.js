// IMPORT FILES
const {errorFunction} = require("../middleware/errorFunction");
const {latestBlock, blockByHeight, blocks} = require("../controller/block");
const {nodes} = require("../controller/node");
const {supply} = require("../controller/supply");
const {transactions, transactionByHash } = require("../controller/transaction");
const { searchByAddress } = require("../controller/address")

// IMPORT LIBRARIES
const router = require("express").Router();

// ROUTES

router.get("/supply/total", errorFunction(supply));
router.get("/node_info", errorFunction(nodes));
router.get("/blocks", errorFunction(blocks));
router.get("/blocks/latest", errorFunction(latestBlock));
router.get("/blocks/:height", errorFunction(blockByHeight));

router.get("/txs", errorFunction(transactions));
router.get("/txs/:txHash", errorFunction(transactionByHash));
router.get("/addresses/:address", errorFunction(searchByAddress));

// EXPORT ROUTER
module.exports = router;