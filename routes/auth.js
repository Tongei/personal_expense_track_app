import express from 'express';
import {authenticateToken} from '../middlewares/auth.js'
import { postLogin, postRegister, deleteLogout, getMe } from '../controllers/auth.js'; // Add .js extension

const router = express.Router();

router.post('/api/v1/register', postRegister);

router.post('/api/v1/login', postLogin)

router.delete('/api/v1/logout',authenticateToken, deleteLogout);

//get me
router.get('/api/v1/me',authenticateToken, getMe);




export default router; // Use export default