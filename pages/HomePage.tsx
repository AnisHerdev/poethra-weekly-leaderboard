import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
    return (
        <div className="text-center py-10 md:py-20 animate-fade-in-up">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                Welcome to Poéthra
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
                The heart of our creative writing community. Where words find their wings and stories come to life.
            </p>
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 md:p-8 max-w-4xl mx-auto shadow-lg border border-gray-700">
                <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-yellow-400">The Weekly Writing Contest</h2>
                <p className="text-base md:text-lg text-gray-300 mb-8">
                    Each week, members of Poéthra are invited to submit their original work based on a unique prompt. Submissions are reviewed by our panel, and the top writers are featured on our leaderboard. It's a chance to challenge yourself, gain recognition, and grow as a writer.
                </p>
                <Link to="/leaderboard">
                    <button className="bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-full text-base md:text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg">
                        View This Week's Leaderboard
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default HomePage;