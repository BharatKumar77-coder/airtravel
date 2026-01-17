import { createBooking, getBookingHistory } from '../services/bookingService.js';
import { getWalletBalance } from '../services/walletService.js';
import Booking from '../models/Booking.js';
import PDFDocument from "pdfkit";

/**
 Create a new booking
 POST /api/book
 */
export const createBookingController = async (req, res, next) => {
    try {
        const { passenger_name, flight_id } = req.body;
        const user_id = req.user.userId; 
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
Get booking history for a user
GET /api/bookings
 */
export const getBookingHistoryController = async (req, res, next) => {
    try {
        const user_id = req.user.userId; 

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
Get current wallet balance
GET /api/wallet
 */
export const getWalletBalanceController = async (req, res, next) => {
    try {
        const user_id = req.user.userId; 
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
Download PDF ticket
GET /api/download/:pnr
 */
export const downloadTicketController = async (req, res) => {
  try {
    const { pnr } = req.params;

    const booking = await Booking.findOne({ pnr });
    if (!booking) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ticket_${pnr}.pdf`
    );

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc.fontSize(22).text("FLIGHT TICKET", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`PNR: ${booking.pnr}`);
    doc.text(`Passenger: ${booking.passenger_name}`);
    doc.text(`Airline: ${booking.airline}`);
    doc.text(`Flight ID: ${booking.flight_id}`);
    doc.moveDown();

    doc.fontSize(16).text(
      `${booking.departure_city} → ${booking.arrival_city}`,
      { align: "center" }
    );

    doc.moveDown();
    doc.text(`Amount Paid: ₹${booking.final_price}`);
    doc.text(
      `Booked At: ${new Date(booking.booked_at).toLocaleString("en-IN")}`
    );

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate ticket" });
  }
};
