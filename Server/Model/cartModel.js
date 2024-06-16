const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

module.exports = mongoose.model("cart", cartSchema);
