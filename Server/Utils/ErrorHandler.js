class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor); //our error will not leave in captureStackTrace ,captureStackTrace omit the errors,our errors will manipulate our own
  }
}

module.exports = ErrorHandler;
