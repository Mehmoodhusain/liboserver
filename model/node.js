// IMPORT LIBRARIES
const mongoose = require('mongoose');

// SCHEMA
const Node = mongoose.model('node', new mongoose.Schema(
  {
  node_info: {
    protocol_version: {
      p2p: String,
      block: String,
      app: String,
    },
    id: String,
    listen_addr: String,
    network: String,
    version: String,
    channels: String,
    moniker: String,
    other: {
      tx_index: String,
      rpc_address: String,
    },
  },
  application_version: {
    name: String,
    server_name: String,
    client_name: String,
    version: String,
    commit: String,
    build_tags: String,
    go: String
  },
}
));
module.exports = {
  Node
}