import express from 'express';
import {authenticateToken} from '../middlewares/auth.js'
import { postExpense,deleteExpense, getExpenseAll,getExpenseById, putExpenseById } from '../controllers/expense.js';

const router = express.Router();

// Create new
router.post('/api/v1/expense', authenticateToken, postExpense);

// Delete 
router.delete('/api/v1/expense/:id',authenticateToken, deleteExpense);

// Getall
router.get("/api/v1/expense", authenticateToken, getExpenseAll);

// Get By Id
router.get("/api/v1/expense/:id", authenticateToken, getExpenseById);

// Update By Id
router.put("/api/v1/expense/:id", authenticateToken, putExpenseById)

export default router;