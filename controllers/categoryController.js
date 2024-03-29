const Category = require("../models/CategoryModel");

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: "asc" }).orFail();

    res.status(200).json({
      statusCode: 200,
      status: "success",
      categories,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: err?.message,
    });
  }
};

const newCategory = async (req, res, next) => {
  try {
    const { category, description } = req.body;
    if (!category) {
      res.status(300).send({
        statusCode: 300,
        message: "Category input is required",
      });
    }
    const categoryExists = await Category.findOne({ name: category });
    if (categoryExists) {
      res.status(300).send({
        statusCode: 300,
        message: "Category already exists",
      });
    } else {
      const categoryCreated = await Category.create({
        name: category,
        description: description,
      });
      res.status(201).send({
        statusCode: 201,
        message: "Category Created",
        categoryCreated: categoryCreated,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err?.message,
    });
  }
};

const deleteCategory = async (req, res, next) => {
  // return res.send(req.params.category)
  try {
    if (req.params.category !== "Choose category") {
      const categoryExists = await Category.findOne({
        name: decodeURIComponent(req.params.category),
      }).orFail();
      await categoryExists.remove();
      res.status(201).send({
        statusCode: 201,
        status: "success",
        message: "Category Deleted",
        categoryDeleted: true,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err?.message,
    });
  }
};

const saveAttr = async (req, res, next) => {
  const { key, val, categoryChoosen } = req.body;
  if (!key || !val || !categoryChoosen) {
    return res.status(400).send("All inputs are required");
  }
  try {
    const category = categoryChoosen.split("/")[0];
    const categoryExists = await Category.findOne({ name: category }).orFail();
    if (categoryExists.attrs.length > 0) {
      // if key exists in the database then add a value to the key
      var keyDoesNotExistsInDatabase = true;
      categoryExists.attrs.map((item, idx) => {
        if (item.key === key) {
          keyDoesNotExistsInDatabase = false;
          var copyAttributeValues = [...categoryExists.attrs[idx].value];
          copyAttributeValues.push(val);
          var newAttributeValues = [...new Set(copyAttributeValues)]; // Set ensures unique values
          categoryExists.attrs[idx].value = newAttributeValues;
        }
      });

      if (keyDoesNotExistsInDatabase) {
        categoryExists.attrs.push({ key: key, value: [val] });
      }
    } else {
      // push to the array
      categoryExists.attrs.push({ key: key, value: [val] });
    }
    await categoryExists.save();
    let cat = await Category.find({}).sort({ name: "asc" });
    return res.status(201).json({ categoriesUpdated: cat });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err?.message,
    });
  }
};

module.exports = { getCategories, newCategory, deleteCategory, saveAttr };
