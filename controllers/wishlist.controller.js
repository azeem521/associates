const User = require("../models/user.model");
const Product = require("../models/product.model");

// ✅ Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // 🔥 association method (generated using alias)
    await user.addWishlistProduct(product);

    res.status(200).json({ message: "Added to wishlist" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get wishlist
exports.getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      include: {
        model: Product,
        as: "WishlistProducts",
      },
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};