import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const activeLinkStyle = {
        color: '#f59e0b',
        borderBottom: '2px solid #f59e0b',
    };

    const mobileActiveLinkStyle = {
        color: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)'
    };

    return (
        <header className="bg-black bg-opacity-30 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-3xl font-bold text-white tracking-wider font-lora">
                    Poéthra
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6">
                    <NavLink to="/" className="text-gray-300 hover:text-yellow-500 transition-colors duration-300 pb-1" style={({ isActive }) => isActive ? activeLinkStyle : {}}>
                        Home
                    </NavLink>
                    <NavLink to="/leaderboard" className="text-gray-300 hover:text-yellow-500 transition-colors duration-300 pb-1" style={({ isActive }) => isActive ? activeLinkStyle : {}}>
                        Leaderboard
                    </NavLink>
                    <NavLink to="/admin" className="text-gray-300 hover:text-yellow-500 transition-colors duration-300 pb-1" style={({ isActive }) => isActive ? activeLinkStyle : {}}>
                        Admin
                    </NavLink>
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-yellow-500 focus:outline-none">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <nav className="md:hidden bg-black bg-opacity-50 absolute top-full left-0 right-0">
                    <div className="flex flex-col items-center px-2 pt-2 pb-3 space-y-1">
                        <NavLink to="/" className="text-gray-300 hover:text-yellow-500 block w-full text-center px-3 py-2 rounded-md text-base font-medium" style={({ isActive }) => isActive ? mobileActiveLinkStyle : {}} onClick={() => setIsMenuOpen(false)}>
                            Home
                        </NavLink>
                        <NavLink to="/leaderboard" className="text-gray-300 hover:text-yellow-500 block w-full text-center px-3 py-2 rounded-md text-base font-medium" style={({ isActive }) => isActive ? mobileActiveLinkStyle : {}} onClick={() => setIsMenuOpen(false)}>
                            Leaderboard
                        </NavLink>
                        <NavLink to="/admin" className="text-gray-300 hover:text-yellow-500 block w-full text-center px-3 py-2 rounded-md text-base font-medium" style={({ isActive }) => isActive ? mobileActiveLinkStyle : {}} onClick={() => setIsMenuOpen(false)}>
                            Admin
                        </NavLink>
                    </div>
                </nav>
            )}
        </header>
    );
};

export default Header;