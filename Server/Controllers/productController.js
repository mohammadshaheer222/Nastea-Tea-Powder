const Product = require("../Model/productModel");
const catchAsynErrors = require("../Middlewares/catchAsynErrors");
const ErrorHandler = require("../Utils/ErrorHandler");
const path = require("path");

//get all products - get
const getAllProducts = catchAsynErrors(async (req, res, next) => {
  try {
    const product = await Product.find({});
    res.status(200).json({ success: true, product });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

//create a product - post
const createProduct = catchAsynErrors(async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(new ErrorHandler("Unauthorized", 403));
    }

    const { title, description, category, offer_price, price, stock } =
      req.body;

    if (
      !title ||
      !description ||
      !category ||
      !offer_price ||
      !price ||
      !stock
    ) {
      return next(new ErrorHandler("Please provide all fields", 400));
    }

    const fileName = req.file.filename;
    const filePath = path.join(fileName);

    if (!fileName) {
      return next(new ErrorHandler("Please provide image", 400));
    }

    const product = await Product.create({
      title,
      description,
      category,
      offer_price,
      price,
      stock,
      image: filePath,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = { getAllProducts, createProduct };
