import SearchAttempt from '../models/SearchAttempt.js';
import Flight from '../models/Flight.js';

const SURGE_THRESHOLD = 3; // Number of searches before surge
const SURGE_TIME_WINDOW = 5 * 60 * 1000; // 5 minutes in milliseconds
const PRICE_RESET_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds
const SURGE_PERCENTAGE = 0.10; // 10% increase

/**
 * Track a search attempt for surge pricing calculation
 * @param {string} from_city - Departure city
 * @param {string} to_city - Arrival city
 * @param {string} user_id - User identifier
 * @returns {Promise<Object>} SearchAttempt document
 */
export const trackSearchAttempt = async (from_city, to_city, user_id) => {
    const route = `${from_city}-${to_city}`;

    const attempt = await SearchAttempt.create({
        route,
        from_city,
        to_city,
        user_id,
        timestamp: new Date(),
    });

    console.log(`🔍 Search tracked: ${route} by ${user_id}`);
    return attempt;
};

/**
 * Calculate if surge should apply based on search attempts
 * @param {string} from_city - Departure city
 * @param {string} to_city - Arrival city
 * @param {string} user_id - User identifier
 * @returns {Promise<Object>} { shouldApplySurge: boolean, searchCount: number }
 */
export const calculateRouteSurge = async (from_city, to_city, user_id) => {
    const route = `${from_city}-${to_city}`;
    const fiveMinutesAgo = new Date(Date.now() - SURGE_TIME_WINDOW);

    // Count searches by this user for this route in the last 5 minutes
    const searches = await SearchAttempt.find({
        route,
        user_id,
        timestamp: { $gte: fiveMinutesAgo },
    }).sort({ timestamp: -1 });

    const searchCount = searches.length;
    const shouldApplySurge = searchCount >= SURGE_THRESHOLD;

    console.log(`📊 Route ${route}: ${searchCount} searches, surge=${shouldApplySurge}`);

    return { shouldApplySurge, searchCount };
};

/**
 * Reset all flight prices on a route to base price if 10+ minutes have passed
 * @param {string} from_city - Departure city
 * @param {string} to_city - Arrival city
 * @returns {Promise<number>} Number of flights reset
 */
export const resetRoutePricesIfExpired = async (from_city, to_city) => {
    const tenMinutesAgo = new Date(Date.now() - PRICE_RESET_TIME);

    // Find flights on this route that were updated more than 10 minutes ago
    const flights = await Flight.find({
        departure_city: from_city,
        arrival_city: to_city,
        last_price_update: { $lt: tenMinutesAgo },
    });

    let resetCount = 0;

    for (const flight of flights) {
        if (flight.current_price !== flight.base_price) {
            flight.current_price = flight.base_price;
            flight.last_price_update = new Date();
            await flight.save();
            resetCount++;
        }
    }

    if (resetCount > 0) {
        console.log(`✅ Reset ${resetCount} flights on route ${from_city}-${to_city} to base price`);
    }

    return resetCount;
};

/**
 * Apply surge pricing to all flights on a route
 * @param {string} from_city - Departure city
 * @param {string} to_city - Arrival city
 * @param {string} user_id - User identifier
 * @returns {Promise<Object>} { surgeApplied: boolean, searchCount: number }
 */
export const applyRouteSurgePricing = async (from_city, to_city, user_id) => {
    // First, check if prices should be reset
    await resetRoutePricesIfExpired(from_city, to_city);

    // Calculate if surge should apply based on search count
    const { shouldApplySurge, searchCount } = await calculateRouteSurge(from_city, to_city, user_id);

    if (shouldApplySurge) {
        // Apply surge to ALL flights on this route
        const flights = await Flight.find({
            departure_city: from_city,
            arrival_city: to_city,
        });

        for (const flight of flights) {
            // Only apply surge if not already applied
            if (flight.current_price === flight.base_price) {
                const surgedPrice = Math.round(flight.base_price * (1 + SURGE_PERCENTAGE));
                flight.current_price = surgedPrice;
                flight.last_price_update = new Date();
                await flight.save();
                console.log(`⚡ SURGE applied to ${flight.flight_id}: ₹${flight.base_price} → ₹${surgedPrice}`);
            }
        }

        return { surgeApplied: true, searchCount };
    }

    return { surgeApplied: false, searchCount };
};
