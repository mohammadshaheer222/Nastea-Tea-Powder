module.exports = (theFunc) => (req, res, next) => {
  Promise.resolve(theFunc(req, res, next)).catch(next); //next means go to next middleware,there is no middlewares written then it goes node js middleware
};


//catchile errror nere pokunnath server.js ath node js therunna error aavond ath velyoru error aakum ath njmmal onn manasilaavunna reethiyil ezhuthunnathaan uncaught exception avde use cheyyunnath