// IMPORT FILES
const {errorFunction} = require("../middleware/errorFunction");
const {latestBlock, blockByHeight, blocks} = require("../controller/block");
const {nodes} = require("../controller/node");
const {supplyTotal, supplyFlby, supplyFpsix} = require("../controller/supply");
const {transactions, transactionByHash } = require("../controller/transaction");
const { searchByAddress } = require("../controller/address")
const { authAccountAddress ,  bankBalanceAddress } = require("../controller/account")

// IMPORT LIBRARIES
const router = require("express").Router();

// ROUTES

router.get("/blocks/latest", errorFunction(latestBlock));
router.get("/blocks", errorFunction(blocks));
router.get("/blocks/:height", errorFunction(blockByHeight));
router.get("/supply/total/flby", errorFunction(supplyFlby));
router.get("/supply/total/fpsix", errorFunction(supplyFpsix));
router.get("/supply/total", errorFunction(supplyTotal));
router.get("/node_info", errorFunction(nodes));
router.get("/txs", errorFunction(transactions));
router.get("/txs/:txHash", errorFunction(transactionByHash));
router.get("/auth/accounts/:address", errorFunction(authAccountAddress));
router.get("/bank/balances/:address", errorFunction(bankBalanceAddress));

router.get("/addresses/:address", errorFunction(searchByAddress));

// EXPORT ROUTER
module.exports = router;