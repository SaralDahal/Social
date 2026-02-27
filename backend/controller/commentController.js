import Comment from '../models/comment.js';
import Post from '../models/post.js';
import Complaint from '../models/complaint.js';

// @desc    Get comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Public
export const getPostComments = async (req, res) => {
    try {
        const comments = await Comment.find({
            post: req.params.postId,
            isActive: true,
        })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get comments for a complaint
// @route   GET /api/complaints/:complaintId/comments
// @access  Public
export const getComplaintComments = async (req, res) => {
    try {
        const comments = await Comment.find({
            complaint: req.params.complaintId,
            isActive: true,
        })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create comment on post
// @route   POST /api/posts/:postId/comments
// @access  Private
export const createPostComment = async (req, res) => {
    try {
        const { text } = req.body;

        // Check if post exists
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = await Comment.create({
            user: req.user._id,
            post: req.params.postId,
            text,
        });

        // Update comment count
        post.commentCount = await Comment.countDocuments({
            post: post._id,
            isActive: true,
        });
        await post.save();

        const populatedComment = await Comment.findById(comment._id).populate(
            'user',
            'name avatar'
        );

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create comment on complaint
// @route   POST /api/complaints/:complaintId/comments
// @access  Private
export const createComplaintComment = async (req, res) => {
    try {
        const { text } = req.body;

        // Check if complaint exists
        const complaint = await Complaint.findById(req.params.complaintId);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        const comment = await Comment.create({
            user: req.user._id,
            complaint: req.params.complaintId,
            text,
        });

        const populatedComment = await Comment.findById(comment._id).populate(
            'user',
            'name avatar'
        );

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check ownership
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this comment' });
        }

        comment.text = req.body.text || comment.text;
        const updatedComment = await comment.save();

        const populatedComment = await Comment.findById(updatedComment._id).populate(
            'user',
            'name avatar'
        );

        res.json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check ownership or admin
        if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        // Soft delete
        comment.isActive = false;
        await comment.save();

        // Update comment count if it's a post comment
        if (comment.post) {
            const post = await Post.findById(comment.post);
            if (post) {
                post.commentCount = await Comment.countDocuments({
                    post: post._id,
                    isActive: true,
                });
                await post.save();
            }
        }

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};