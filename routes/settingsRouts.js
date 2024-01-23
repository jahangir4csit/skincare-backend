const express = require("express");
const {
  verifyIsLoggedIn,
  verifyIsAdmin,
} = require("../middleware/verifyAuthToken");
const router = express.Router();
const {
  setting,
  getSettings,
  addVariation,
} = require("../controllers/settingsController");

router.use([verifyIsLoggedIn, verifyIsAdmin]);
router.get("/", getSettings);
router.put("/setSetting", setting);
router.put("/setVariation", addVariation);

module.exports = router;
