import mongoose from 'mongoose';

const searchAttemptSchema = new mongoose.Schema({
    route: {
        type: String,
        required: true,
        index: true,
    },
    user_id: {
        type: String,
        required: true,
        index: true,
    },
    from_city: {
        type: String,
        required: true,
    },
    to_city: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true,
    },
}, {
    timestamps: true,
});

// Compound index for efficient querying by route and user
searchAttemptSchema.index({ route: 1, user_id: 1, timestamp: -1 });

export default mongoose.model('SearchAttempt', searchAttemptSchema);
