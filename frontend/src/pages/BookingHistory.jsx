import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookingHistory } from '../services/api';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const BookingHistory = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { bookings, setBookings } = useBooking();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await getBookingHistory();
            setBookings(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load booking history');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (pnr) => {
        window.open(`/api/download/${pnr}`, '_blank');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header/Navbar */}
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">✈️</span>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">SkyBook</h1>
                                <p className="text-xs text-gray-500">Welcome, {user?.name}!</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="btn-secondary"
                            >
                                ← Back to Search
                            </button>

                            <button
                                onClick={handleLogout}
                                className="text-gray-600 hover:text-gray-800 font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">My Bookings</h2>
                    <p className="text-gray-600">View and manage all your flight bookings</p>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-700">
                        {loading ? 'Loading...' : `Total Bookings: ${bookings.length}`}
                    </h3>
                    <button
                        onClick={loadBookings}
                        disabled={loading}
                        className="btn-primary"
                    >
                        🔄 Refresh
                    </button>
                </div>

                <ErrorMessage message={error} />

                {/* Loading State */}
                {loading && (
                    <div className="py-12">
                        <LoadingSpinner />
                        <p className="text-center text-gray-600 mt-4">Loading your bookings...</p>
                    </div>
                )}

                {/* Bookings Grid */}
                {!loading && bookings.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {bookings.map((booking) => (
                            <div key={booking.booking_id} className="card hover:shadow-2xl transition-all">
                                {/* Booking Header */}
                                <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-800">{booking.passenger_name}</h4>
                                        <p className="text-sm text-primary-600 font-semibold">PNR: {booking.pnr}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-gray-800">₹{booking.final_price}</p>
                                        <p className="text-xs text-gray-500">Amount Paid</p>
                                    </div>
                                </div>

                                {/* Flight Details */}
                                <div className="bg-gradient-to-r from-blue-50 to-primary-50 rounded-lg p-4 mb-4">
                                    <p className="text-xs text-gray-600 font-semibold mb-2">FLIGHT DETAILS</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Flight ID</p>
                                            <p className="font-bold text-gray-800">{booking.flight_id}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Booking Date</p>
                                            <p className="font-medium text-gray-800 text-sm">
                                                {new Date(booking.booked_at).toLocaleDateString('en-IN')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <p className="text-xs text-gray-500 mb-1">Route</p>
                                        <p className="font-medium text-gray-800">
                                            {/* We don't have departure/arrival stored, but could add them */}
                                            Flight {booking.flight_id}
                                        </p>
                                    </div>
                                </div>

                                {/* Booking Metadata */}
                                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 mb-1">Booking ID</p>
                                        <p className="font-mono text-xs text-gray-700">{booking.booking_id}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 mb-1">Booked At</p>
                                        <p className="text-xs text-gray-700">
                                            {new Date(booking.booked_at).toLocaleTimeString('en-IN')}
                                        </p>
                                    </div>
                                </div>

                                {/* Download Button */}
                                <button
                                    onClick={() => handleDownload(booking.pnr)}
                                    className="btn-primary w-full flex items-center justify-center gap-2"
                                >
                                    <span>📥</span>
                                    <span>Download Ticket (PDF)</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && bookings.length === 0 && !error && (
                    <div className="text-center py-20">
                        <div className="text-7xl mb-6">✈️</div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-3">No Bookings Yet</h3>
                        <p className="text-gray-500 mb-6">Start your journey by booking your first flight</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="btn-primary"
                        >
                            Search Flights
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingHistory;
