const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    defaultEmail: {
      type: String,
      required: true,
      unique: true,
    },
    siteName: {
      type: String,
      required: true,
    },
    defaultPhone: {
      type: String,
    },
    headerLogo: {
      type: String,
    },
    footerLogo: {
      type: String,
    },
    emailGateway: {
      type: Object,
    },
    smsGateway: {
      type: Object,
    },
    proVariationLabel: [],
    ip_address: {
      type: String,
    },
  },
  { timestamps: true }
);

const Settings =
  mongoose.models.Setting || mongoose.model("Setting", settingSchema);

// const Review = mongoose.model("Review", reviewSchema);
module.exports = Settings;
