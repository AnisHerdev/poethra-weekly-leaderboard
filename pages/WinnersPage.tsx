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

// ─── Mobile-only flip card ────────────────────────────────────────────────────
// A book-shaped flip card. Purely mobile — desktop layout is untouched.
//
// Bug fixes vs previous version:
//  1. `inset: 0` → explicit top/right/bottom/left (iOS Safari compatibility)
//  2. outer wrapper now has width:'100%' so maxWidth actually clamps correctly
//  3. page-stack effect via box-shadow (no extra DOM, no z-index/perspective fights)
const MobileWinnerCard: React.FC<{
    winner: WeeklyWinnerInfo;
    rank: number;
    onReadEntry: () => void;
}> = ({ winner, rank, onReadEntry }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const covers = [
        { bg: '#6B1C2A', spine: '#3D0D15', shadow: 'rgba(196,168,130,0.8)' },
        { bg: '#2C2C2C', spine: '#181818', shadow: 'rgba(184,184,184,0.8)' },
        { bg: '#7A3B10', spine: '#4A2008', shadow: 'rgba(196,168,130,0.8)' },
    ][rank - 1];

    const medals = ['🥇', '🥈', '🥉'];
    const labels = ['🥇 1st Place', '🥈 2nd Place', '🥉 3rd Place'];
    const spineW = 20;

    // Page-stack as box-shadow on the scene wrapper — no DOM cost, no z issues
    const pageStackShadow = `3px 0 0 ${covers.shadow}, 6px 0 0 ${covers.shadow.replace('0.8', '0.5')}, 9px 0 0 ${covers.shadow.replace('0.8', '0.25')}`;

    // Face shared base — CRITICAL: use explicit top/right/bottom/left, NOT inset:0
    // (inset shorthand is not supported on iOS Safari < 15)
    const face: React.CSSProperties = {
        position: 'absolute',
        top: 0, right: 0, bottom: 0, left: 0,   // ← explicit, safe everywhere
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        overflow: 'hidden',
        // Slight right-side rounding (page edge), flat left (spine)
        borderRadius: '2px 8px 8px 2px',
    };

    return (
        // width:'100%' is essential — without it, maxWidth clamps a 0-width block
        <div style={{ width: '100%', maxWidth: '240px', margin: '0 auto' }}>
            {/* Scene — perspective container. Its box-shadow mimics page edges */}
            <div style={{
                width: '100%',
                height: '340px',
                perspective: '1200px',
                boxShadow: pageStackShadow,
                borderRadius: '2px 8px 8px 2px',
            }}>
                {/* Flip card */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 650ms cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}>

                    {/* ── FRONT — book cover ───────────────────────────── */}
                    <div
                        style={{ ...face, backgroundColor: covers.bg, cursor: 'pointer' }}
                        onClick={() => setIsFlipped(true)}
                        role="button"
                        aria-label={`Open ${labels[rank - 1]} winner card`}
                    >
                        {/* Spine */}
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, bottom: 0,
                            width: spineW,
                            background: `linear-gradient(to right, ${covers.spine}, ${covers.bg})`,
                            zIndex: 2,
                        }} />

                        {/* Parchment texture */}
                        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none bg-parchment-texture" />

                        {/* Inset frame */}
                        <div style={{
                            position: 'absolute',
                            top: 14, right: 12, bottom: 14,
                            left: spineW + 10,
                            border: '1px solid rgba(245,236,215,0.2)',
                            borderRadius: '1px',
                            pointerEvents: 'none',
                            zIndex: 3,
                        }} />

                        {/* Cover content */}
                        <div style={{
                            position: 'absolute',
                            top: 22, right: 20, bottom: 22,
                            left: spineW + 18,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            zIndex: 4,
                        }}>
                            {/* Header */}
                            <div style={{ textAlign: 'center', width: '100%' }}>
                                <p style={{
                                    color: 'rgba(245,236,215,0.5)',
                                    fontSize: '7px',
                                    letterSpacing: '0.5em',
                                    fontFamily: 'Literata, serif',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    marginBottom: 6,
                                }}>Poéthra</p>
                                <div style={{ height: 1, width: '100%', background: 'rgba(245,236,215,0.15)' }} />
                            </div>

                            {/* Medal */}
                            <span style={{
                                fontSize: '56px',
                                lineHeight: 1,
                                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.55))',
                            }}>
                                {medals[rank - 1]}
                            </span>

                            {/* Footer */}
                            <div style={{ textAlign: 'center', width: '100%' }}>
                                <div style={{ height: 1, width: '100%', background: 'rgba(245,236,215,0.15)', marginBottom: 6 }} />
                                <p style={{
                                    color: 'rgba(245,236,215,0.3)',
                                    fontSize: '7px',
                                    letterSpacing: '0.4em',
                                    fontFamily: 'Literata, serif',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                }}>Tap to open</p>
                            </div>
                        </div>
                    </div>

                    {/* ── BACK — winner details ─────────────────────────── */}
                    <div
                        style={{
                            ...face,
                            backgroundColor: '#F5ECD7',
                            transform: 'rotateY(180deg)',
                            cursor: 'pointer',
                        }}
                        onClick={() => setIsFlipped(false)}
                        role="button"
                        aria-label="Tap to flip back"
                    >
                        {/* Inner frame */}
                        <div style={{
                            position: 'absolute',
                            top: 10, right: 10, bottom: 10, left: 10,
                            border: '1px solid rgba(107,28,42,0.12)',
                            borderRadius: '1px',
                            pointerEvents: 'none',
                            zIndex: 1,
                        }} />

                        {/* Content */}
                        <div style={{
                            position: 'absolute',
                            top: 24, right: 20, bottom: 24, left: 20,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            zIndex: 2,
                        }}>
                            <div>
                                <p style={{
                                    fontSize: '8px',
                                    letterSpacing: '0.42em',
                                    color: '#6B1C2A',
                                    fontFamily: 'Literata, serif',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    marginBottom: 14,
                                }}>{labels[rank - 1]}</p>

                                <p style={{
                                    fontFamily: 'Petrona, serif',
                                    fontWeight: 900,
                                    fontSize: '22px',
                                    color: '#1c1917',
                                    lineHeight: 1.2,
                                    marginBottom: 12,
                                }}>{winner.name}</p>

                                {/* Ornament */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                                    <div style={{ flex: 1, height: 1, background: 'rgba(107,28,42,0.15)' }} />
                                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(107,28,42,0.22)' }} />
                                    <div style={{ flex: 1, height: 1, background: 'rgba(107,28,42,0.15)' }} />
                                </div>

                                <p style={{
                                    fontFamily: 'Petrona, serif',
                                    fontStyle: 'italic',
                                    fontSize: '15px',
                                    color: '#57534e',
                                    lineHeight: 1.45,
                                }}>
                                    &ldquo;{winner.title || 'Untitled'}&rdquo;
                                </p>
                            </div>

                            <button
                                style={{ alignSelf: 'flex-start' }}
                                className="text-[10px] uppercase tracking-[0.32em] font-sans font-black text-oxblood border-b border-oxblood/25 pb-px hover:border-oxblood transition-colors"
                                onClick={(e) => { e.stopPropagation(); onReadEntry(); }}
                                aria-label={`Read ${winner.name}'s full entry`}
                            >
                                Read Full Entry &rarr;
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
// ─────────────────────────────────────────────────────────────────────────────

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
                        <div className="flex items-center gap-4 md:gap-8 bg-oxblood/5 dark:bg-parchment/5 px-4 md:px-8 py-3 md:py-4 rounded-full border border-oxblood/10 dark:border-parchment/10 w-full max-w-sm md:max-w-none md:w-auto">
                            <button 
                                onClick={handlePrev} 
                                disabled={currentIndex >= allResults.length - 1} 
                                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-600 dark:text-stone-400 hover:text-oxblood dark:hover:text-parchment disabled:opacity-20 transition-all"
                                aria-label="Previous Week"
                            >
                                <ChevronLeftIcon />
                            </button>
                            
                            <div className="text-center flex-1 md:min-w-[200px]">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-oxblood/60 dark:text-parchment/40 font-black mb-1">Weekly Chronicle</p>
                                <h2 className="font-display text-base md:text-2xl font-bold text-ink dark:text-parchment">
                                    Week {currentResult.weekNumber} <span className="text-stone-400 italic font-medium">— {currentResult.semester} {currentResult.year}</span>
                                </h2>
                            </div>

                            <button 
                                onClick={handleNext} 
                                disabled={currentIndex === 0} 
                                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-600 dark:text-stone-400 hover:text-oxblood dark:hover:text-parchment disabled:opacity-20 transition-all"
                                aria-label="Next Week"
                            >
                                <ChevronRightIcon />
                            </button>
                        </div>

                        {/* The Shelf of Champions */}
                        {/* Mobile: vertical stacked list. Desktop: side-by-side shelf */}
                        
                        {/* MOBILE LAYOUT — 3D flip cards (mobile-only, md:hidden) */}
                        <div className="flex flex-col gap-5 w-full md:hidden">
                            {[
                                { winner: currentResult.winners.first,  rank: 1 },
                                { winner: currentResult.winners.second, rank: 2 },
                                { winner: currentResult.winners.third,  rank: 3 },
                            ].map(({ winner, rank }) => (
                                <MobileWinnerCard
                                    key={rank}
                                    winner={winner}
                                    rank={rank}
                                    onReadEntry={() => handleOpenModal(winner, rank)}
                                />
                            ))}
                        </div>

                        {/* DESKTOP LAYOUT — shelf with 3D books */}
                        <div className="hidden md:block relative w-full aspect-[21/9] bg-ink/5 dark:bg-parchment/5 rounded-[40px] border border-oxblood/5 dark:border-parchment/5 bg-parchment-texture overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-t from-oxblood/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            
                            <div className="absolute inset-0 flex items-end justify-center pb-16 gap-x-16 lg:gap-x-24">
                                <div className="transition-all duration-700 hover:-translate-y-4">
                                    <WinnerBook
                                        winnerName={currentResult.winners.second.name}
                                        rank={2}
                                        title={currentResult.winners.second.title || "Untitled"}
                                        onClick={() => handleOpenModal(currentResult.winners.second, 2)}
                                    />
                                </div>
                                <div className="mb-12 scale-125 z-20 transition-all duration-700 hover:-translate-y-4">
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

                            <div className="absolute bottom-12 left-20 right-20 h-px bg-gradient-to-r from-transparent via-oxblood/20 dark:via-parchment/20 to-transparent"></div>
                            <div className="absolute bottom-6 left-0 right-0 text-center opacity-100">
                                <span className="font-display italic text-sm dark:text-stone-500 uppercase tracking-widest">Select a volume to read its script</span>
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