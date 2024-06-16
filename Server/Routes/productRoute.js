const express = require("express");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateStock,
  deleteProduct,
} = require("../Controllers/productController");
const isAuth = require("../Middlewares/authMiddleware");
const { upload } = require("../multer");
const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(isAuth, upload.single("file"), createProduct);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch(isAuth, updateStock)
  .delete(isAuth, deleteProduct);

module.exports = router;
