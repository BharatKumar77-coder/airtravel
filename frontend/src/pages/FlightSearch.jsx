import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchFlights, getWalletBalance } from '../services/api';
import { useBooking } from '../context/BookingContext';
import FlightCard from '../components/FlightCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

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

const FlightSearch = () => {
    const [from, setFrom] = useState('DEL');
    const [to, setTo] = useState('BOM');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchMeta, setSearchMeta] = useState(null);

    const { searchResults, setSearchResults, setSelectedFlight, walletBalance, setWalletBalance } = useBooking();
    const navigate = useNavigate();

    useEffect(() => {
        loadWalletBalance();
    }, []);

    const loadWalletBalance = async () => {
        try {
            const response = await getWalletBalance();
            setWalletBalance(response.data.balance);
        } catch (err) {
            console.error('Failed to load wallet balance:', err);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        setSearchMeta(null);

        if (from === to) {
            setError('Departure and arrival cities cannot be the same');
            return;
        }

        setLoading(true);

        try {
            const response = await searchFlights(from, to);
            setSearchResults(response.data);
            setSearchMeta(response.meta);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to search flights');
        } finally {
            setLoading(false);
        }
    };

    const handleBookFlight = (flight) => {
        setSelectedFlight(flight);
        navigate('/booking');
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">✈️ Flight Booking System</h1>
                    <p className="text-gray-600">Search and book your flights instantly</p>
                    <div className="mt-4 inline-block bg-white px-6 py-3 rounded-lg shadow-md">
                        <p className="text-sm text-gray-600">Wallet Balance</p>
                        <p className="text-2xl font-bold text-primary-600">₹{walletBalance.toLocaleString('en-IN')}</p>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="btn-primary"
                    >
                        🔍 Search Flights
                    </button>
                    <button
                        onClick={() => navigate('/history')}
                        className="btn-secondary"
                    >
                        📜 Booking History
                    </button>
                </div>

                {/* Search Form */}
                <div className="card max-w-2xl mx-auto mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Search Flights</h2>

                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    From
                                </label>
                                <select
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="input-field"
                                >
                                    {cities.map((city) => (
                                        <option key={city.code} value={city.code}>
                                            {city.name} ({city.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    To
                                </label>
                                <select
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    className="input-field"
                                >
                                    {cities.map((city) => (
                                        <option key={city.code} value={city.code}>
                                            {city.name} ({city.code})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? 'Searching...' : 'Search Flights'}
                        </button>
                    </form>
                </div>

                {/* Surge Pricing Alert */}
                {searchMeta?.message && (
                    <div className={`max-w-2xl mx-auto mb-6 ${searchMeta.surgeApplied
                            ? 'bg-orange-50 border-2 border-orange-300'
                            : 'bg-blue-50 border-2 border-blue-300'
                        } rounded-lg p-4`}>
                        <p className={`text-center font-semibold ${searchMeta.surgeApplied ? 'text-orange-700' : 'text-blue-700'
                            }`}>
                            {searchMeta.message}
                        </p>
                    </div>
                )}

                <ErrorMessage message={error} />

                {/* Results */}
                {loading && (
                    <div className="py-12">
                        <LoadingSpinner />
                    </div>
                )}

                {!loading && searchResults.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">
                            Available Flights ({searchResults.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {searchResults.map((flight) => (
                                <FlightCard
                                    key={flight.flight_id}
                                    flight={flight}
                                    onBook={handleBookFlight}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {!loading && searchResults.length === 0 && !error && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            Search for flights to see available options
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlightSearch;
