// IMPORT FILES
const config = require("../config/index")
const {
  Node
} = require("./node")

// IMPORT LIBRARIES
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// SCHEMA
const block = new mongoose.Schema({
  block_meta: {
    block_id: {
      hash: String,
      parts: {
        total: String,
        hash: String
      },
    },
    header: {
      version: {
        block: String,
        app: String
      },
      chain_id: String,
      height: String,
      time: String,
      num_txs: String,
      total_txs: String,
      last_block_id: {
        hash: String,
        parts: {
          total: String,
          hash: String
        }
      },
      last_commit_hash: String,
      data_hash: String,
      validators_hash: String,
      next_validators_hash: String,
      consensus_hash: String,
      app_hash: String,
      last_results_hash: String,
      evidence_hash: String,
      proposer_address: String,
    },
  },
  block: {
    header: {
      version: {
        block: String,
        app: String
      },
      chain_id: String,
      height: String,
      time: String,
      num_txs: String,
      total_txs: String,
      last_block_id: {
        hash: String,
        parts: {
          total: String,
          hash: String
        },
      },
      last_commit_hash: String,
      data_hash: String,
      validators_hash: String,
      next_validators_hash: String,
      consensus_hash: String,
      app_hash: String,
      last_results_hash: String,
      evidence_hash: String,
      proposer_address: String,
    },
    data: {
      txs: [],
    },
    evidence: {
      evidence: String
    },
    last_commit: {
      block_id: {
        hash: String,
        parts: {
          total: String,
          hash: String
        },
      },
      precommits: [{
        type: {
          type: Number
        },
        height: String,
        round: String,
        block_id: {
          hash: String,
          parts: {
            total: String,
            hash: String
          },
        },
        timestamp: String,
        validator_address: String,
        validator_index: String,
        signature: String
      }]
    }
  },
});
block.post('save', async function (doc) {
  let lastFiveBlocks = await Block.find({}).sort({
    _id: -1
  }).limit(5)
  let node = await Node.findOne()
  config.Emmiter.emit('dashboard', {
    Network: node,
    'Latest Blocks': lastFiveBlocks[0]
  });
  config.Emmiter.emit('latestBlocks', {
    Height: lastFiveBlocks
  });
});
block.plugin(mongoosePaginate);
const Block = mongoose.model('Block', block);
module.exports = {
  Block
}