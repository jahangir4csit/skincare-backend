const express = require("express");
const router = express.Router();
const {
  verifyIsLoggedIn,
  verifyIsAdmin,
} = require("../middleware/verifyAuthToken");
const {
  getUsers,
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
  writeReview,
  getUser,
  updateUser,
  deleteUser,
  addShippingAddress,
  getShippingAddress,
  getShippingAddressById,
  updateShippingAddress,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);

// user logged in routes:
router.use(verifyIsLoggedIn);
router.put("/profile", updateUserProfile);
router.get("/profile/:id", getUserProfile);
router.post("/review/:productId", writeReview);

router.post("/shippingAddress", addShippingAddress);
router.get("/shippingAddress", getShippingAddress);
router.get("/shippingAddressById/:addressId", getShippingAddressById);
router.put("/shippingUpdate/:addressId", updateShippingAddress);

// admin routes:
router.use(verifyIsAdmin);
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
