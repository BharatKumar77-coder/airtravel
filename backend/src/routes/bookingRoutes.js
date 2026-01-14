import express from 'express';
import {
    createBookingController,
    getBookingHistoryController,
    getWalletBalanceController,
    downloadTicketController,
} from '../controllers/bookingController.js';
import { validateBooking } from '../middleware/validation.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/book
router.post('/book', protect, validateBooking, createBookingController);

// GET /api/bookings
router.get('/bookings', protect, getBookingHistoryController);

// GET /api/wallet
router.get('/wallet', protect, getWalletBalanceController);

// GET /api/download/:pnr
router.get('/download/:pnr', downloadTicketController);

export default router;
