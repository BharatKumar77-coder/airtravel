const FlightCard = ({ flight, onBook }) => {
    const isSurge = flight.current_price > flight.base_price;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full transform hover:-translate-y-1">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="bg-blue-50 text-blue-600 rounded-xl p-3 inline-block mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                        <span className="text-2xl">✈️</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{flight.flight_id}</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{flight.airline}</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-black text-gray-900 tracking-tight">₹{flight.current_price.toLocaleString('en-IN')}</p>
                    {isSurge ? (
                        <div className="flex items-center justify-end gap-1 text-amber-600 mt-1 bg-amber-50 px-2 py-1 rounded-lg">
                            <span className="animate-pulse text-xs">⚡</span>
                            <p className="text-[10px] font-bold uppercase tracking-wider">Surge Active</p>
                        </div>
                    ) : (
                        <div className="flex items-center justify-end gap-1 text-emerald-600 mt-1 bg-emerald-50 px-2 py-1 rounded-lg">
                            <span className="text-xs">🏷️</span>
                            <p className="text-[10px] font-bold uppercase tracking-wider">Best Price</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Route Visual */}
            <div className="flex items-center justify-between mb-8 bg-gray-50 rounded-2xl p-5 border border-gray-100/50">
                <div className="text-center w-16">
                    <p className="text-2xl font-black text-gray-800 tracking-tight">{flight.departure_city}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Depart</p>
                </div>

                <div className="flex-1 px-4 flex flex-col items-center">
                    <div className="w-full h-0.5 bg-gray-200 relative mt-2">
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 transform rotate-90 bg-gray-50 p-1">✈</div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium mt-3 tracking-wide uppercase">Direct Flight</p>
                </div>

                <div className="text-center w-16">
                    <p className="text-2xl font-black text-gray-800 tracking-tight">{flight.arrival_city}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Arrive</p>
                </div>
            </div>

            {/* Footer / Action */}
            <div className="mt-auto">
                <button
                    onClick={() => onBook(flight)}
                    className="w-full bg-gray-900 group-hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-gray-200 group-hover:shadow-blue-500/30 transition-all duration-300 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                >
                    <span>Select Flight</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </div>
        </div>
    );
};

export default FlightCard;
