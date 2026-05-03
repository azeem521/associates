const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

exports.addToCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // find or create cart
        let cart = await Cart.findOne({ where: { userId } });

        if (!cart) {
            cart = await Cart.create({ userId });
        }

        // find product
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // 🔥 association method
        await cart.addProduct(product);

        res.status(200).json({
            message: "Product added to cart",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get cart with products
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
};