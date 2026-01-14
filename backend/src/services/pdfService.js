import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate a PDF ticket for a booking
 * @param {Object} bookingData - Booking information
 * @returns {Promise<string>} Path to generated PDF
 */
export const generateTicket = async (bookingData) => {
    const {
        pnr,
        passenger_name,
        airline,
        flight_id,
        departure_city,
        arrival_city,
        final_price,
        booked_at,
    } = bookingData;

    // Ensure tickets directory exists
    const ticketsDir = path.join(__dirname, '../../tickets');
    if (!fs.existsSync(ticketsDir)) {
        fs.mkdirSync(ticketsDir, { recursive: true });
    }

    const filename = `ticket_${pnr}.pdf`;
    const filepath = path.join(ticketsDir, filename);

    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const stream = fs.createWriteStream(filepath);

            doc.pipe(stream);

            // Header
            doc
                .fontSize(24)
                .font('Helvetica-Bold')
                .text('FLIGHT TICKET', { align: 'center' })
                .moveDown(0.5);

            // Divider
            doc
                .moveTo(50, doc.y)
                .lineTo(550, doc.y)
                .stroke()
                .moveDown(1);

            // PNR (most important)
            doc
                .fontSize(14)
                .font('Helvetica-Bold')
                .text('PNR: ', { continued: true })
                .fontSize(18)
                .font('Helvetica')
                .text(pnr)
                .moveDown(1);

            // Passenger Details
            doc
                .fontSize(14)
                .font('Helvetica-Bold')
                .text('Passenger Name: ', { continued: true })
                .font('Helvetica')
                .text(passenger_name)
                .moveDown(0.5);

            // Flight Details
            doc
                .font('Helvetica-Bold')
                .text('Airline: ', { continued: true })
                .font('Helvetica')
                .text(airline)
                .moveDown(0.5);

            doc
                .font('Helvetica-Bold')
                .text('Flight ID: ', { continued: true })
                .font('Helvetica')
                .text(flight_id)
                .moveDown(1);

            // Route
            doc
                .fontSize(16)
                .font('Helvetica-Bold')
                .text('Route', { underline: true })
                .moveDown(0.3);

            doc
                .fontSize(14)
                .font('Helvetica')
                .text(`${departure_city}  →  ${arrival_city}`, { align: 'center' })
                .moveDown(1);

            // Price
            doc
                .fontSize(14)
                .font('Helvetica-Bold')
                .text('Amount Paid: ', { continued: true })
                .fontSize(16)
                .font('Helvetica')
                .text(`₹${final_price.toFixed(2)}`)
                .moveDown(1);

            // Booking Date
            doc
                .fontSize(12)
                .font('Helvetica-Bold')
                .text('Booking Date & Time: ', { continued: true })
                .font('Helvetica')
                .text(new Date(booked_at).toLocaleString('en-IN'))
                .moveDown(2);

            // Footer
            doc
                .moveTo(50, doc.y)
                .lineTo(550, doc.y)
                .stroke()
                .moveDown(0.5);

            doc
                .fontSize(10)
                .font('Helvetica')
                .text('Thank you for booking with us!', { align: 'center' })
                .moveDown(0.3)
                .text('Please carry a valid ID proof during travel.', { align: 'center' });

            doc.end();

            stream.on('finish', () => {
                resolve(filepath);
            });

            stream.on('error', (error) => {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
};
