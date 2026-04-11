import React, { useState, useMemo, useEffect } from 'react';
import { fetchWeeklyResults } from '../services/leaderboardService';
import { WeeklyResult, WeeklyWinnerInfo } from '../types';
import WinnerBook from '../components/WinnerBook';
import WinnerModal from '../components/WinnerModal';
import { BookOpenIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/icons/UIIcons';

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
            setAllResults(results);
            setCurrentIndex(0);
        };
        loadResults();
    }, []);

    const currentResult = useMemo(() => {
        return allResults.length > 0 ? allResults[currentIndex] : null;
    }, [allResults, currentIndex]);

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
            title: winner.title || "Untitled",
            content: winner.content
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedWinner(null), 300);
    };

    return (
        <div className="flex flex-col items-center gap-12 py-10">
            {/* HERO SECTION */}
            <section className="text-center space-y-4 max-w-3xl px-6 animate-fade-in-up">
                <span className="text-xs font-sans uppercase tracking-[0.5em] text-oxblood font-black opacity-60">The Archive</span>
                <h1 className="text-5xl md:text-8xl font-display font-black text-ink dark:text-parchment tracking-tighter italic uppercase">
                    The Winners' Nook
                </h1>
                <p className="text-stone-500 dark:text-stone-400 italic text-lg leading-relaxed">
                    "A tribute to the triumphant wordsmiths of Poéthra. Here, the chronicles of victory are enshrined in ink and memory."
                </p>
            </section>

            {/* CONTENT SECTION */}
            <main className="w-full max-w-6xl px-6 flex flex-col items-center gap-8">
                {currentResult ? (
                    <>
                        {/* Week Navigation */}
                        <div className="flex items-center gap-8 bg-oxblood/5 dark:bg-parchment/5 px-8 py-4 rounded-full border border-oxblood/10 dark:border-parchment/10 group animate-fade-in-up">
                            <button 
                                onClick={handlePrev} 
                                disabled={currentIndex >= allResults.length - 1} 
                                className="p-2 text-stone-600 dark:text-stone-400 hover:text-oxblood dark:hover:text-parchment disabled:opacity-20 transition-all transform hover:scale-125"
                                aria-label="Previous Week"
                            >
                                <ChevronLeftIcon />
                            </button>
                            
                            <div className="text-center min-w-[200px]">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-oxblood/60 dark:text-parchment/40 font-black mb-1">Weekly Chronicle</p>
                                <h2 className="font-display text-xl md:text-2xl font-bold text-ink dark:text-parchment">
                                    Week {currentResult.weekNumber} <span className="text-stone-400 italic font-medium ml-2">— {currentResult.semester} {currentResult.year}</span>
                                </h2>
                            </div>

                            <button 
                                onClick={handleNext} 
                                disabled={currentIndex === 0} 
                                className="p-2 text-stone-600 dark:text-stone-400 hover:text-oxblood dark:hover:text-parchment disabled:opacity-20 transition-all transform hover:scale-125"
                                aria-label="Next Week"
                            >
                                <ChevronRightIcon />
                            </button>
                        </div>

                        {/* The Shelf of Champions */}
                        <div className="relative w-full aspect-video md:aspect-[21/9] flex items-end justify-center py-16 px-4 bg-ink/5 dark:bg-parchment/5 rounded-[40px] border border-oxblood/5 dark:border-parchment/5 bg-parchment-texture overflow-hidden group">
                            {/* Artistic Background Element */}
                            <div className="absolute inset-0 bg-gradient-to-t from-oxblood/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            
                            {/* The Books */}
                            <div className="flex justify-center items-end gap-x-8 md:gap-x-16 lg:gap-x-24 z-10">
                                <div className="transition-all duration-700 hover:-translate-y-4">
                                    <WinnerBook
                                        winnerName={currentResult.winners.second.name}
                                        rank={2}
                                        title={currentResult.winners.second.title || "Untitled"}
                                        onClick={() => handleOpenModal(currentResult.winners.second, 2)}
                                    />
                                </div>
                                <div className="mb-8 md:mb-12 scale-110 md:scale-125 z-20 transition-all duration-700 hover:-translate-y-4">
                                    <WinnerBook
                                        winnerName={currentResult.winners.first.name}
                                        rank={1}
                                        title={currentResult.winners.first.title || "Untitled"}
                                        onClick={() => handleOpenModal(currentResult.winners.first, 1)}
                                    />
                                </div>
                                <div className="transition-all duration-700 hover:-translate-y-4">
                                    <WinnerBook
                                        winnerName={currentResult.winners.third.name}
                                        rank={3}
                                        title={currentResult.winners.third.title || "Untitled"}
                                        onClick={() => handleOpenModal(currentResult.winners.third, 3)}
                                    />
                                </div>
                            </div>

                            {/* The Minimalist Shelf Line */}
                            <div className="absolute bottom-12 left-20 right-20 h-px bg-gradient-to-r from-transparent via-oxblood/20 dark:via-parchment/20 to-transparent"></div>
                            <div className="absolute bottom-6 left-0 right-0 text-center opacity-20">
                                <span className="font-display italic text-sm text-stone-500 uppercase tracking-widest">Select a volume to read its script</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-32 space-y-6 opacity-100">
                        <div className="flex justify-center"><BookOpenIcon /></div>
                        <h2 className="text-3xl font-display font-black italic">The Archives are Empty</h2>
                        <p className="max-w-md mx-auto italic">No weekly winners have been recorded in this ledger yet. Stories are being written as we speak.</p>
                    </div>
                )}
            </main>

            <WinnerModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                winner={selectedWinner}
            />
        </div>
    );
};

export default WinnersPage;