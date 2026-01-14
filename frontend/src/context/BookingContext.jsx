import { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within BookingProvider');
    }
    return context;
};

export const BookingProvider = ({ children }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [walletBalance, setWalletBalance] = useState(50000);
    const [bookings, setBookings] = useState([]);

    const value = {
        searchResults,
        setSearchResults,
        selectedFlight,
        setSelectedFlight,
        walletBalance,
        setWalletBalance,
        bookings,
        setBookings,
    };

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
};
