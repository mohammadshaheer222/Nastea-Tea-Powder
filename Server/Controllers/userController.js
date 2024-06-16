const User = require("../Model/UserModel");
const ErrorHandler = require("../Utils/ErrorHandler");
const catchAsyncErrors = require("../Middlewares/catchAsynErrors");
const jwt = require("jsonwebtoken");
const sendMail = require("../Utils/sendMail");
const sendToken = require("../Utils/jwtToken");

const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const userEmail = await User.findOne({ email });

  if (userEmail) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const user = { name, email, password };
  const otp = Math.floor(Math.random() * 1000000);
  const activationToken = createActivationToken(user, otp);

  try {
    await sendMail({
      email: user.email,
      subject: "Activate Your Account",
      message: `Please verify your account using this OTP: ${otp}`,
    });
  } catch (error) {
    return next(
      new ErrorHandler("Failed to send email. Please try again later.", 500)
    );
  }

  res.status(200).json({
    success: true,
    message: "OTP sent to your email",
    activationToken,
  });
});

const createActivationToken = (user, otp) => {
  return jwt.sign({ user, otp }, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

const verifyUser = catchAsyncErrors(async (req, res, next) => {
  const { otp, activationToken } = req.body;

  let newUser;
  try {
    newUser = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token", 400));
  }

  if (newUser.otp !== otp) {
    return next(new ErrorHandler("Incorrect OTP", 400));
  }

  const { name, email, password } = newUser.user;
  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorHandler("User already exists", 400));
  }

  user = await User.create({ name, email, password });
  sendToken(user, 201, res);
});

const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorHandler("Please provide both email and password", 400)
    );
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }

  const isPasswordValid = await user.comparePassword(password); // Ensure method exists in User model
  if (!isPasswordValid) {
    return next(new ErrorHandler("Invalid credentials", 400));
  }

  sendToken(user, 200, res);
});

const myProfile = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({ success: true, user });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = { register, verifyUser, login, myProfile };
