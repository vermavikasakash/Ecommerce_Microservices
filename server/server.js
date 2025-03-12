const express = require("express");
require("colors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const authRoute = require("./routes/authRoute");
const cors = require("cors");

//rest object
const app = express();

// configure env
dotenv.config();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api", authRoute);

//rest api
app.get("/", (req, res) => {
  res.send("<h1>Server is running for Machine Test</h1>");
});

const PORT = process.env.PORT || 8080;
const dev = process.env.DEV_MODE;

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`server run on ${dev} port ${PORT}`.bgRed);
});
