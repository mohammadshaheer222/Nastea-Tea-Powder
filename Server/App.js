const express = require("express");
const app = express();
const bodyParser = require("body-parser");

require("dotenv").config({ path: "Config/.env" });

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
const user = require("./Routes/userRoute");
app.use("/api/v2", user);

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
