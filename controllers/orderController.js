const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const User = require("../models/UserModel");
const ObjectId = require("mongodb").ObjectId;

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: new ObjectId(req.user._id) });

    res.status(200).json({
      status: "success",
      message: "Data find successfully!",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error?.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).orFail();
    res.status(200).json({
      status: "success",
      message: "Data find successfully!",
      order,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error?.message,
    });
  }
};

const orderValidateRule = {
  orderNumber: "required|string",
  customerId: "required|string",
  customerInfo: "required|object",
  shippingAddress: "required|object",
  items: "required|array",
  subtotalAmount: "required|integer",
  totalAmount: "required|integer",
  paymentMethod: "required|string",
  discount: "required|object",
};
const createOrder = async (req, res) => {
  try {
    const {
      orderNumber,
      customerId,
      customerInfo,
      shippingAddress,
      items,
      totalAmount,
      paymentMethod,
      discount,
      subtotalAmount,
      totalItem,
    } = req.body;

    if (!customerInfo || !items || !paymentMethod) {
      throw new Error("All inputs are required!");
    }

    if (items.length > 0) {
      items.map(async (item) => {
        await Product.updateOne(
          {
            _id: new ObjectId(item.productId),
            "attributes.id": item.itemId,
          },
          {
            $inc: {
              "attributes.$.availableStock": -Number(item.quantity),
              "attributes.$.sold": Number(item.quantity),
            },
          }
        );
      });
    }
    const createdOrder = await new Order({
      orderNumber,
      customerId,
      customerInfo,
      shippingAddress,
      items,
      subtotalAmount,
      totalAmount,
      paymentMethod,
      discount,
      totalItem,
      paidAmount: 0,
    }).save();

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "order created!",
      data: createdOrder,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: err?.message,
    });
  }
};

const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).orFail();
    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.send(updatedOrder);
  } catch (err) {
    next(err);
  }
};

const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).orFail();
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.send(updatedOrder);
  } catch (err) {
    next(err);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("user", "-password")
      .sort({ paymentMethod: "desc" });
    res.send(orders);
  } catch (err) {
    next(err);
  }
};

const getOrderForAnalysis = async (req, res, next) => {
  try {
    const start = new Date(req.params.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(req.params.date);
    end.setHours(23, 59, 59, 999);

    const order = await Order.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    }).sort({ createdAt: "asc" });
    res.send(order);
  } catch (err) {
    next(err);
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    res.status(200).json({
      status: "success",
      message: "Data find successfully!",
      orders,
    });
  } catch (error) {
    console.log(error);
    // res.status(500).json({
    //   status: "error",
    //   message: error?.message,
    // });
  }
};

module.exports = {
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  getOrderForAnalysis,
  orderValidateRule,
  getAllOrders,
};
