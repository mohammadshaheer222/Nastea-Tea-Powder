const express = require("express");
const { addToCart } = require("../Controllers/cartController");
const isAuth = require("../Middlewares/authMiddleware");
const router = express.Router();

router.route("/").post(isAuth, addToCart);

module.exports = router;
