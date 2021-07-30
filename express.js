// IMPORT FILES
const error = require("./middleware/error");
const routes = require("./routes/routes");

// IMPORT LIBRARIES
const express = require("express");
const expServer = express();

// PIPELINING OF FUNCTIONS
expServer.use(express.json());
expServer.use("/", routes);
expServer.use(error);

// EXPORT APP
module.exports = expServer