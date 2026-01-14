import mongoose from 'mongoose';

const bookingAttemptSchema = new mongoose.Schema({
    flight_id: {
        type: String,
        required: true,
        index: true,
    },
    user_id: {
        type: String,
        required: true,
        index: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true,
    },
}, {
    timestamps: true,
});

// Compound index for efficient querying by flight and user
bookingAttemptSchema.index({ flight_id: 1, user_id: 1, timestamp: -1 });

export default mongoose.model('BookingAttempt', bookingAttemptSchema);
