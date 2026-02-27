import Complaint from '../models/complaint.js';
import Comment from '../models/comment.js';

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Public
export const getComplaints = async (req, res) => {
    try {
        const { locality, category, status, priority, page = 1, limit = 10 } = req.query;

        const query = {};

        if (locality) {
            query.locality = locality;
        }

        if (category) {
            query.category = category;
        }

        if (status) {
            query.status = status;
        }

        if (priority) {
            query.priority = priority;
        }

        const complaints = await Complaint.find(query)
            .populate('user', 'name locality avatar')
            .populate('assignedTo', 'name')
            .sort({ voteCount: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Complaint.countDocuments(query);

        res.json({
            complaints,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Public
export const getComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('user', 'name locality avatar')
            .populate('assignedTo', 'name email')
            .populate('statusHistory.updatedBy', 'name');

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create complaint
// @route   POST /api/complaints
// @access  Private
export const createComplaint = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            priority,
            locality,
            address,
            department,
            latitude,
            longitude,
        } = req.body;

        // Handle uploaded images
        const images = req.files ? req.files.map((file) => file.path) : [];

        const complaintData = {
            user: req.user._id,
            title,
            description,
            category,
            priority,
            locality,
            address,
            department,
            images,
        };

        // Add location if coordinates provided
        if (latitude && longitude) {
            complaintData.location = {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
            };
        }

        const complaint = await Complaint.create(complaintData);

        const populatedComplaint = await Complaint.findById(complaint._id).populate(
            'user',
            'name locality avatar'
        );

        res.status(201).json(populatedComplaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update complaint
// @route   PUT /api/complaints/:id
// @access  Private
export const updateComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Check ownership
        if (complaint.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this complaint' });
        }

        const { title, description, category, priority, locality, address } = req.body;

        complaint.title = title || complaint.title;
        complaint.description = description || complaint.description;
        complaint.category = category || complaint.category;
        complaint.priority = priority || complaint.priority;
        complaint.locality = locality || complaint.locality;
        complaint.address = address || complaint.address;

        // Handle new images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((file) => file.path);
            complaint.images = [...complaint.images, ...newImages];
        }

        const updatedComplaint = await complaint.save();
        const populatedComplaint = await Complaint.findById(updatedComplaint._id)
            .populate('user', 'name locality avatar')
            .populate('assignedTo', 'name');

        res.json(populatedComplaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update complaint status
// @route   PATCH /api/complaints/:id/status
// @access  Private (Admin)
export const updateComplaintStatus = async (req, res) => {
    try {
        const { status, comment, assignedTo } = req.body;

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Update status
        complaint.status = status;

        // Add to status history
        complaint.statusHistory.push({
            status,
            comment,
            updatedBy: req.user._id,
        });

        // If resolved, set resolved date
        if (status === 'Resolved') {
            complaint.resolvedAt = Date.now();
        }

        // Assign to user if provided
        if (assignedTo) {
            complaint.assignedTo = assignedTo;
        }

        const updatedComplaint = await complaint.save();
        const populatedComplaint = await Complaint.findById(updatedComplaint._id)
            .populate('user', 'name locality avatar')
            .populate('assignedTo', 'name')
            .populate('statusHistory.updatedBy', 'name');

        res.json(populatedComplaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Vote on complaint
// @route   POST /api/complaints/:id/vote
// @access  Private
export const voteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        const userId = req.user._id;
        const voteIndex = complaint.upvotes.indexOf(userId);

        if (voteIndex > -1) {
            // Remove vote
            complaint.upvotes.splice(voteIndex, 1);
        } else {
            // Add vote
            complaint.upvotes.push(userId);
        }

        await complaint.save();

        res.json({
            voteCount: complaint.voteCount,
            upvotes: complaint.upvotes.length,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private
export const deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Check ownership
        if (complaint.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this complaint' });
        }

        await complaint.deleteOne();

        // Delete associated comments
        await Comment.deleteMany({ complaint: complaint._id });

        res.json({ message: 'Complaint deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};