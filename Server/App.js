const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

require("dotenv").config({ path: "Config/.env" });

app.use(express.json());
app.use(cookieParser());
app.use("/", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));

//routes
const userRoute = require("./Routes/userRoute");
const productRoute = require("./Routes/productRoute");
const cartRoute = require("./Routes/cartRoute");

app.use("/api/v2/users", userRoute);
app.use("/api/v2/products", productRoute);
app.use("/api/v2/cart", cartRoute);

//database connection
const { connectDatabase } = require("./DB/database");
connectDatabase();

//for error handling
const ErrorMiddleware = require("./Middlewares/Error");

app.use(ErrorMiddleware);

//create Server
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server is listening on http://localhost:${port}`)
);
