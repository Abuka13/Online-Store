require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./app/config/db.config");

const app = express();


app.use(cors());
app.use(express.json());


app.use("/api/auth", require("./app/routes/auth.routes"));


connectDB();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});