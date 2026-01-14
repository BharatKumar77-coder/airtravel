import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Flight from '../src/models/Flight.js';
import { connectDatabase } from '../src/config/database.js';

dotenv.config();

const airlines = [
    'IndiGo',
    'Air India',
    'SpiceJet',
    'Vistara',
    'AirAsia India',
    'Go First',
];

const cities = [
    { code: 'DEL', name: 'Delhi' },
    { code: 'BOM', name: 'Mumbai' },
    { code: 'BLR', name: 'Bangalore' },
    { code: 'HYD', name: 'Hyderabad' },
    { code: 'MAA', name: 'Chennai' },
    { code: 'CCU', name: 'Kolkata' },
    { code: 'AMD', name: 'Ahmedabad' },
    { code: 'PNQ', name: 'Pune' },
];

/**
 * Generate random flight ID
 */
const generateFlightId = (airline, index) => {
    const airlineCode = airline.substring(0, 2).toUpperCase();
    const flightNumber = String(1000 + index).padStart(4, '0');
    return `${airlineCode}${flightNumber}`;
};

/**
 * Generate random base price between 2000-3000
 */
const generateBasePrice = () => {
    return Math.floor(Math.random() * (3000 - 2000 + 1)) + 2000;
};

/**
 * Generate flights data
 */
const generateFlights = () => {
    const flights = [];
    let counter = 0;

    // Create combinations of routes
    for (let i = 0; i < cities.length; i++) {
        for (let j = 0; j < cities.length; j++) {
            if (i !== j && counter < 20) {
                const airline = airlines[Math.floor(Math.random() * airlines.length)];
                const basePrice = generateBasePrice();

                flights.push({
                    flight_id: generateFlightId(airline, counter),
                    airline,
                    departure_city: cities[i].code,
                    arrival_city: cities[j].code,
                    base_price: basePrice,
                    current_price: basePrice,
                    last_price_update: new Date(),
                });

                counter++;
            }
        }
    }

    return flights;
};

/**
 * Seed the database
 */
const seedDatabase = async () => {
    try {
        // Connect to database
        await connectDatabase();

        // Clear existing flights
        await Flight.deleteMany({});
        console.log('✅ Cleared existing flights');

        // Generate and insert new flights
        const flights = generateFlights();
        await Flight.insertMany(flights);

        console.log(`✅ Successfully seeded ${flights.length} flights`);

        // Display sample data
        console.log('\n📋 Sample Flights:');
        flights.slice(0, 5).forEach(flight => {
            console.log(`  ${flight.flight_id}: ${flight.airline} | ${flight.departure_city} → ${flight.arrival_city} | ₹${flight.base_price}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
