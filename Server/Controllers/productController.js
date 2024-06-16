const Product = require("../Model/productModel");
const catchAsynErrors = require("../Middlewares/catchAsynErrors");
const ErrorHandler = require("../Utils/ErrorHandler");
const path = require("path");
const fs = require("fs");

//get all products - get
const getAllProducts = catchAsynErrors(async (req, res, next) => {
  try {
    const { search, category, price, page } = req.query; //for filtering products

    const queryObject = {};

    if (search) {
      queryObject.title = { $regex: search, $options: "i" };
    }

    if (category) queryObject.category = category;

    const countProduct = await Product.countDocuments();
    const limit = 4;
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(countProduct / limit);

    const product = await Product.find(queryObject)
      .sort("-createdAt")
      .limit(limit)
      .skip(skip);

    const categories = await Product.distinct("category");
    const mostSelling = await Product.find().sort({ sold: -1 }).limit(3);

    res
      .status(200)
      .json({ success: true, product, totalPages, categories, mostSelling });
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

//get single product = get
const getSingleProduct = catchAsynErrors(async (req, res, next) => {
  try {
    const { id: productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return next(new ErrorHandler(`No product with id: ${productId}`, 404));
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const updateStock = catchAsynErrors(async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    if (req.user.role !== admin) {
      return next(new ErrorHandler("Unauthorized", 403));
    }

    const product = await Product.findById(productId);

    const { stock } = req.body;

    if (!stock) {
      return next(new ErrorHandler("Please provide stock value", 400));
    }

    product.stock = req.body.stock;
    await Product.save();
    res.status(200).json({ success: true, message: "Stock Updated" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

//delete product - delete
const deleteProduct = catchAsynErrors(async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(new ErrorHandler("Unauthorized", 403));
    }
    const { id: productId } = req.params;

    const product = await Product.findOneAndDelete({ _id: productId });

    if (!product) {
      return next(
        new ErrorHandler(`Product not found with id: ${productId}`, 404)
      );
    }

    const imagePath = `uploads/${product.image}`;
    fs.unlink(imagePath, (error) => {
      if (error) {
        return next(new ErrorHandler("Error deleting file", 500));
      }
    });

    res.status(200).json({ success: true, product });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = {
  getAllProducts,
  createProduct,
  getSingleProduct,
  updateStock,
  deleteProduct,
};
