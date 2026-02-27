import express from 'express';
import {
    getPostComments,
    getComplaintComments,
    createPostComment,
    createComplaintComment,
    updateComment,
    deleteComment,
} from '../controller/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Post comments
router.route('/posts/:postId')
    .get(getPostComments)
    .post(protect, createPostComment);

// Complaint comments
router.route('/complaints/:complaintId')
    .get(getComplaintComments)
    .post(protect, createComplaintComment);

// Individual comment operations
router.route('/:id')
    .put(protect, updateComment)
    .delete(protect, deleteComment);

export default router;
