const mongoose = require("mongoose");
const User = require("./UserModel");
const Product = require("./ProductModel");

const orderSchema = mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: User,
    },
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String },
      phone: { type: String, required: true },
    },
    shippingAddress: {
      type: Object,
      required: true,
    },
    // discount: voucherCode, comment, amount
    discount: {
      type: Object,
      required: true,
    },
    // orderTotal: {
    //   itemsCount: { type: Number, required: true },
    //   cartSubtotal: { type: Number, required: true },
    // },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: Product,
        },
        productName: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        thumbImage: { type: String },
        quantity: { type: Number, required: true },
        color: { type: String },
        size: { type: String },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    subtotalAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
    },
    totalItem: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    transactionData: {
      type: Object,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    status: {
      // Order status (e.g., Pending, Shipped, Delivered)
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
Order.watch().on("change", (data) => {
  if (data.operationType === "insert") {
    io.emit("newOrder", data.fullDocument);
  }
});
module.exports = Order;

// const orderSchema = mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: User,
//     },
//     orderTotal: {
//       itemsCount: { type: Number, required: true },
//       cartSubtotal: { type: Number, required: true },
//     },
//     cartItems: [
//       {
//         name: { type: String, required: true },
//         price: { type: Number, required: true },
//         image: { path: { type: String, required: true } },
//         quantity: { type: Number, required: true },
//         count: { type: Number, required: true },
//       },
//     ],
//     paymentMethod: {
//       type: String,
//       required: true,
//     },
//     transactionResult: {
//       status: { type: String },
//       createTime: { type: String },
//       amount: { type: Number },
//     },
//     isPaid: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },
//     paidAt: {
//       type: Date,
//     },
//     isDelivered: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },
//     deliveredAt: {
//       type: Date,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );
