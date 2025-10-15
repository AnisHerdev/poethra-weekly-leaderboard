import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Get password from .env
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const LoginPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            navigate('/admin');
        } else {
            setError('Incorrect password. Please try again.');
            setPassword('');
        }
    };

    return (
        <div className="flex items-center justify-center py-20">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
                <h1 className="text-3xl font-bold text-center mb-6 text-yellow-400">Admin Login</h1>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                            aria-describedby="password-error"
                        />
                    </div>
                    {error && <p id="password-error" className="text-red-400 text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-md hover:bg-yellow-400 transition-colors"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
