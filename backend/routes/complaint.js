import express from 'express';
import {
    getComplaints,
    getComplaint,
    createComplaint,
    updateComplaint,
    updateComplaintStatus,
    voteComplaint,
    deleteComplaint,
} from '../controller/complaintController.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/')
    .get(getComplaints)
    .post(protect, upload.array('images', 5), createComplaint);

router.route('/:id')
    .get(getComplaint)
    .put(protect, upload.array('images', 5), updateComplaint)
    .delete(protect, deleteComplaint);

router.patch('/:id/status', protect, admin, updateComplaintStatus);
router.post('/:id/vote', protect, voteComplaint);

export default router;
