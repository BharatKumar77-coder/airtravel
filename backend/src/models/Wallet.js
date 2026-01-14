import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 50000,
        min: 0,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Wallet', walletSchema);
