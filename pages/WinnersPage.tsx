import React, { useState, useMemo, useEffect } from 'react';
import { fetchWeeklyResults } from '../services/leaderboardService';
import { WeeklyResult, WeeklyWinnerInfo } from '../types';
import WinnerBook from '../components/WinnerBook';
import WinnerModal from '../components/WinnerModal';
import { BookOpenIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/icons/UIIcons';

const placeholderTitles = [
    "Whispers of the Quill", "The Starlight Manuscript", "Chronicles of Ember",
    "A Bard's Last Rhyme", "The Sunken City's Secret", "Ode to a Forgotten Star",
    "Where the River Bends", "The Clockwork Nightingale", "Echoes in the Mist",
];

interface SelectedWinner {
    name: string;
    rank: number;
    title: string;
    content?: string;
}

const WinnersPage: React.FC = () => {
    const [allResults, setAllResults] = useState<WeeklyResult[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWinner, setSelectedWinner] = useState<SelectedWinner | null>(null);

    useEffect(() => {
        const loadResults = async () => {
            const results = await fetchWeeklyResults();
            // Sort by year desc, then weekNumber desc (already done in service, but good to be safe)
            // Actually service does it, so just set it.
            setAllResults(results);
            setCurrentIndex(0);
        };
        loadResults();
    }, []);

    const currentResult = useMemo(() => {
        return allResults.length > 0 ? allResults[currentIndex] : null;
    }, [allResults, currentIndex]);

    const getPlaceholderTitle = (week: number, rank: number) => {
        // Simple seeded random to keep titles consistent for a winner
        const seed = week * 10 + rank;
        return placeholderTitles[seed % placeholderTitles.length];
    }

    const handlePrev = () => {
        setCurrentIndex(prev => Math.min(allResults.length - 1, prev + 1));
    };

    const handleNext = () => {
        setCurrentIndex(prev => Math.max(0, prev - 1));
    };

    const handleOpenModal = (winner: WeeklyWinnerInfo, rank: number) => {
        if (!currentResult) return;
        setSelectedWinner({
            name: winner.name,
            rank,
            title: getPlaceholderTitle(currentResult.weekNumber, rank),
            content: winner.content
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Delay clearing data to allow for fade-out animation
        setTimeout(() => setSelectedWinner(null), 300);
    };

    return (
        <div className="relative w-full flex flex-col items-center bg-[#fdf6e7] dark:bg-[#1a113c] text-stone-900 dark:text-white font-lora">

            {/* HERO SECTION */}
            <section className="w-full relative py-12 bg-gradient-radial from-amber-100/50 to-transparent dark:from-[#3c2a8c]/50 at-top">
                <div className="text-center z-10 animate-fade-in-up px-4">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600 dark:from-yellow-300 dark:to-amber-400 dark:drop-shadow-[0_0_8px_rgba(253,224,71,0.5)]">
                        The Winners' Nook
                    </h1>
                    <p className="mb-10 mt-4 text-base sm:text-lg text-stone-600 dark:text-gray-300 max-w-2xl mx-auto font-sans">
                        A tribute to the triumphant wordsmiths of Poéthra. Here, the chronicles of their weekly victories are enshrined.
                    </p>
                </div>

                {/* SVG Shape Divider */}
                <div className="absolute bottom-0 left-0 w-full" style={{ lineHeight: 0 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 100" preserveAspectRatio="none" className="w-full h-[70px] md:h-[100px]">
                        <path d="M0,100 C250,0 550,0 800,100 Z" className="fill-[#fdf6e7] dark:fill-[#1a113c]" />
                    </svg>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <main className="w-full z-10 px-4 pb-8 flex-grow flex flex-col items-center justify-center">
                {currentResult ? (
                    <div className="w-full max-w-5xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="flex justify-between items-center mb-8 px-4">
                            <button onClick={handlePrev} disabled={currentIndex >= allResults.length - 1} className="p-2 rounded-full text-stone-700 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                <ChevronLeftIcon /> <span className="sr-only">Previous Week</span>
                            </button>
                            <h2 className="text-2xl sm:text-3xl font-bold text-amber-800 dark:text-yellow-200 text-center">
                                {currentResult.year} {currentResult.semester} - Week {currentResult.weekNumber}
                            </h2>
                            <button onClick={handleNext} disabled={currentIndex === 0} className="p-2 rounded-full text-stone-700 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                <ChevronRightIcon /> <span className="sr-only">Next Week</span>
                            </button>
                        </div>

                        {/* The Winners' Nook */}
                        <div className="relative w-full pt-12 pb-16 px-4 sm:pt-16 sm:pb-20 sm:px-8 bg-gradient-to-b from-amber-200 to-amber-300 dark:from-[#4a2e1c] dark:to-[#2a1d13] rounded-lg shadow-[inset_0_4px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_8px_16px_rgba(0,0,0,0.6)] border-t-2 border-amber-300 dark:border-amber-950">

                            {/* The Books */}
                            <div className="flex justify-center md:justify-around items-end gap-x-4 gap-y-12 sm:gap-12 md:gap-8 flex-wrap">
                                <div className="md:mt-8">
                                    <WinnerBook
                                        winnerName={currentResult.winners.second.name}
                                        rank={2}
                                        title={currentResult.winners.second.title || getPlaceholderTitle(currentResult.weekNumber, 2)}
                                        onClick={() => handleOpenModal(currentResult.winners.second, 2)}
                                    />
                                </div>
                                <div className="order-first md:order-none md:-mb-8 md:scale-110 z-10">
                                    <WinnerBook
                                        winnerName={currentResult.winners.first.name}
                                        rank={1}
                                        title={currentResult.winners.first.title || getPlaceholderTitle(currentResult.weekNumber, 1)}
                                        onClick={() => handleOpenModal(currentResult.winners.first, 1)}
                                    />
                                </div>
                                <div className="md:mt-8">
                                    <WinnerBook
                                        winnerName={currentResult.winners.third.name}
                                        rank={3}
                                        title={currentResult.winners.third.title || getPlaceholderTitle(currentResult.weekNumber, 3)}
                                        onClick={() => handleOpenModal(currentResult.winners.third, 3)}
                                    />
                                </div>
                            </div>

                            {/* The Wooden Shelf */}
                            <div className="absolute bottom-0 left-0 right-0 h-12 perspective-1000">
                                <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-b from-amber-300 to-amber-400 dark:from-[#4a2e1c] dark:to-[#3a2214] shadow-lg shadow-black/20 dark:shadow-black/50" /> {/* Shelf top */}
                                <div className="absolute bottom-0 left-0 right-0 h-8 bg-amber-400 dark:bg-[#3a2214] border-t border-amber-500/50 dark:border-amber-900/50" style={{ transform: 'translateY(100%) rotateX(-70deg)', transformOrigin: 'top center' }} /> {/* Shelf front edge */}
                                <p className="absolute bottom-1 left-0 right-0 text-center text-xs text-amber-800/50 dark:text-amber-200/50 uppercase tracking-widest font-lora">The Shelf of Champions</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center flex flex-col items-center animate-fade-in-up px-4">
                        <BookOpenIcon />
                        <h2 className="text-2xl sm:text-3xl font-bold mt-4 text-amber-800 dark:text-yellow-200">The Archives are Empty</h2>
                        <p className="mt-2 text-stone-500 dark:text-gray-400 font-sans text-sm sm:text-base">No weekly winners have been recorded yet.</p>
                        <p className="text-stone-500 dark:text-gray-400 font-sans text-sm sm:text-base">An admin must submit results to begin the chronicles.</p>
                    </div>
                )}
            </main>

            {/* Background glowing orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/5 dark:bg-yellow-400/10 rounded-full filter blur-3xl opacity-30 dark:opacity-50 animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full filter blur-3xl opacity-30 dark:opacity-50 animate-pulse-slow animation-delay-3000"></div>

            <WinnerModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                winner={selectedWinner}
            />
        </div>
    );
};

export default WinnersPage;