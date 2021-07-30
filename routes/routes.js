// IMPORT FILES
const {errorFunction} = require("../middleware/errorFunction");
const {latestBlock, blockByHeight, blocks} = require("../controller/block");
const {nodes} = require("../controller/node");
const {supply} = require("../controller/supply");
const {transactions, transactionByHash, searchByAddress} = require("../controller/transaction");

// IMPORT LIBRARIES
const router = require("express").Router();

// ROUTES

router.get("/supply/total", errorFunction(supply));
router.get("/node_info", errorFunction(nodes));
router.get("/liboexplorer.com/txs", errorFunction(transactions));
router.get("/liboexplorer.com/txs/:txHash", errorFunction(transactionByHash));
router.get("/liboexplorer.com/blocks/latest", errorFunction(latestBlock));
router.get("/liboexplorer.com/blocks", errorFunction(blocks));
router.get("/liboexplorer.com/blocks/:height", errorFunction(blockByHeight));
router.get("/liboexplorer.com/addresses/:address", errorFunction(searchByAddress));

// EXPORT ROUTER
module.exports = router;