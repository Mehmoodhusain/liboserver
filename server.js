// IMPORT FILES
const {
  getConnection
} = require("./connection/connection");
const configPort = require("./config/index");
const expServer = require("./express")
const {
  block,
  supply,
  node,
  transaction
} = require("./controller/cron");

// CONNECTION TO MONGOOSE
getConnection();

// CRON
block()
supply()
node()
transaction()

// CREATE SERVER
const server = expServer.listen(configPort.SERVER_PORT, () => {
  console.log(`Server: ${configPort.SERVER_PORT}`);
});

// EXPORT SERVER
module.exports = server