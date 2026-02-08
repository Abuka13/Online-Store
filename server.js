/*require('dotenv').config();
const express = require('express');
const connectDB = require('./app/config/db.config');

const authRoutes = require('./app/routes/auth.routes');
const userRoutes = require('./app/routes/user.routes');
const productRoutes = require('./app/routes/product.routes');

const app = express();

app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
old code
*/

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./app/config/db.config");

const authRoutes = require("./app/routes/auth.routes");
const userRoutes = require("./app/routes/user.routes");
const productRoutes = require("./app/routes/product.routes");
const cartRoutes = require("./app/routes/cart.routes");
const categoryRoutes = require("./app/routes/category.routes");
const orderRoutes = require("./app/routes/order.routes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
