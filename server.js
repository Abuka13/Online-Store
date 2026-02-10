const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");

const connectDB = require("./app/config/db");

const authRoutes = require("./app/routes/auth.routes");
const userRoutes = require("./app/routes/users.routes");
const productRoutes = require("./app/routes/products.routes");
const cartRoutes = require("./app/routes/cart.routes");
const orderRoutes = require("./app/routes/orders.routes");



const notFound = require("./app/middlewares/notFound");
const errorHandler = require("./app/middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Frontend (Vite build)
app.use(express.static(path.join(__dirname, "frontend", "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });
