const BookingCard = ({ booking }) => {
    const handleDownload = () => {
        window.open(
            `${import.meta.env.VITE_API_BASE_URL}/download/${booking.pnr}`, 
            '_blank');
    };

    return (
        <div className="card">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">{booking.passenger_name}</h3>
                    <p className="text-sm text-primary-600 font-medium">PNR: {booking.pnr}</p>
                </div>
                <div className="text-right">
                    <p className="text-xl font-bold text-gray-800">₹{booking.final_price}</p>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-3 mb-3">
                <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Flight:</span> {booking.flight_id}
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Booked on:</span>{' '}
                    {new Date(booking.booked_at).toLocaleString('en-IN')}
                </p>
            </div>

            <button
                onClick={handleDownload}
                className="btn-primary w-full"
            >
                📥 Download Ticket (PDF)
            </button>
        </div>
    );
};

export default BookingCard;
