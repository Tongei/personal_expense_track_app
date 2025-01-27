import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import expenseRouter from './routes/expense.js'

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load environment variables
dotenv.config();

// Routes
app.use(authRouter);
app.use(expenseRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Something went wrong!' });
});
app.use((req, res) => {
    res.status(404).json({
      message : "Routes Not Found!"
    });
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});