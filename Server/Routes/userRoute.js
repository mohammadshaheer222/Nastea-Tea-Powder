const express = require("express");
const { register, verifyUser, login, myProfile } = require("../Controllers/userController");
const isAuth = require("../Middlewares/authMiddleware");
const router = express.Router();

router.route("/register").post(register);
router.route("/verifyUser").post(verifyUser);
router.route("/login").post(login);
router.route("/me").get(isAuth, myProfile)

module.exports = router;
