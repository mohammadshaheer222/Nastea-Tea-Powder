const ErrorHandler = require("../Utils/ErrorHandler");

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "Internal Server Error";

  //wrong mongodb id error
  if (error.name === "CastError") {
    const message = `Resources not found with this id.. Invalid ${error.path}`;
    error = new ErrorHandler(message, 400);
  }

  //duplicate keys or email error
  if (error.code === 11000) {
    //eeth vech venelum check cheyyaam
    const message = `Duplicate key ${Object.keys(error.keyValue)} Entered`;
    error = new ErrorHandler(message, 11000);
  }

  //wrong jwt
  if ((error.name === "JsonWebTokenError")) {
    const message = `Your URL is invalid`;
    error = new ErrorHandler(message, 400);
  }

  //jwt expired
  if (error.name === "TokenExpiredError") {
    const message = "Your URL is Expired"; //URL means token
    error = new ErrorHandler(message, 400);
  }
  res.status(error.statusCode).json({ success: false, message: error.message });
};
