import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
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
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Medium',
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
            default: 'Pending',
        },
        locality: {
            type: String,
            required: [true, 'Please add locality'],
        },
        address: {
            type: String,
            required: [true, 'Please add address'],
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
            },
        },
        images: [
            {
                type: String,
            },
        ],
        department: {
            type: String,
            enum: [
                'Municipal Corporation',
                'Health Department',
                'Education Department',
                'Police',
                'Fire Department',
                'Public Works',
                'Electricity Board',
                'Water Authority',
                'Other',
            ],
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        statusHistory: [
            {
                status: String,
                comment: String,
                updatedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                updatedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        resolvedAt: Date,
        upvotes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        voteCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Create geospatial index
complaintSchema.index({ location: '2dsphere' });
complaintSchema.index({ locality: 1, status: 1, createdAt: -1 });

// Update vote count before saving
complaintSchema.pre('save', function (next) {
    this.voteCount = this.upvotes.length;
    next();
});

export default mongoose.model('Complaint', complaintSchema);