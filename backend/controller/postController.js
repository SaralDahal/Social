import Post from '../models/post.js';
import Comment from '../models/comment.js';

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
    try {
        const { locality, category, page = 1, limit = 10 } = req.query;

        const query = { isActive: true };

        if (locality) {
            query.locality = locality;
        }

        if (category) {
            query.category = category;
        }

        const posts = await Post.find(query)
            .populate('user', 'name locality avatar')
            .sort({ isPinned: -1, voteCount: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Post.countDocuments(query);

        res.json({
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('user', 'name locality avatar');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
    try {
        const { title, description, category, locality, address } = req.body;

        // Handle uploaded images
        const images = req.files ? req.files.map((file) => file.path) : [];

        const post = await Post.create({
            user: req.user._id,
            title,
            description,
            category,
            locality,
            address,
            images,
        });

        const populatedPost = await Post.findById(post._id).populate(
            'user',
            'name locality avatar'
        );

        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check ownership
        if (post.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }

        const { title, description, category, locality, address } = req.body;

        post.title = title || post.title;
        post.description = description || post.description;
        post.category = category || post.category;
        post.locality = locality || post.locality;
        post.address = address || post.address;

        // Handle new images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((file) => file.path);
            post.images = [...post.images, ...newImages];
        }

        const updatedPost = await post.save();
        const populatedPost = await Post.findById(updatedPost._id).populate(
            'user',
            'name locality avatar'
        );

        res.json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check ownership
        if (post.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        // Soft delete
        post.isActive = false;
        await post.save();

        // Delete associated comments
        await Comment.updateMany({ post: post._id }, { isActive: false });

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Vote on post
// @route   POST /api/posts/:id/vote
// @access  Private
export const votePost = async (req, res) => {
    try {
        const { voteType } = req.body; // 'upvote' or 'downvote'
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const userId = req.user._id;
        const upvoteIndex = post.upvotes.indexOf(userId);
        const downvoteIndex = post.downvotes.indexOf(userId);

        // Remove existing votes
        if (upvoteIndex > -1) {
            post.upvotes.splice(upvoteIndex, 1);
        }
        if (downvoteIndex > -1) {
            post.downvotes.splice(downvoteIndex, 1);
        }

        // Add new vote
        if (voteType === 'upvote') {
            post.upvotes.push(userId);
        } else if (voteType === 'downvote') {
            post.downvotes.push(userId);
        }

        await post.save();

        res.json({
            voteCount: post.voteCount,
            upvotes: post.upvotes.length,
            downvotes: post.downvotes.length,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};