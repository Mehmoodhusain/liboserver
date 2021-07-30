// IMPORT FILES
const {
  Supply
} = require("../model/supply");

// SUPPLY ROUTE FUNCTION
module.exports = {
  supply: async function (req, res) {
    let supply = await Supply.find({}).sort({// FETCHES THE MOST RECENTLY ADDED DOCUMENT FROM DATABASE
      _id: -1
  }).limit(1)
  if (supply.length>0)
    return res.status(200).send(supply[0]);
    else
      return res.status(404).send({Message: "Supply Not Found"});
  }
};