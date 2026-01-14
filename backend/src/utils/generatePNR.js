import { nanoid } from 'nanoid';

/**
 * Generate a unique 6-character alphanumeric PNR
 * @returns {string} PNR string (e.g., "A1B2C3")
 */
export const generatePNR = () => {
    return nanoid(6).toUpperCase();
};
