const { Socket } = require("socket.io");

const config = {
  SERVER_PORT: 3000,
  MONGO_URI: 'mongodb://localhost:27017/libExp',
  Emmiter: Socket
};
module.exports = config;
