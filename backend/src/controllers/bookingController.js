import { createBooking, getBookingHistory } from '../services/bookingService.js';
import { getWalletBalance } from '../services/walletService.js';
import Booking from '../models/Booking.js';

/**
 * Create a new booking
 * POST /api/book
 */
export const createBookingController = async (req, res, next) => {
    try {
        const { passenger_name, flight_id } = req.body;
        const user_id = req.user.userId; // Get from authenticated user

        const result = await createBooking(user_id, passenger_name, flight_id);

        res.status(201).json({
            success: true,
            message: 'Booking confirmed successfully',
            data: {
                booking_id: result.booking.booking_id,
                pnr: result.booking.pnr,
                passenger_name: result.booking.passenger_name,
                flight_id: result.booking.flight_id,
                final_price: result.booking.final_price,
                booked_at: result.booking.booked_at,
                pdf_download: `/api/download/${result.booking.pnr}`,
                surge_applied: result.surgeApplied,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get booking history for a user
 * GET /api/bookings
 */
export const getBookingHistoryController = async (req, res, next) => {
    try {
        const user_id = req.user.userId; // Get from authenticated user

        const bookings = await getBookingHistory(user_id);

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get current wallet balance
 * GET /api/wallet
 */
export const getWalletBalanceController = async (req, res, next) => {
    try {
        const user_id = req.user.userId; // Get from authenticated user

        const balance = await getWalletBalance(user_id);

        res.status(200).json({
            success: true,
            data: {
                user_id,
                balance,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Download PDF ticket
 * GET /api/download/:pnr
 */
export const downloadTicketController = async (req, res, next) => {
    try {
        const { pnr } = req.params;

        // Find booking by PNR
        const booking = await Booking.findOne({ pnr });

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Ticket not found',
            });
        }

        // Send PDF file as download
        res.download(booking.pdf_path, `ticket_${pnr}.pdf`);
    } catch (error) {
        next(error);
    }
};
