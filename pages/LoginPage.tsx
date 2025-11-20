import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ADMIN_PASSWORD = '314159'; // Hardcoded password

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
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-stone-200 dark:border-gray-700">
                <h1 className="text-3xl font-bold text-center mb-6 text-amber-700 dark:text-yellow-400">Admin Login</h1>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-stone-600 dark:text-gray-300">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full bg-stone-100 dark:bg-gray-700 border border-stone-300 dark:border-gray-600 rounded-md px-4 py-2 text-stone-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-600 dark:focus:ring-yellow-500"
                            required
                            aria-describedby="password-error"
                        />
                    </div>
                    {error && <p id="password-error" className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-amber-600 dark:bg-yellow-500 text-white dark:text-gray-900 font-bold py-2 px-6 rounded-md hover:bg-amber-700 dark:hover:bg-yellow-400 transition-colors"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;