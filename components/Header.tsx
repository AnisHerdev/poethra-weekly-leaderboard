import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinkClasses = "text-gray-600 dark:text-gray-300 hover:text-amber-700 dark:hover:text-yellow-500 transition-colors duration-300 pb-1";
    const activeNavLinkClasses = "text-amber-700 dark:text-yellow-500 border-b-2 border-amber-700 dark:border-yellow-500";
    
    const mobileNavLinkClasses = "text-gray-600 dark:text-gray-300 hover:text-amber-700 dark:hover:text-yellow-500 block w-full text-center px-3 py-2 rounded-md text-base font-medium";
    const activeMobileNavLinkClasses = "text-amber-700 dark:text-yellow-500 bg-amber-500/10 dark:bg-yellow-500/10";

    return (
        <header className="bg-stone-100/80 dark:bg-black/30 backdrop-blur-sm sticky top-0 z-50 border-b border-stone-200 dark:border-gray-800">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-3xl font-bold text-stone-800 dark:text-white tracking-wider font-lora">
                    Poéthra
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    <NavLink to="/" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : 'border-transparent'}`}>
                        Home
                    </NavLink>
                    <NavLink to="/leaderboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : 'border-transparent'}`}>
                        Leaderboard
                    </NavLink>
                    <NavLink to="/winners" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : 'border-transparent'}`}>
                        Winners
                    </NavLink>
                    <NavLink to="/admin" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : 'border-transparent'}`}>
                        Admin
                    </NavLink>
                    <ThemeToggle />
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-2">
                    <ThemeToggle />
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 dark:text-gray-300 hover:text-amber-700 dark:hover:text-yellow-500 focus:outline-none">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <nav className="md:hidden bg-stone-100/95 dark:bg-black/50 absolute top-full left-0 right-0">
                    <div className="flex flex-col items-center px-2 pt-2 pb-3 space-y-1">
                        <NavLink to="/" className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? activeMobileNavLinkClasses : ''}`} onClick={() => setIsMenuOpen(false)}>
                            Home
                        </NavLink>
                        <NavLink to="/leaderboard" className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? activeMobileNavLinkClasses : ''}`} onClick={() => setIsMenuOpen(false)}>
                            Leaderboard
                        </NavLink>
                        <NavLink to="/winners" className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? activeMobileNavLinkClasses : ''}`} onClick={() => setIsMenuOpen(false)}>
                            Winners
                        </NavLink>
                        <NavLink to="/admin" className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? activeMobileNavLinkClasses : ''}`} onClick={() => setIsMenuOpen(false)}>
                            Admin
                        </NavLink>
                    </div>
                </nav>
            )}
        </header>
    );
};

export default Header;