import { searchFlights } from '../services/flightService.js';
import { trackSearchAttempt, applyRouteSurgePricing } from '../services/pricingService.js';

const DEFAULT_USER_ID = 'default_user';

/**
 * Search for flights
 * GET /api/flights?from=DEL&to=BOM
 */
export const searchFlightsController = async (req, res, next) => {
    try {
        const { from, to } = req.query;

        // Track this search attempt
        await trackSearchAttempt(from.toUpperCase(), to.toUpperCase(), DEFAULT_USER_ID);

        // Apply surge pricing if threshold reached
        const { surgeApplied, searchCount } = await applyRouteSurgePricing(
            from.toUpperCase(),
            to.toUpperCase(),
            DEFAULT_USER_ID
        );

        // Get updated flight prices
        const flights = await searchFlights(from, to);

        res.status(200).json({
            success: true,
            count: flights.length,
            data: flights,
            meta: {
                searchCount,
                surgeApplied,
                message: surgeApplied
                    ? `⚡ Surge pricing applied! You've searched this route ${searchCount} times in 5 minutes.`
                    : searchCount >= 2
                        ? `🔔 ${3 - searchCount} more search(es) to trigger surge pricing`
                        : null,
            },
        });
    } catch (error) {
        next(error);
    }
};
