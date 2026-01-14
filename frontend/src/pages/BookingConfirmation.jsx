import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookFlight, getWalletBalance } from '../services/api';
import { useBooking } from '../context/BookingContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const BookingConfirmation = () => {
    const [passengerName, setPassengerName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(null);

    const { selectedFlight, walletBalance, setWalletBalance } = useBooking();
    const navigate = useNavigate();

    useEffect(() => {
        if (!selectedFlight) {
            navigate('/');
        }
    }, [selectedFlight, navigate]);

    useEffect(() => {
        loadWalletBalance();
    }, []);

    const loadWalletBalance = async () => {
        try {
            const response = await getWalletBalance();
            if (response.data && response.data.data) {
                setWalletBalance(response.data.data.balance);
            }
        } catch (err) {
            console.error('Failed to load wallet balance:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (passengerName.trim().length < 2) {
            setError('Passenger name must be at least 2 characters');
            return;
        }

        if (walletBalance < selectedFlight.current_price) {
            setError(`Insufficient balance. You need ₹${selectedFlight.current_price} but have ₹${walletBalance}`);
            return;
        }

        setLoading(true);

        try {
            const response = await bookFlight(passengerName, selectedFlight.flight_id);

            if (response.data && response.data.success) {
                setBookingSuccess(response.data.data);
                // Update wallet balance
                setWalletBalance(walletBalance - response.data.data.final_price);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        if (bookingSuccess) {
            window.open(bookingSuccess.pdf_download, '_blank');
        }
    };

    if (!selectedFlight) {
        return null;
    }

    if (bookingSuccess) {
        return (
            <div className="min-h-screen font-sans flex flex-col relative bg-[#0f172a]">
                {/* Background Image with Overlay */}
                <div
                    className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop")' }}
                ></div>
                <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0f172a]/90 via-[#1e293b]/80 to-[#0f172a] pointer-events-none"></div>

                <div className="flex-grow flex items-center justify-center relative z-10 p-4">
                    <div className="max-w-2xl w-full">
                        <div className="bg-white/10 backdrop-blur-md border border-green-400/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>

                            <div className="text-center mb-8">
                                <div className="text-6xl mb-4 drop-shadow-lg">✅</div>
                                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Booking Confirmed!</h1>
                                <p className="text-blue-100/70 text-lg">Your ticket has been generated successfully</p>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10">
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <p className="text-sm text-blue-200/60 uppercase tracking-wider font-semibold">PNR</p>
                                        <p className="text-2xl font-bold text-white">{bookingSuccess.pnr}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-blue-200/60 uppercase tracking-wider font-semibold">Booking ID</p>
                                        <p className="text-sm font-medium text-blue-100">{bookingSuccess.booking_id}</p>
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-4 mb-4">
                                    <p className="text-sm text-blue-200/60 uppercase tracking-wider font-semibold mb-1">Passenger Name</p>
                                    <p className="text-xl font-bold text-white">{bookingSuccess.passenger_name}</p>
                                </div>

                                <div className="border-t border-white/10 pt-4 mb-4">
                                    <p className="text-sm text-blue-200/60 uppercase tracking-wider font-semibold mb-1">Flight Details</p>
                                    <p className="text-xl font-medium text-white">{bookingSuccess.flight_id}</p>
                                </div>

                                <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-blue-200/60 uppercase tracking-wider font-semibold">Amount Paid</p>
                                        <p className="text-3xl font-bold text-white">₹{bookingSuccess.final_price}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-blue-200/60 uppercase tracking-wider font-semibold">Booked At</p>
                                        <p className="text-sm font-medium text-blue-100">
                                            {new Date(bookingSuccess.booked_at).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>

                                {bookingSuccess.surge_applied && (
                                    <div className="mt-6 bg-orange-500/20 border border-orange-500/30 rounded-xl p-4">
                                        <p className="text-sm text-orange-200 font-medium flex items-center gap-2">
                                            <span>⚡</span> Surge pricing was applied to this booking
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleDownloadPDF}
                                    className="w-full bg-white text-blue-900 font-bold py-4 rounded-xl shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-2"
                                >
                                    <span>📥</span> Download Ticket (PDF)
                                </button>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => navigate('/history')}
                                        className="w-full bg-white/10 text-white font-semibold py-4 rounded-xl hover:bg-white/20 transition-all border border-white/10 backdrop-blur-sm"
                                    >
                                        View History
                                    </button>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
                                    >
                                        Book Another
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans flex flex-col relative bg-[#0f172a]">
            {/* Background Image with Overlay */}
            <div
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop")' }}
            ></div>
            <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0f172a]/90 via-[#1e293b]/80 to-[#0f172a] pointer-events-none"></div>

            <div className="flex-grow flex flex-col items-center justify-center relative z-10 p-4">
                {/* Back Button - Positioned Top Left */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-8 left-8 group flex items-center gap-2 text-blue-200/70 hover:text-white transition-colors z-50"
                >
                    <span className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-all">←</span>
                    <span className="font-medium tracking-wide">Back to Search</span>
                </button>

                <div className="max-w-2xl w-full"> {/* Reduced max-width for better vertical look */}

                    <div className="flex flex-col space-y-16">
                        {/* FLIGHT DETAILS CARD (Top) */}
                        <div className="w-full">
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                                <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                                    <span className="text-2xl">✈️</span> Flight Summary
                                </h2>

                                <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl p-6 mb-6 border border-white/5">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white tracking-wide">{selectedFlight.airline}</h3>
                                            <p className="text-sm text-blue-200/60 font-mono">{selectedFlight.flight_id}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-center">
                                            <p className="text-3xl font-bold text-white">{selectedFlight.departure_city}</p>
                                            <p className="text-xs text-blue-200/50 uppercase tracking-wider mt-1">Departure</p>
                                        </div>

                                        <div className="flex flex-col items-center px-4 w-full">
                                            <div className="w-full h-px bg-white/20 relative">
                                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/50">✈</div>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <p className="text-3xl font-bold text-white">{selectedFlight.arrival_city}</p>
                                            <p className="text-xs text-blue-200/50 uppercase tracking-wider mt-1">Arrival</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                                    <p className="text-sm text-blue-200/70 flex justify-between items-center">
                                        <span className="font-medium">Wallet Balance</span>
                                        <span className="text-lg font-bold text-white">
                                            ₹{walletBalance.toLocaleString('en-IN')}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* PASSENGER DETAILS FORM (Bottom) */}
                        <div className="w-full">
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl">
                                <h2 className="text-2xl font-bold mb-8 text-white">Passenger Details</h2>

                                <ErrorMessage message={error} />

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-blue-200/80 ml-1">
                                            Passenger Name <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={passengerName}
                                            onChange={(e) => setPassengerName(e.target.value)}
                                            placeholder="Enter full name as on ID"
                                            className="w-full bg-[#0f172a]/50 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-white/20 focus:bg-[#0f172a]/80 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all text-lg"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="bg-gradient-to-r from-blue-900/40 to-[#0f172a]/40 rounded-2xl p-6 border border-white/5">
                                        <h3 className="font-bold text-white mb-4 text-lg">Payment Summary</h3>
                                        <div className="flex justify-between items-center mb-3 text-blue-200/70">
                                            <span>Base Flight Price</span>
                                            <span className="font-medium">₹{selectedFlight.base_price}</span>
                                        </div>
                                        {selectedFlight.current_price > selectedFlight.base_price && (
                                            <div className="flex justify-between items-center mb-3 text-orange-300">
                                                <span>Surge Pricing</span>
                                                <span className="font-medium">+ ₹{selectedFlight.current_price - selectedFlight.base_price}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-2">
                                            <span className="font-bold text-white text-lg">Total Amount</span>
                                            <span className="text-4xl font-bold text-white">
                                                ₹{selectedFlight.current_price}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-white text-blue-900 font-bold text-xl py-5 rounded-2xl shadow-xl shadow-blue-900/30 hover:bg-blue-50 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center gap-3">
                                                <LoadingSpinner />
                                                <span>Processing Securely...</span>
                                            </div>
                                        ) : (
                                            'Confirm & Pay Securely'
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;
