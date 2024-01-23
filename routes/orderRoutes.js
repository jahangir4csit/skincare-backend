const express = require("express");
const router = express.Router();
const {
  verifyIsLoggedIn,
  verifyIsAdmin,
} = require("../middleware/verifyAuthToken");
const { validate } = require("../middleware/validation");
const {
  getUserOrders,
  getOrderById,
  createOrder,
  orderValidateRule,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  getOrderForAnalysis,
  addShippingAddress,
  getShippingAddress,
  getShippingAddressById,
  getAllOrders,
} = require("../controllers/orderController");

// router.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
//   next();
// });

// user routes
router.use(verifyIsLoggedIn);
router.get("/", getUserOrders);
router.get("/order/:id", getOrderById);
router.post("/", validate(orderValidateRule), createOrder);
router.put("/paid/:id", updateOrderToPaid);
router.post("/shippingAddress", addShippingAddress);
router.get("/shippingAddress", getShippingAddress);
router.get("/shippingAddressById/:id", getShippingAddressById);
// router.get("/", getShippingAddress);

// admin routes
router.use(verifyIsAdmin);
router.put("/delivered/:id", updateOrderToDelivered);
router.get("/admin", getOrders);
router.get("/analysis/:date", getOrderForAnalysis);
router.get("/allOrders", getAllOrders);

module.exports = router;
