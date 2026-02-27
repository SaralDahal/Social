import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Please add a title'],
            trim: true,
            maxlength: [200, 'Title cannot be more than 200 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
            maxlength: [2000, 'Description cannot be more than 2000 characters'],
        },
        category: {
            type: String,
            required: [true, 'Please select a category'],
            enum: [
                'Health',
                'Education',
                'Infrastructure',
                'Environment',
                'Safety',
                'Sanitation',
                'Water',
                'Electricity',
                'Transportation',
                'Other',
            ],
        },
        locality: {
            type: String,
            required: [true, 'Please add locality'],
        },
        address: {
            type: String,
        },
        images: [
            {
                type: String,
            },
        ],
        upvotes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        downvotes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        voteCount: {
            type: Number,
            default: 0,
        },
        commentCount: {
            type: Number,
            default: 0,
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Update vote count before saving
postSchema.pre('save', function (next) {
    this.voteCount = this.upvotes.length - this.downvotes.length;
    next();
});

// Index for faster queries
postSchema.index({ locality: 1, createdAt: -1 });
postSchema.index({ category: 1 });

export default mongoose.model('Post', postSchema);