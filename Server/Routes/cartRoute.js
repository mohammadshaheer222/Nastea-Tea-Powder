const express = require("express");
const {
  addToCart,
  getCart,
  removeFromCart,
} = require("../Controllers/cartController");
const isAuth = require("../Middlewares/authMiddleware");
const router = express.Router();

router.route("/").post(isAuth, addToCart).get(isAuth, getCart);
router.route("/:id").delete(isAuth, removeFromCart)

module.exports = router;
