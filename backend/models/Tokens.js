const mongoose = require("mongoose");

const tokensBoughtSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
  },

  pkrAmount: {
    type: Number,
    required: true,
    default: 0,
  },

  tokens: {
    type: Number,
    required: true,
    default: 0,
  },

  paymentMethod: {
    type: String,
    required: true,
  },

  hasRecived: {
    type: Boolean,
    default: false,
    required: true,
  },

  wallletAddress: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("TokensBought", tokensBoughtSchema);
