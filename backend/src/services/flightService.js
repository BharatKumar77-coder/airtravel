import Flight from '../models/Flight.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Search for flights between two cities
 * @param {string} from - Departure city code
 * @param {string} to - Arrival city code
 * @returns {Promise<Array>} Array of up to 10 flights
 */
export const searchFlights = async (from, to) => {
    const flights = await Flight.find({
        departure_city: from.toUpperCase(),
        arrival_city: to.toUpperCase(),
    })
        .limit(10)
        .lean();

    if (flights.length === 0) {
        throw new AppError(`No flights found from ${from} to ${to}`, 404);
    }

    return flights;
};

/**
 * Get a single flight by ID
 * @param {string} flight_id - Flight identifier
 * @returns {Promise<Object>} Flight document
 */
export const getFlightById = async (flight_id) => {
    const flight = await Flight.findOne({ flight_id });

    if (!flight) {
        throw new AppError('Flight not found', 404);
    }

    return flight;
};
