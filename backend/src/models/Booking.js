import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    booking_id: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    user_id: {
        type: String,
        required: true,
        index: true,
    },
    passenger_name: {
        type: String,
        required: true,
    },
    flight_id: {
        type: String,
        required: true,
    },
    final_price: {
        type: Number,
        required: true,
    },
    pnr: {
        type: String,
        required: true,
        unique: true,
    },
    booked_at: {
        type: Date,
        default: Date.now,
    },
    pdf_path: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Booking', bookingSchema);
