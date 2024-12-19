const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "no description yet",
    },
    price: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      default: 0,
      required: true,
    },
    sales: {
      type: Number,
      default: 0,
    },
    returns: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    quantityAlert: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
