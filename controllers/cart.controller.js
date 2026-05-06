// const Cart = require("../models/cart.model");
// const Product = require("../models/product.model");

// exports.addToCart = async (req, res) => {
//     try {
//         const { userId, productId } = req.body;

//         // find or create cart
//         let cart = await Cart.findOne({ where: { userId } });

//         if (!cart) {
//             cart = await Cart.create({ userId });
//         }

//         // find product
//         const product = await Product.findByPk(productId);

//         if (!product) {
//             return res.status(404).json({ message: "Product not found" });
//         }

//         // 🔥 association method
//         await cart.addProduct(product);

//         res.status(200).json({
//             message: "Product added to cart",
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // ✅ Get cart with products



const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const CartProduct = require("../models/cartProduct.model");

// ✅ Add to cart with quantity
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      cart = await Cart.create({ userId });
    }

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // check if already exists in cart
    const existing = await CartProduct.findOne({
      where: {
        CartId: cart.id,
        ProductId: product.id,
      },
    });

    if (existing) {
      // 🔥 increase quantity
      existing.quantity += 1;
      await existing.save();
    } else {
      // 🔥 create new entry
      await CartProduct.create({
        CartId: cart.id,
        ProductId: product.id,
        quantity: 1,
      });
    }

    res.status(200).json({ message: "Cart updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔥 remove relation
    await cart.removeProduct(product);

    res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

  exports.getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOne({
            where: { userId },
            include: Product,
        });

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}