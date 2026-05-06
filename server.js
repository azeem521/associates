const express = require("express");
const sequelize = require("./config/db");
require("dotenv").config();
const User = require("./models/user.model");
const Product = require("./models/product.model");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const Cart = require("./models/cart.model");
const cartRoutes = require("./routes/cart.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const CartProduct = require("./models/cartProduct.model");


const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);

const PORT = process.env.PORT || 5000;

// ✅ ==================  ASSOCIATIONS  ==================

// User ↔ Cart (1 to 1)
User.hasOne(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

// Cart ↔ Product (Many to Many)

Cart.belongsToMany(Product, { through: CartProduct });
Product.belongsToMany(Cart, { through: CartProduct });


// Wishlist (with alias to avoid conflict)
User.belongsToMany(Product, {
  through: "Wishlist",
  as: "WishlistProducts",
  foreignKey: "userId",
});

Product.belongsToMany(User, {
  through: "Wishlist",
  as: "UsersWishlist",
  foreignKey: "productId",
});

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