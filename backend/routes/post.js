import express from 'express';
import {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    votePost,
} from '../controller/postController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/')
    .get(getPosts)
    .post(protect, upload.array('images', 5), createPost);

router.route('/:id')
    .get(getPost)
    .put(protect, upload.array('images', 5), updatePost)
    .delete(protect, deletePost);

router.post('/:id/vote', protect, votePost);

export default router;
