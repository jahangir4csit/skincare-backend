const Settings = require("../models/settingsModel");
const ObjectId = require("mongodb").ObjectId;

const getSettings = async (req, res) => {
  try {
    const setting = await Settings.findOne();
    res.status(200).json({
      status: "success",
      message: "successfully",
      data: setting,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error?.message,
    });
  }
};
const setting = async (req, res) => {
  const { defaultEmail, siteName, defaultPhone } = req.body;
  try {
    const setting = await Settings.findOne();

    let info;
    if (setting) {
      info = await Settings.findOneAndUpdate(
        { _id: setting._id },
        { defaultEmail, siteName, defaultPhone },
        { new: true }
      );
    } else {
      info = await Settings({
        defaultEmail,
        siteName,
        defaultPhone,
      }).save();
    }

    res.status(200).json({
      status: "success",
      message: "successfully",
      data: info,
    });
  } catch (error) {
    if (err.code === 11000) {
      res.status(500).json({
        status: "error",
        message: `Duplicate Data ${
          err.keyValue[`${Object.keys(err.keyValue)}`]
        }`,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }
};

const addVariation = async (req, res) => {
  try {
    const { variation } = req.body;
    const setting = await Settings.findOne();
    if (!setting) {
      throw new Error("Setting data not found!");
    }
    const isExist = await Settings.countDocuments({
      "proVariationLabel.label": variation.label,
    });
    let info;
    if (!isExist) {
      info = await Settings.findOneAndUpdate(
        { _id: setting._id },
        { $push: { proVariationLabel: variation } },
        { new: true }
      );
    } else {
      info = await Settings.findOneAndUpdate(
        { _id: setting._id, "proVariationLabel.label": variation.label },
        { $set: { "proVariationLabel.$.values": variation.values } },
        { new: true }
      );
    }

    res.status(200).json({
      status: "success",
      message: "Successfully",
      data: info?.proVariationLabel,
    });
  } catch (err) {
    if (err.code === 11000) {
      res.status(500).json({
        status: "error",
        message: `Duplicate Data ${
          err.keyValue[`${Object.keys(err.keyValue)}`]
        }`,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }
};

module.exports = {
  getSettings,
  setting,
  addVariation,
};
