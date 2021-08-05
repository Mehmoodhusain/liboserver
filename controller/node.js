// IMPORT FILES
const {
  Node
} = require("../model/node");

// NODE ROUTE FUNCTION
module.exports = {
  nodes: async function (req, res) {
    let node = await Node.find({}).sort({ // FETCHES THE MOST RECENTLY ADDED DOCUMENT FROM DATABASE
      _id: -1
    }).limit(1)
    if (node.length > 0)
      return res.status(200).send(node[0]);
    else
      return res.status(404).send({
        Message: "Node Not Found"
      });
  }
};