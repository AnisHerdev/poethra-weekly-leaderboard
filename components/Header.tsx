import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinkClasses = "text-stone-700 dark:text-parchment/80 hover:text-oxblood dark:hover:text-parchment transition-all duration-300 pb-1 font-sans uppercase tracking-[0.2em] text-[10px] md:text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood dark:focus-visible:ring-lamplight/50 focus-visible:ring-offset-2 focus-visible:ring-offset-parchment dark:focus-visible:ring-offset-ink rounded-sm";
    const activeNavLinkClasses = "text-oxblood dark:text-lamplight font-bold border-b border-oxblood dark:border-lamplight/70";

    const mobileNavLinkClasses = "text-stone-600 dark:text-parchment/70 hover:text-oxblood dark:hover:text-parchment block w-full text-center px-3 py-4 text-xs font-sans uppercase tracking-widest";
    const activeMobileNavLinkClasses = "text-oxblood dark:text-parchment bg-oxblood/5 dark:bg-parchment/5 font-bold";

    return (
        <header className="bg-parchment/80 dark:bg-ink/80 backdrop-blur-md sticky top-0 z-50 border-b border-oxblood/10 dark:border-parchment/10">
            <div className="container mx-auto px-6 py-6 flex justify-between items-center bg-parchment-texture">
                <Link to="/" className="group flex flex-col items-start gap-0">
                    <span className="text-3xl font-display font-black text-stone-900 dark:text-parchment leading-none group-hover:text-oxblood dark:group-hover:text-lamplight transition-colors duration-500 uppercase tracking-tighter italic">
                        Poéthra
                    </span>
                    <span className="text-[10px] font-sans uppercase tracking-[0.4em] text-oxblood dark:text-parchment/50 font-bold ml-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        Literary Club
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-10">
                    <NavLink to="/" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : 'border-transparent'}`}>
                        Home
                    </NavLink>
                    <NavLink to="/leaderboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : 'border-transparent'}`}>
                        Leaderboard
                    </NavLink>
                    <NavLink to="/winners" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : 'border-transparent'}`}>
                        Winners
                    </NavLink>
                    <div className="pl-4 border-l border-oxblood/20 dark:border-parchment/20">
                        <ThemeToggle />
                    </div>
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-4">
                    <ThemeToggle />
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        className="text-stone-800 dark:text-parchment/90 focus:outline-none p-2 hover:bg-oxblood/5 dark:hover:bg-parchment/5 rounded-full transition-colors"
                        aria-label="Toggle Menu"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu — CSS-driven transition for snappy feel */}
            <nav
                className="md:hidden bg-parchment/95 dark:bg-ink/95 border-b border-oxblood/20 dark:border-parchment/20 backdrop-blur-xl absolute top-full left-0 right-0 overflow-hidden"
                style={{
                    maxHeight: isMenuOpen ? '240px' : '0px',
                    opacity: isMenuOpen ? 1 : 0,
                    transition: 'max-height 200ms ease, opacity 150ms ease',
                    pointerEvents: isMenuOpen ? 'auto' : 'none',
                }}
            >
                <div className="flex flex-col items-center py-4 space-y-1 bg-parchment-texture">
                    <NavLink to="/" className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? activeMobileNavLinkClasses : ''}`} onClick={() => setIsMenuOpen(false)}>
                        Home
                    </NavLink>
                    <NavLink to="/leaderboard" className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? activeMobileNavLinkClasses : ''}`} onClick={() => setIsMenuOpen(false)}>
                        Leaderboard
                    </NavLink>
                    <NavLink to="/winners" className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? activeMobileNavLinkClasses : ''}`} onClick={() => setIsMenuOpen(false)}>
                        Winners
                    </NavLink>
                </div>
            </nav>
        </header>
    );
};

export default Header;