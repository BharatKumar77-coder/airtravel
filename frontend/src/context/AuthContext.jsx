import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getUserProfile } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await getUserProfile();
                setUser(response.data);
            } catch (error) {
                console.error('Session expired or invalid:', error);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            const response = await loginUser({ email, password });
            const { token, ...userData } = response.data;
            localStorage.setItem('token', token);
            setUser(userData);
            return userData;
        } catch (error) {
            throw error.response?.data?.error || 'Login failed';
        }
    };

    const signup = async (name, email, password) => {
        try {
            const response = await registerUser({ name, email, password });
            const { token, ...userData } = response.data;
            localStorage.setItem('token', token);
            setUser(userData);
            return userData;
        } catch (error) {
            throw error.response?.data?.error || 'Registration failed';
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        login,
        signup,
        logout,
        loading,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
