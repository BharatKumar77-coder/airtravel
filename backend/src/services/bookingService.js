import Booking from '../models/Booking.js';
import { nanoid } from 'nanoid';
import { generatePNR } from '../utils/generatePNR.js';
import { getFlightById } from './flightService.js';
import { deductAmount, getWalletBalance } from './walletService.js';
import { generateTicket } from './pdfService.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Create a new booking (simplified - no pricing logic here anymore)
 * @param {string} user_id - User identifier
 * @param {string} passenger_name - Passenger name
 * @param {string} flight_id - Flight identifier
 * @returns {Promise<Object>} Booking details with PDF path
 */
export const createBooking = async (user_id, passenger_name, flight_id) => {
    // 1. Get flight details with current price
    const flight = await getFlightById(flight_id);
    const finalPrice = flight.current_price;

    // 2. Check wallet balance
    const balance = await getWalletBalance(user_id);
    if (balance < finalPrice) {
        throw new AppError(
            `Insufficient wallet balance. Current: ₹${balance.toFixed(2)}, Required: ₹${finalPrice.toFixed(2)}`,
            400
        );
    }

    // 3. Deduct amount from wallet
    await deductAmount(user_id, finalPrice);

    // 4. Generate unique identifiers
    const booking_id = nanoid(12);
    const pnr = generatePNR();

    // 5. Generate PDF ticket
    const pdfPath = await generateTicket({
        pnr,
        passenger_name,
        airline: flight.airline,
        flight_id: flight.flight_id,
        departure_city: flight.departure_city,
        arrival_city: flight.arrival_city,
        final_price: finalPrice,
        booked_at: new Date(),
    });

    // 6. Create booking record
    const booking = await Booking.create({
        booking_id,
        user_id,
        passenger_name,
        flight_id: flight.flight_id,
        final_price: finalPrice,
        pnr,
        booked_at: new Date(),
        pdf_path: pdfPath,
    });

    // Check if surge was applied
    const surgeApplied = flight.current_price > flight.base_price;

    return {
        booking,
        surgeApplied,
        pdfPath,
    };
};

/**
 * Get booking history for a user
 * @param {string} user_id - User identifier
 * @returns {Promise<Array>} Array of bookings
 */
export const getBookingHistory = async (user_id) => {
    const bookings = await Booking.find({ user_id })
        .sort({ booked_at: -1 })
        .lean();

    return bookings;
};

/**
 * Get a single booking by ID
 * @param {string} booking_id - Booking identifier
 * @returns {Promise<Object>} Booking document
 */
export const getBookingById = async (booking_id) => {
    const booking = await Booking.findOne({ booking_id });

    if (!booking) {
        throw new AppError('Booking not found', 404);
    }

    return booking;
};
