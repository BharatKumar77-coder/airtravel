import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
    flight_id: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    airline: {
        type: String,
        required: true,
    },
    departure_city: {
        type: String,
        required: true,
        index: true,
    },
    arrival_city: {
        type: String,
        required: true,
        index: true,
    },
    base_price: {
        type: Number,
        required: true,
        min: 2000,
        max: 3000,
    },
    current_price: {
        type: Number,
        required: true,
    },
    last_price_update: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Compound index for efficient searching
flightSchema.index({ departure_city: 1, arrival_city: 1 });

export default mongoose.model('Flight', flightSchema);
