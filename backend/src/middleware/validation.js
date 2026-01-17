import { AppError } from './errorHandler.js';

export const validateFlightSearch = (req, res, next) => {
    const { from, to } = req.query;

    if (!from || !to) {
        throw new AppError('Both departure (from) and arrival (to) cities are required', 400);
    }

    if (from === to) {
        throw new AppError('Departure and arrival cities cannot be the same', 400);
    }

    next();
};

export const validateBooking = (req, res, next) => {
    const {passenger_name, flight_id } = req.body;
    const user_id = req.user?.id || req.user?.user_id;

    if (!user_id || !passenger_name || !flight_id) {
        throw new AppError('user_id, passenger_name, and flight_id are required', 400);
    }

    if (passenger_name.trim().length < 2) {
        throw new AppError('Passenger name must be at least 2 characters', 400);
    }

    next();
};
