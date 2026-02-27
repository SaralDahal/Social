import { Router } from 'express';
import {
    getUsers,
    getEmployees,
    getUser,
    updateUser,
    deleteUser
} from '../controller/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();

// Admin only routes
router.get('/', protect, admin, getUsers);
router.get('/employees', protect, admin, getEmployees);

router.route('/:id')
    .get(protect, admin, getUser)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

export default router;
