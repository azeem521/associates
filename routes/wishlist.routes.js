const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  getWishlist,
} = require("../controllers/wishlist.controller");

router.post("/add", addToWishlist);
router.get("/:userId", getWishlist);

module.exports = router;