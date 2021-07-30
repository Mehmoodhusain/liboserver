// IMPORT FILES
const config = require("../config/index");

// IMPORT LIBRARIES
const mongoose = require("mongoose");

// CONNECTION FUNCTION
function getConnection() {
  mongoose.connect(config.MONGO_URI, { useNewUrlParser: true , useUnifiedTopology: true } );
  mongoose.connection.on("connected", function () {
    console.log("Database connected");
  });
  mongoose.connection.on("error", function (err) {
    console.log("Mongoose default connection error: ",err.message);
  });
  mongoose.connection.on("disconnected", function () {
    console.log("Mongoose default connection disconnected");
  });
}

// EXPORT CONNECTION FUNCTION
module.exports = {
  getConnection,
};