import express from 'express';
import { searchFlightsController } from '../controllers/flightController.js';
import { validateFlightSearch } from '../middleware/validation.js';

const router = express.Router();

// GET /api/flights?from=DEL&to=BOM
router.get('/', validateFlightSearch, searchFlightsController);

export default router;
