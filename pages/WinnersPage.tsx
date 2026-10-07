import React, { useState, useMemo, useEffect } from 'react';
import { fetchWeeklyResults } from '../services/leaderboardService';
import { NormalizedWeeklyResult, WeeklyWinnerInfo } from '../types';
import WinnerBook from '../components/WinnerBook';
import WinnerModal from '../components/WinnerModal';
import { BookOpenIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/icons/UIIcons';

interface ModalState {
    winner: WeeklyWinnerInfo;
    rank: number;
    isJoint: boolean;
    coWinners: WeeklyWinnerInfo[];
    activeCoWinnerIndex: number;
}

const WinnersPage: React.FC = () => {
    const [allResults, setAllResults] = useState<NormalizedWeeklyResult[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [tierIndices, setTierIndices] = useState<{ 1: number; 2: number; 3: number }>({ 1: 0, 2: 0, 3: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState<ModalState | null>(null);

    useEffect(() => {
        const loadResults = async () => {
            const results = await fetchWeeklyResults();
            setAllResults(results);
            setCurrentIndex(0);
            setTierIndices({ 1: 0, 2: 0, 3: 0 });
        };
        loadResults();
    }, []);

    const currentResult = useMemo(() => {
        return allResults.length > 0 ? allResults[currentIndex] : null;
    }, [allResults, currentIndex]);

    // Reset tier pagination when switching weeks
    const handlePrevWeek = () => {
        setCurrentIndex(prev => {
            const next = Math.min(allResults.length - 1, prev + 1);
            setTierIndices({ 1: 0, 2: 0, 3: 0 });
            return next;
        });
    };

    const handleNextWeek = () => {
        setCurrentIndex(prev => {
            const next = Math.max(0, prev - 1);
            setTierIndices({ 1: 0, 2: 0, 3: 0 });
            return next;
        });
    };

    const handleTierPrev = (rank: 1 | 2 | 3, e: React.MouseEvent) => {
        e.stopPropagation();
        setTierIndices(prev => ({
            ...prev,
            [rank]: Math.max(0, (prev[rank] || 0) - 1)
        }));
    };

    const handleTierNext = (rank: 1 | 2 | 3, totalCount: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setTierIndices(prev => ({
            ...prev,
            [rank]: Math.min(totalCount - 1, (prev[rank] || 0) + 1)
        }));
    };

    const handleOpenModal = (winner: WeeklyWinnerInfo, rank: number, coWinners: WeeklyWinnerInfo[], winnerIndex: number) => {
        if (!currentResult) return;
        setModalState({
            winner,
            rank,
            isJoint: coWinners.length > 1,
            coWinners,
            activeCoWinnerIndex: winnerIndex,
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setModalState(null), 300);
    };

    const handleSelectCoWinnerInModal = (newIndex: number) => {
        if (!modalState || !modalState.coWinners[newIndex]) return;
        setModalState(prev => prev ? {
            ...prev,
            winner: prev.coWinners[newIndex],
            activeCoWinnerIndex: newIndex,
        } : null);

        // Keep desktop tier index in sync with modal navigation
        const rankKey = modalState.rank as 1 | 2 | 3;
        if (rankKey === 1 || rankKey === 2 || rankKey === 3) {
            setTierIndices(prev => ({
                ...prev,
                [rankKey]: newIndex
            }));
        }
    };

    // Mobile linear list of all winners across all tiers
    const mobileWinnersList = useMemo(() => {
        if (!currentResult) return [];
        const firsts = (currentResult.winners.first || []).map((w, idx) => ({
            winner: w,
            rank: 1,
            isJoint: currentResult.winners.first.length > 1,
            coWinners: currentResult.winners.first,
            indexInTier: idx,
            totalInTier: currentResult.winners.first.length,
        }));
        const seconds = (currentResult.winners.second || []).map((w, idx) => ({
            winner: w,
            rank: 2,
            isJoint: currentResult.winners.second.length > 1,
            coWinners: currentResult.winners.second,
            indexInTier: idx,
            totalInTier: currentResult.winners.second.length,
        }));
        const thirds = (currentResult.winners.third || []).map((w, idx) => ({
            winner: w,
            rank: 3,
            isJoint: currentResult.winners.third.length > 1,
            coWinners: currentResult.winners.third,
            indexInTier: idx,
            totalInTier: currentResult.winners.third.length,
        }));
        return [...firsts, ...seconds, ...thirds];
    }, [currentResult]);

    // Active winners for Desktop Podium
    const firstWinners = currentResult?.winners.first || [];
    const secondWinners = currentResult?.winners.second || [];
    const thirdWinners = currentResult?.winners.third || [];

    const activeFirstWinner = firstWinners[tierIndices[1]] || firstWinners[0];
    const activeSecondWinner = secondWinners[tierIndices[2]] || secondWinners[0];
    const activeThirdWinner = thirdWinners[tierIndices[3]] || thirdWinners[0];

    return (
        <div className="flex flex-col items-center gap-12 py-10">
            {/* HERO SECTION */}
            <section className="text-center space-y-4 max-w-3xl px-6 animate-fade-in-up">
                <span className="text-xs font-sans uppercase tracking-[0.5em] text-oxblood dark:text-oxblood-bright font-black opacity-80">The Archive</span>
                <h1 className="text-5xl md:text-8xl font-display font-black text-ink dark:text-parchment tracking-tighter italic uppercase">
                    The Winners' Nook
                </h1>
                <p className="text-stone-500 dark:text-parchment/60 italic text-lg leading-relaxed">
                    "A tribute to the triumphant wordsmiths of Poéthra. Here, the chronicles of victory are enshrined in ink and memory."
                </p>
            </section>

            {/* CONTENT SECTION */}
            <main className="w-full max-w-6xl px-6 flex flex-col items-center gap-8">
                {currentResult ? (
                    <>
                        {/* Week Navigation */}
                        <div className="flex items-center gap-4 md:gap-8 bg-oxblood/5 dark:bg-ink-light/50 px-4 md:px-8 py-3 md:py-4 rounded-full border border-oxblood/10 dark:border-parchment/10 w-full max-w-sm md:max-w-none md:w-auto">
                            <button 
                                onClick={handlePrevWeek} 
                                disabled={currentIndex >= allResults.length - 1} 
                                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-600 dark:text-parchment/80 hover:text-oxblood dark:hover:text-oxblood-bright disabled:opacity-20 transition-all cursor-pointer disabled:cursor-not-allowed"
                                aria-label="Previous Week"
                            >
                                <ChevronLeftIcon />
                            </button>
                            
                            <div className="text-center flex-1 md:min-w-[200px]">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-oxblood dark:text-oxblood-bright font-black mb-1">Weekly Chronicle</p>
                                <h2 className="font-display text-base md:text-2xl font-bold text-ink dark:text-parchment">
                                    Week {currentResult.weekNumber} <span className="text-stone-400 dark:text-parchment/50 italic font-medium">- {currentResult.semester} {currentResult.year}</span>
                                </h2>
                            </div>

                            <button 
                                onClick={handleNextWeek} 
                                disabled={currentIndex === 0} 
                                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-600 dark:text-parchment/80 hover:text-oxblood dark:hover:text-oxblood-bright disabled:opacity-20 transition-all cursor-pointer disabled:cursor-not-allowed"
                                aria-label="Next Week"
                            >
                                <ChevronRightIcon />
                            </button>
                        </div>

                        {/* The Shelf of Champions */}
                        {/* MOBILE LAYOUT - stacked book cards */}
                        <div className="flex flex-col gap-4 w-full md:hidden">
                            {mobileWinnersList.map(({ winner, rank, isJoint, coWinners, indexInTier, totalInTier }) => {
                                const rankOrdinal = ['1st', '2nd', '3rd'][rank - 1] || `${rank}th`;
                                const medal = ['🥇', '🥈', '🥉'][rank - 1] || '🎖️';
                                const rankLabel = isJoint 
                                    ? `${medal} Joint ${rankOrdinal} Place${totalInTier > 1 ? ` (${indexInTier + 1}/${totalInTier})` : ''}`
                                    : `${medal} ${rankOrdinal} Place`;

                                return (
                                    <button
                                        key={`${rank}-${winner.participantId || winner.name}-${indexInTier}`}
                                        onClick={() => handleOpenModal(winner, rank, coWinners, indexInTier)}
                                        className="w-full flex items-center gap-5 p-4 rounded-2xl bg-parchment-dark/30 dark:bg-ink-light/50 border border-oxblood/10 dark:border-parchment/10 text-left active:scale-[0.98] transition-transform"
                                        aria-label={`View ${winner.name}'s winning entry`}
                                    >
                                        <WinnerBook
                                            winnerName={winner.name}
                                            rank={rank}
                                            title={winner.title || 'Untitled'}
                                            onClick={() => {}}
                                            mobileMode={true}
                                            isJoint={isJoint}
                                        />
                                        <div className="min-w-0">
                                            <p className="text-[10px] uppercase tracking-[0.3em] text-oxblood dark:text-oxblood-bright font-black mb-1">{rankLabel}</p>
                                            <p className="font-display font-bold text-lg text-stone-900 dark:text-parchment">{winner.name}</p>
                                            {winner.title && (
                                                <p className="font-display italic text-sm text-stone-600 dark:text-parchment/70 truncate mt-0.5">
                                                    &ldquo;{winner.title}&rdquo;
                                                </p>
                                            )}
                                            <p className="mt-2 text-[10px] text-oxblood dark:text-oxblood-bright uppercase tracking-widest font-sans font-bold">Tap to read &rarr;</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* DESKTOP LAYOUT - shelf with 3D books & tier switcher */}
                        <div className="hidden md:block relative w-full aspect-[21/9] bg-ink-light/30 dark:bg-ink-light/70 rounded-[40px] border border-oxblood/5 dark:border-parchment/5 bg-parchment-texture overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-t from-oxblood/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            
                            <div className="absolute inset-0 flex items-end justify-center pb-16 gap-x-12 lg:gap-x-20">
                                {/* 2nd Place Column */}
                                {activeSecondWinner && (
                                    <div className="flex flex-col items-center transition-all duration-700 hover:-translate-y-4">
                                        <WinnerBook
                                            winnerName={activeSecondWinner.name}
                                            rank={2}
                                            title={activeSecondWinner.title || "Untitled"}
                                            isJoint={secondWinners.length > 1}
                                            onClick={() => handleOpenModal(activeSecondWinner, 2, secondWinners, tierIndices[2] || 0)}
                                        />
                                        {secondWinners.length > 1 && (
                                            <div className="mt-3 flex items-center justify-center gap-1.5 bg-oxblood/10 dark:bg-ink/70 border border-oxblood/20 dark:border-parchment/20 px-3 py-1 rounded-full backdrop-blur-sm z-30 shadow-md">
                                                <button 
                                                    onClick={(e) => handleTierPrev(2, e)}
                                                    disabled={(tierIndices[2] || 0) <= 0}
                                                    className="p-0.5 text-stone-700 dark:text-parchment hover:text-oxblood dark:hover:text-oxblood-bright disabled:opacity-20 transition-colors cursor-pointer disabled:cursor-not-allowed"
                                                    aria-label="Previous 2nd place joint winner"
                                                >
                                                    <ChevronLeftIcon className="h-3.5 w-3.5" />
                                                </button>
                                                <span className="text-[10px] font-sans font-bold uppercase tracking-wider whitespace-nowrap text-stone-800 dark:text-parchment">
                                                    Joint 2nd ({(tierIndices[2] || 0) + 1}/{secondWinners.length})
                                                </span>
                                                <button 
                                                    onClick={(e) => handleTierNext(2, secondWinners.length, e)}
                                                    disabled={(tierIndices[2] || 0) >= secondWinners.length - 1}
                                                    className="p-0.5 text-stone-700 dark:text-parchment hover:text-oxblood dark:hover:text-oxblood-bright disabled:opacity-20 transition-colors cursor-pointer disabled:cursor-not-allowed"
                                                    aria-label="Next 2nd place joint winner"
                                                >
                                                    <ChevronRightIcon className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* 1st Place Column (Elevated) */}
                                {activeFirstWinner && (
                                    <div className="mb-12 scale-125 z-20 flex flex-col items-center transition-all duration-700 hover:-translate-y-4">
                                        <WinnerBook
                                            winnerName={activeFirstWinner.name}
                                            rank={1}
                                            title={activeFirstWinner.title || "Untitled"}
                                            isJoint={firstWinners.length > 1}
                                            onClick={() => handleOpenModal(activeFirstWinner, 1, firstWinners, tierIndices[1] || 0)}
                                        />
                                        {firstWinners.length > 1 && (
                                            <div className="mt-3 flex items-center justify-center gap-1.5 bg-oxblood/10 dark:bg-ink/70 border border-oxblood/20 dark:border-parchment/20 px-3 py-1 rounded-full backdrop-blur-sm z-30 shadow-md">
                                                <button 
                                                    onClick={(e) => handleTierPrev(1, e)}
                                                    disabled={(tierIndices[1] || 0) <= 0}
                                                    className="p-0.5 text-stone-700 dark:text-parchment hover:text-oxblood dark:hover:text-oxblood-bright disabled:opacity-20 transition-colors cursor-pointer disabled:cursor-not-allowed"
                                                    aria-label="Previous 1st place joint winner"
                                                >
                                                    <ChevronLeftIcon className="h-3.5 w-3.5" />
                                                </button>
                                                <span className="text-[10px] font-sans font-bold uppercase tracking-wider whitespace-nowrap text-stone-800 dark:text-parchment">
                                                    Joint 1st ({(tierIndices[1] || 0) + 1}/{firstWinners.length})
                                                </span>
                                                <button 
                                                    onClick={(e) => handleTierNext(1, firstWinners.length, e)}
                                                    disabled={(tierIndices[1] || 0) >= firstWinners.length - 1}
                                                    className="p-0.5 text-stone-700 dark:text-parchment hover:text-oxblood dark:hover:text-oxblood-bright disabled:opacity-20 transition-colors cursor-pointer disabled:cursor-not-allowed"
                                                    aria-label="Next 1st place joint winner"
                                                >
                                                    <ChevronRightIcon className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* 3rd Place Column */}
                                {activeThirdWinner && (
                                    <div className="flex flex-col items-center transition-all duration-700 hover:-translate-y-4">
                                        <WinnerBook
                                            winnerName={activeThirdWinner.name}
                                            rank={3}
                                            title={activeThirdWinner.title || "Untitled"}
                                            isJoint={thirdWinners.length > 1}
                                            onClick={() => handleOpenModal(activeThirdWinner, 3, thirdWinners, tierIndices[3] || 0)}
                                        />
                                        {thirdWinners.length > 1 && (
                                            <div className="mt-3 flex items-center justify-center gap-1.5 bg-oxblood/10 dark:bg-ink/70 border border-oxblood/20 dark:border-parchment/20 px-3 py-1 rounded-full backdrop-blur-sm z-30 shadow-md">
                                                <button 
                                                    onClick={(e) => handleTierPrev(3, e)}
                                                    disabled={(tierIndices[3] || 0) <= 0}
                                                    className="p-0.5 text-stone-700 dark:text-parchment hover:text-oxblood dark:hover:text-oxblood-bright disabled:opacity-20 transition-colors cursor-pointer disabled:cursor-not-allowed"
                                                    aria-label="Previous 3rd place joint winner"
                                                >
                                                    <ChevronLeftIcon className="h-3.5 w-3.5" />
                                                </button>
                                                <span className="text-[10px] font-sans font-bold uppercase tracking-wider whitespace-nowrap text-stone-800 dark:text-parchment">
                                                    Joint 3rd ({(tierIndices[3] || 0) + 1}/{thirdWinners.length})
                                                </span>
                                                <button 
                                                    onClick={(e) => handleTierNext(3, thirdWinners.length, e)}
                                                    disabled={(tierIndices[3] || 0) >= thirdWinners.length - 1}
                                                    className="p-0.5 text-stone-700 dark:text-parchment hover:text-oxblood dark:hover:text-oxblood-bright disabled:opacity-20 transition-colors cursor-pointer disabled:cursor-not-allowed"
                                                    aria-label="Next 3rd place joint winner"
                                                >
                                                    <ChevronRightIcon className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="absolute bottom-12 left-20 right-20 h-px bg-gradient-to-r from-transparent via-oxblood/20 dark:via-parchment/20 to-transparent"></div>
                            <div className="absolute bottom-6 left-0 right-0 text-center opacity-100">
                                <span className="font-display italic text-sm text-stone-500 dark:text-parchment/50 uppercase tracking-widest">Select a volume to read its script</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-32 space-y-6 opacity-100">
                        <div className="flex justify-center"><BookOpenIcon /></div>
                        <h2 className="text-3xl font-display font-black italic text-stone-700 dark:text-parchment/80">The Archives are Empty</h2>
                        <p className="max-w-md mx-auto italic text-stone-600 dark:text-parchment/60">No weekly winners have been recorded in this ledger yet. Stories are being written as we speak.</p>
                    </div>
                )}
            </main>

            <WinnerModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                winner={modalState ? {
                    name: modalState.winner.name,
                    rank: modalState.rank,
                    title: modalState.winner.title || "Untitled",
                    content: modalState.winner.content
                } : null}
                isJoint={modalState?.isJoint}
                coWinners={modalState?.coWinners}
                activeCoWinnerIndex={modalState?.activeCoWinnerIndex}
                onSelectCoWinner={handleSelectCoWinnerInModal}
            />
        </div>
    );
};

export default WinnersPage;