import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchFlights, getWalletBalance } from '../services/api';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
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

const Dashboard = () => {
    const [from, setFrom] = useState('DEL');
    const [to, setTo] = useState('BOM');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchMeta, setSearchMeta] = useState(null);

    const { searchResults, setSearchResults, setSelectedFlight, walletBalance, setWalletBalance } = useBooking();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadWalletBalance();
    }, []);

    const loadWalletBalance = async () => {
        try {
            const response = await getWalletBalance();
            // Backend returns { success: true, data: { balance: ... } }
            if (response.data && response.data.data) {
                setWalletBalance(response.data.data.balance || 0);
            }
        } catch (err) {
            console.error('Failed to load wallet balance:', err);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        setSearchMeta(null);
        setSearchResults([]);

        if (from === to) {
            setError('Departure and arrival cities cannot be the same');
            return;
        }

        setLoading(true);

        try {
            const response = await searchFlights(from, to);
            // Axios response structure: response.data = { success: true, data: [...], meta: {...} }
            if (response.data) {
                setSearchResults(response.data.data || []);
                setSearchMeta(response.data.meta);
            }
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

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen font-sans flex flex-col relative bg-[#0f172a]">
            {/* Background Image with Overlay */}
            <div
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop")' }}
            ></div>
            <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0f172a]/90 via-[#1e293b]/80 to-[#0f172a] pointer-events-none"></div>

            {/* Premium Navbar */}
            <nav className="relative z-50 bg-white/5 backdrop-blur-xl border-b border-white/10 flex-none sticky top-0">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        {/* Brand */}
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                                <span className="text-2xl">✈️</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-wide uppercase">SkyBook</h1>
                                <p className="text-[10px] text-blue-200 tracking-widest font-semibold">PREMIUM TRAVEL</p>
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex flex-col items-end">
                                <p className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Wallet Balance</p>
                                <p className="text-sm font-bold text-white">₹{walletBalance.toLocaleString('en-IN')}</p>
                            </div>

                            <div className="h-8 w-px bg-white/10 hidden md:block"></div>

                            <button
                                onClick={() => navigate('/history')}
                                className="text-sm font-medium text-blue-100 hover:text-white transition-colors"
                            >
                                My Bookings
                            </button>

                            <button
                                onClick={handleLogout}
                                className="bg-white hover:bg-blue-50 text-[#0f172a] text-xs font-bold py-2.5 px-5 rounded-full uppercase tracking-wider transition-all shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Area - Fully Centered Flex Container */}
            <div className="relative z-10 flex-grow flex flex-col items-center justify-center p-4">

                {/* Animated Container for Content */}
                <div className={`w-full max-w-6xl transition-all duration-700 ease-out flex flex-col items-center justify-center ${searchResults.length > 0 ? 'py-12 justify-start' : 'flex-grow justify-center'}`}>

                    <div className="text-center mb-12 w-full animate-fade-in relative">
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">
                            Where to next?
                        </h2>
                        <p className="text-lg md:text-xl text-blue-200 font-medium tracking-wide">
                            Discover premium flights across all major Indian cities
                        </p>
                    </div>

                    {/* Search Card - Centered Premium Design (Glassmorphism) */}
                    <div className="bg-white/10 backdrop-blur-md rounded-[3rem] shadow-2xl shadow-black/20 p-8 md:p-14 w-full max-w-5xl border border-white/10 relative overflow-visible">

                        <form onSubmit={handleSearch} className="relative z-10 flex flex-col gap-10">

                            <div className="flex flex-col md:flex-row items-center gap-6 relative">
                                {/* From Input */}
                                <div className="w-full relative group">
                                    <label className="block text-xs font-bold text-blue-200 uppercase tracking-widest mb-3 ml-4 text-center">Flying From</label>
                                    <div className="relative">
                                        <select
                                            value={from}
                                            onChange={(e) => setFrom(e.target.value)}
                                            className="w-full bg-[#1e293b]/50 hover:bg-[#1e293b]/70 border-2 border-white/5 hover:border-blue-400/30 rounded-[2rem] py-8 px-8 text-white font-bold text-2xl appearance-none cursor-pointer focus:bg-[#1e293b] focus:border-blue-500 transition-all outline-none shadow-lg text-center backdrop-blur-sm"
                                        >
                                            {cities.map((city) => (
                                                <option key={city.code} value={city.code} className="bg-[#0f172a] text-white">
                                                    {city.name} ({city.code})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Swap Icon */}
                                <div className="hidden md:flex items-center justify-center pt-8 z-20">
                                    <div className="w-20 h-20 rounded-full bg-[#3b82f6] border-4 border-[#0f172a] text-white flex items-center justify-center text-3xl hover:bg-[#2563eb] hover:scale-110 hover:shadow-2xl transition-all duration-300 cursor-pointer shadow-xl -mx-10 z-30">
                                        ⇄
                                    </div>
                                </div>

                                {/* To Input */}
                                <div className="w-full relative group">
                                    <label className="block text-xs font-bold text-blue-200 uppercase tracking-widest mb-3 ml-4 text-center">Flying To</label>
                                    <div className="relative">
                                        <select
                                            value={to}
                                            onChange={(e) => setTo(e.target.value)}
                                            className="w-full bg-[#1e293b]/50 hover:bg-[#1e293b]/70 border-2 border-white/5 hover:border-blue-400/30 rounded-[2rem] py-8 px-8 text-white font-bold text-2xl appearance-none cursor-pointer focus:bg-[#1e293b] focus:border-blue-500 transition-all outline-none shadow-lg text-center backdrop-blur-sm"
                                        >
                                            {cities.map((city) => (
                                                <option key={city.code} value={city.code} className="bg-[#0f172a] text-white">
                                                    {city.name} ({city.code})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Search Button */}
                            <div className="px-4 md:px-32">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-white hover:bg-blue-50 text-[#0f172a] font-bold py-6 rounded-full shadow-2xl shadow-black/30 transform hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:scale-105"
                                >
                                    <span>{loading ? 'Searching...' : 'Search Flights'}</span>
                                    {!loading && <span className="text-xl">→</span>}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Surge Alert */}
                    {searchMeta?.message && (
                        <div className={`mt-12 max-w-3xl mx-auto rounded-[2rem] p-8 flex items-center gap-6 animate-fade-in shadow-xl backdrop-blur-md border ${searchMeta.surgeApplied
                            ? 'bg-amber-900/40 text-amber-200 border-amber-500/30'
                            : 'bg-blue-900/40 text-blue-200 border-blue-500/30'
                            }`}>
                            <span className="text-4xl drop-shadow-lg">{searchMeta.surgeApplied ? '⚡' : '🔔'}</span>
                            <div>
                                <p className="font-bold text-xs uppercase tracking-widest opacity-80 mb-2">
                                    {searchMeta.surgeApplied ? 'Surge Pricing Active' : 'Demand Alert'}
                                </p>
                                <p className="font-bold text-xl leading-tight text-white">{searchMeta.message}</p>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 max-w-2xl mx-auto w-full">
                        <ErrorMessage message={error} />
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="py-20 text-center animate-pulse">
                        <div className="inline-block p-6 rounded-full bg-white/10 backdrop-blur-md mb-6 border border-white/20">
                            <LoadingSpinner />
                        </div>
                        <p className="text-blue-200 font-medium tracking-wide uppercase text-sm">Scanning Routes...</p>
                    </div>
                )}

                {/* Results Grid */}
                {!loading && searchResults.length > 0 && (
                    <div className="w-full max-w-6xl animate-slide-up pb-20">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-white/10 pb-8 gap-4 px-4">
                            <div>
                                <h3 className="text-4xl font-black text-white tracking-tight drop-shadow-md">Available Flights</h3>
                                <p className="text-blue-200 text-base mt-2 font-medium">Showing best connections from {from} to {to}</p>
                            </div>
                            <div className="bg-white text-[#0f172a] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                                {searchResults.length} Flights Found
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            </div>
        </div>
    );
};

export default Dashboard;
