const jwt = require("jsonwebtoken");
const catchAsynErrors = require("./catchAsynErrors");
const ErrorHandler = require("../Utils/ErrorHandler");
const User = require("../Model/userModel")

const isAuth = catchAsynErrors(async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next(new ErrorHandler("Not authorized,no token", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id).select("-password");
    next();
    
  } catch (error) {
    return next(new ErrorHandler("Not authorized", 403));
  }
});

module.exports = isAuth;
