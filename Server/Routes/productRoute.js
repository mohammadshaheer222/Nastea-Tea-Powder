const express = require("express");
const {
  createProduct,
  getAllProducts,
} = require("../Controllers/productController");
const isAuth = require("../Middlewares/authMiddleware");
const { upload } = require("../multer");
const router = express.Router();

router
  .route("/")
  .get(isAuth, getAllProducts)
  .post(isAuth, upload.single("file"), createProduct)
  .patch()
  .delete();

module.exports = router;
