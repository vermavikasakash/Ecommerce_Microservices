const express = require("express");
const {
  getProductController,
  postProductController,
} = require("../controllers/authController");

//router object
const router = express.Router();

//routing

// ! POST ORDER  (METHOD POST)
router.post("/postOrders", postProductController);

// ! GET PRODUCTS  (METHOD GET)
router.get("/getProducts", getProductController);

module.exports = router;
