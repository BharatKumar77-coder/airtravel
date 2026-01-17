import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth Services
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (userData) => api.post('/auth/login', userData);
export const getUserProfile = () => api.get('/auth/me');

// Flight Services
export const searchFlights = (from, to) => {
    return api.get('/flights', {
        params: { from, to },
    });
};

// Booking Services
export const bookFlight = (passenger_name, flight_id) => {
    return api.post('/book', {
        passenger_name,
        flight_id,
    }); // user_id is handled by backend via token
};

export const getBookingHistory = () => {
    return api.get('/bookings'); // user_id is handled by backend
};

export const getWalletBalance = () => {
    return api.get('/wallet'); // user_id is handled by backend
};

export default api;
