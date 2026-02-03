require('dotenv').config();
const express = require('express');
const connectDB = require('./app/config/db.config');

const authRoutes = require('./app/routes/auth.routes');
const userRoutes = require('./app/routes/user.routes');

const app = express();

app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
