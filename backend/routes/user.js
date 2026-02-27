import { Router } from 'express';
const router = Router();
import { getUsers, getEmployees, getUser, updateUser, deleteUser } from '../controller/userController.js';
import { protect, admin } from '../middleware/auth.js';

router.get('/', protect, admin('admin'), getUsers);
router.get('/employees', protect, admin('admin'), getEmployees);

router.route('/:id')
    .get(protect, admin('admin'), getUser)
    .put(protect, admin('admin'), updateUser)
    .delete(protect, admin('admin'), deleteUser);

export default router;