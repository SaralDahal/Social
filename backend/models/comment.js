import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
        complaint: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Complaint',
        },
        text: {
            type: String,
            required: [true, 'Comment cannot be empty'],
            maxlength: [500, 'Comment cannot be more than 500 characters'],
        },
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
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

// Ensure comment belongs to either a post or complaint
commentSchema.pre('save', function (next) {
    if (!this.post && !this.complaint) {
        next(new Error('Comment must be associated with a post or complaint'));
    }
    if (this.post && this.complaint) {
        next(new Error('Comment cannot be associated with both post and complaint'));
    }
    next();
});

export default mongoose.model('Comment', commentSchema);