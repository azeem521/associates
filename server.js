const express = require("express");
const sequelize = require("./config/db");
require("dotenv").config();
const User = require("./models/user.model");
const Product = require("./models/product.model");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const Cart = require("./models/cart.model");
const cartRoutes = require("./routes/cart.routes");


const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 5000;

// ✅ ==================  ASSOCIATIONS  ==================

// User ↔ Cart (1 to 1)
User.hasOne(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

// Cart ↔ Product (Many to Many)
Cart.belongsToMany(Product, { through: "CartProducts" });
Product.belongsToMany(Cart, { through: "CartProducts" });

// ✅ ===========================================================

sequelize
    .authenticate()
    .then(() => {
        console.log("Database connected");

        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log("Tables created");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("Error:", err);
    });