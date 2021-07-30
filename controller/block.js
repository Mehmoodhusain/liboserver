// IMPORT FILES
const {
  Block
} = require("../model/block");

// BLOCKS ROUTE FUNCTION
module.exports = {
  latestBlock: async function (req, res) { // FETCHES THE MOST RECENTLY ADDED DOCUMENT FROM DATABASE
    let latestBlock = await Block.find({}).sort({
      _id: -1
    }).limit(1)
    if (latestBlock.length>0)
      return res.status(200).send(latestBlock[0]);
    else
      return res.status(404).send({Message: "Latest Block Not Found"});
  },
  blockByHeight: async function (req, res) { // FETCHES THE DOCUMENT FROM DATABASE BASED ON THE HEIGHT NUMBER
    let block = await Block.findOne({
      'block.header.height': req.params.height
    })
    if (block)
      return res.status(200).send(block);
    else
      return res.status(404).send({Message: "Block By Height Not Found"});
  },
  blocks: async function (req, res) {
    if (req.query.page && req.query.limit) { // IF PAGE NUMBER AND LIMIT IS GIVEN, FETCHES THE DOCUMENT FROM DATABASE BASED ON PAGE AND LIMIT
      const options = {
        page: req.query.page,
        limit: req.query.limit,
        sort: {
          _id: -1
        },
      };
      Block.paginate({}, options, function (err, result) {
        if(result.docs.length>0)
        return res.status(200).send({Length: result.docs.length, Data: result.docs});
        else
        return res.status(404).send({Message: "Blocks Not Found"}) 
      });
    } else { // IF PAGE NUMBER AND LIMIT IS NOT GIVEN, FETCHES THE LAST 10 DOCUMENTS FROM DATABASE AS PAGE 1 AND LIMIT 10
      const options = {
        page: 1,
        limit: 10,
        sort: {
          _id: -1
        },
      };
      Block.paginate({}, options, function (err, result) {
        if(result.docs.length>0)
          return res.status(200).send({Length: result.docs.length, Data: result.docs});
        else
        return res.status(404).send({Message: "Blocks Not Found"}) 
      });
    }
  },

};