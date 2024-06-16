const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
    },

    offer_price: {
      type: Number,
      required: true,
    },
    
    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    // sold: {
    //   type: Number,
    //   required: true,
    // },

    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("product", productSchema);
