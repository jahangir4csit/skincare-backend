const User = require("../models/UserModel");
const Review = require("../models/ReviewModel");
const Product = require("../models/ProductModel");
const { hashPassword, comparePasswords } = require("../utils/hashPassword");
const generateAuthToken = require("../utils/generateAuthToken");
const ObjectId = require("mongodb").ObjectId;

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      status: "success",
      users,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err?.message,
    });
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, lastName, email, password } = req.body;
    if (!(name && lastName && email && password)) {
      return res.status(400).send("All inputs are required");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(300).json({ status: 300, message: "user exists" });
    } else {
      const hashedPassword = hashPassword(password);
      const user = await User.create({
        name,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      res.status(201).json({
        status: 201,
        message: "User created",
        userCreated: {
          _id: user._id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          isAdmin: user.isAdmin,
          role: user.role,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err?.message,
    });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).send("All inputs are required");
    }

    const user = await User.findOne({ email }).orFail();
    if (user && comparePasswords(password, user.password)) {
      return res.json({
        message: "user logged in",
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        accessToken: generateAuthToken(
          user._id,
          user.name,
          user.lastName,
          user.email,
          user.isAdmin,
          user.role
        ),
      });
    } else {
      return res.status(401).send("wrong credentials");
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err?.message,
    });
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail();
    user.name = req.body.name || user.name;
    user.lastName = req.body.lastName || user.lastName;
    user.phoneNumber = req.body.phoneNumber;
    user.address = req.body.address;
    user.country = req.body.country;
    user.zipCode = req.body.zipCode;
    user.city = req.body.city;
    user.state = req.body.state;
    if (req.body.password !== user.password) {
      user.password = hashPassword(req.body.password);
    }
    await user.save();

    res.json({
      success: "user updated",
      userUpdated: {
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err?.message,
    });
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).orFail();
    return res.send(user);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err?.message,
    });
  }
};

const writeReview = async (req, res, next) => {
  try {
    const session = await Review.startSession();

    // get comment, rating from request.body:
    const { comment, rating } = req.body;
    // validate request:
    if (!(comment && rating)) {
      return res.status(400).send("All inputs are required");
    }

    // create review id manually because it is needed also for saving in Product collection
    const ObjectId = require("mongodb").ObjectId;
    let reviewId = ObjectId();

    session.startTransaction();
    await Review.create(
      [
        {
          _id: reviewId,
          comment: comment,
          rating: Number(rating),
          user: {
            _id: req.user._id,
            name: req.user.name + " " + req.user.lastName,
          },
        },
      ],
      { session: session }
    );

    const product = await Product.findById(req.params.productId)
      .populate("reviews")
      .session(session);

    const alreadyReviewed = product.reviews.find(
      (r) => r.user._id.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send("product already reviewed");
    }

    let prc = [...product.reviews];
    prc.push({ rating: rating });
    product.reviews.push(reviewId);
    if (product.reviews.length === 1) {
      product.rating = Number(rating);
      product.reviewsNumber = 1;
    } else {
      product.reviewsNumber = product.reviews.length;
      let ratingCalc =
        prc
          .map((item) => Number(item.rating))
          .reduce((sum, item) => sum + item, 0) / product.reviews.length;
      product.rating = Math.round(ratingCalc);
    }
    await product.save();

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: "success",
      message: "review created",
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({
      status: "error",
      message: err?.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("name lastName email role")
      .orFail();

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err?.message,
    });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).orFail();

    user.name = req.body.name || user.name;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.role = req.body.role;

    await user.save();

    res.status(200).json({
      status: "success",
      message: "user updated",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err?.message,
    });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).orFail();
    await user.remove();

    res.status(200).json({
      status: "success",
      message: "user removed",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err?.message,
    });
  }
};

//shipping address methods
const addShippingAddress = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const userId = req.user._id;

    const data = await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          shippingAddress: shippingAddress,
        },
      },
      { new: true }
    ).select("shippingAddress");

    res.status(200).send({
      status: "success",
      message: "Successfully",
      data: data.shippingAddress,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: err?.message,
    });
  }
};
const updateShippingAddress = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const userId = req.user._id;
    const { addressId } = req.params;

    const updatedValue = {
      "shippingAddress.$.type": shippingAddress.type,
      "shippingAddress.$.fullName": shippingAddress.fullName,
      "shippingAddress.$.address": shippingAddress.address,
      "shippingAddress.$.country": shippingAddress.country,
      "shippingAddress.$.zipCode": shippingAddress.zipCode,
      "shippingAddress.$.city": shippingAddress.city,
      "shippingAddress.$.state": shippingAddress.state,
    };

    const data = await User.findOneAndUpdate(
      { _id: userId, "shippingAddress.id": Number(addressId) },
      {
        $set: updatedValue,
      },
      { new: true }
    );

    res.status(200).send({
      status: "success",
      message: "Successfully",
      data: data?.shippingAddress,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: err?.message,
    });
  }
};
const getShippingAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const data = await User.findOne({ _id: new ObjectId(userId) }).select(
      "shippingAddress"
    );

    res.status(200).send({
      status: "success",
      message: "Successfully",
      data: data.shippingAddress,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: err?.message,
    });
  }
};
const getShippingAddressById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;
    const data = await User.aggregate([
      { $match: { _id: new ObjectId(userId) } },
      { $unwind: "$shippingAddress" },
      { $match: { "shippingAddress.id": Number(addressId) } },
      {
        $replaceRoot: { newRoot: "$shippingAddress" },
      },
    ]);

    res.status(200).send({
      status: "success",
      message: "Successfully",
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: err?.message,
    });
  }
};

module.exports = {
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
};
