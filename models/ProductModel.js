const mongoose = require("mongoose");
const Review = require("./ReviewModel");
const imageSchema = mongoose.Schema({
  path: { type: String, required: true },
});

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    // type : single, variant
    type: {
      type: String,
      required: true,
    },
    // count: {
    //   type: Number,
    //   required: true,
    // },
    // price: {
    //   type: Number,
    //   required: true,
    // },
    rating: {
      type: Number,
    },
    reviewsNumber: {
      type: Number,
    },
    attributes: [],
    thumbnail: {
      type: String,
      required: true,
    },
    images: [imageSchema],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Review,
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);

productSchema.index(
  { name: "text", description: "text" },
  { name: "TextIndex" }
);
productSchema.index({ "attrs.key": 1, "attrs.value": 1 });
// productSchema.index({name: -1})

module.exports = Product;
