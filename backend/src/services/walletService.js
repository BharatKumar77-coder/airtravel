import Wallet from '../models/Wallet.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Get wallet balance for a user
 * @param {string} user_id - User identifier
 * @returns {Promise<number>} Current balance
 */
export const getWalletBalance = async (user_id) => {
    let wallet = await Wallet.findOne({ user_id });

    // Initialize wallet if it doesn't exist
    if (!wallet) {
        wallet = await initializeWallet(user_id);
    }

    return wallet.balance;
};

/**
 * Initialize a new wallet with default balance
 * @param {string} user_id - User identifier
 * @returns {Promise<Object>} Wallet document
 */
export const initializeWallet = async (user_id) => {
    const defaultBalance = parseFloat(process.env.DEFAULT_WALLET_BALANCE) || 50000;

    const wallet = await Wallet.create({
        user_id,
        balance: defaultBalance,
    });

    return wallet;
};

/**
 * Deduct amount from wallet (atomic operation)
 * @param {string} user_id - User identifier
 * @param {number} amount - Amount to deduct
 * @returns {Promise<Object>} Updated wallet
 */
export const deductAmount = async (user_id, amount) => {
    const wallet = await Wallet.findOne({ user_id });

    if (!wallet) {
        throw new AppError('Wallet not found', 404);
    }

    if (wallet.balance < amount) {
        throw new AppError(
            `Insufficient balance. Current: ₹${wallet.balance.toFixed(2)}, Required: ₹${amount.toFixed(2)}`,
            400
        );
    }

    // Atomic update to prevent race conditions
    const updatedWallet = await Wallet.findOneAndUpdate(
        { user_id, balance: { $gte: amount } },
        { $inc: { balance: -amount } },
        { new: true }
    );

    if (!updatedWallet) {
        throw new AppError('Failed to deduct amount. Insufficient balance.', 400);
    }

    return updatedWallet;
};
