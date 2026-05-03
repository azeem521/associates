const Product = require("../models/product.model");

exports.createProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;

        const product = await Product.create({
            name,
            price,
            description,
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};