// IMPORT LIBRARIES
const mongoose = require('mongoose');

// SCHEMA
const Supply = mongoose.model('supply', new mongoose.Schema({
  height: String,
  result: [{
    denom: String,
    amount: String
  }],
}));
module.exports = {
  Supply
}