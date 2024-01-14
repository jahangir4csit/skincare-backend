const express = require("express");
const router = express.Router();
const {
  setting,
  getSettings,
  addVariation,
} = require("../controllers/settingsController");

router.get("/", getSettings);
router.put("/setSetting", setting);
router.put("/addVariation", addVariation);

module.exports = router;
