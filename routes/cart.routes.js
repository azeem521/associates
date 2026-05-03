const express = require("express");
const router = express.Router();

const {
    addToCart,
    getCart,
} = require("../controllers/cart.controller");

// add product to cart
router.post("/add", addToCart);

// get cart by user
router.get("/:userId", getCart);

module.exports = router;