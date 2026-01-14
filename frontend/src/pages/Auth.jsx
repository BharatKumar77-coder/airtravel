import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Email and password are required');
            return;
        }

        if (!isLogin && !formData.name) {
            setError('Name is required for signup');
            return;
        }

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await signup(formData.name, formData.email, formData.password);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.toString());
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542296332-2e44a996aa0d?q=80&w=2000&auto=format&fit=crop")', backdropFilter: 'blur(8px)' }}>

            {/* Dark Overlay for background */}
            <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm"></div>

            {/* Main Card */}
            <div className="relative w-full max-w-5xl h-[650px] bg-white rounded-[30px] shadow-2xl overflow-hidden flex flex-row">

                {/* LEFT SIDE - IMAGE */}
                <div className="hidden lg:block w-[60%] relative">
                    <img
                        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop"
                        alt="Airplane Wing"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>

                    <div className="absolute bottom-12 left-12 text-white drop-shadow-lg z-10">
                        <h2 className="text-6xl font-black tracking-tighter leading-none italic opacity-90">
                            BIG DATA,<br />BIG SKY.
                        </h2>
                    </div>
                </div>

                {/* RIGHT SIDE - FORM */}
                <div className="w-full lg:w-[40%] bg-white p-12 flex flex-col justify-center relative">
                    {/* Logo Area */}
                    <div className="text-center mb-10">
                        <div className="inline-block p-3 rounded-2xl bg-blue-50 mb-4 shadow-sm">
                            <span className="text-3xl">✈️</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-wider uppercase mb-1">SkyBook</h1>
                        <p className="text-[11px] text-gray-400 tracking-[0.3em] font-semibold">PREMIUM FLIGHT ACCESS</p>
                    </div>

                    {/* User Login Heading */}
                    <h3 className="text-gray-800 font-bold mb-8 text-center text-xl tracking-tight">
                        {isLogin ? 'User Login' : 'New User Registration'}
                    </h3>

                    {error && (
                        <div className="mb-6 text-center text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-7">
                        {!isLogin && (
                            <div className="relative group">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-6 text-gray-800 placeholder-gray-500 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 font-medium text-base"
                                />
                            </div>
                        )}

                        <div className="relative group">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-6 text-gray-800 placeholder-gray-500 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 font-medium text-base"
                            />
                        </div>

                        <div className="relative group">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-6 text-gray-800 placeholder-gray-500 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 font-medium text-base"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-8">
                            <button
                                type="submit"
                                className="w-auto px-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-widest text-xs"
                            >
                                {isLogin ? 'Sign In' : 'Register'}
                            </button>
                        </div>
                    </form>

                    {/* Links Alignment */}
                    <div className="mt-10 flex justify-between items-center text-sm text-gray-500 px-2">
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="hover:text-blue-600 transition-colors font-medium border-b border-transparent hover:border-blue-600 pb-0.5"
                        >
                            {isLogin ? 'Create Account' : 'Back to Login'}
                        </button>
                        <button className="hover:text-blue-600 transition-colors font-medium border-b border-transparent hover:border-blue-600 pb-0.5">
                            Forgot Password?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
