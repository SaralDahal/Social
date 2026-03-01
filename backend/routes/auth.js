import { Router } from 'express';
import { register, login, getMe } from '../controller/authController.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

export default router;