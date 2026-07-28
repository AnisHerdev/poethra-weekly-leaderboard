import React, { useEffect } from 'react';
import { CloseIcon } from './icons/UIIcons';

interface WinnerModalProps {
    isOpen: boolean;
    onClose: () => void;
    winner: {
        name: string;
        rank: number;
        title: string;
        content?: string;
    } | null;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ isOpen, onClose, winner }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const modalVisibilityClass = isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none';
    const bookVisibilityClass = isOpen ? 'scale-100 opacity-100 rotate-0' : 'scale-95 opacity-0 -rotate-1';

    if (!winner) {
        return <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${modalVisibilityClass}`} />;
    }

    const medal = ['🥇', '🥈', '🥉'][winner.rank - 1];
    const rankColors = {
        1: 'text-oxblood dark:text-parchment',
        2: 'text-stone-600 dark:text-parchment/60',
        3: 'text-amber-800 dark:text-amber-500',
    };

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/80 dark:bg-ink/95 backdrop-blur-xl transition-opacity duration-500 ${modalVisibilityClass}`}
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className={`relative w-full max-w-lg md:max-w-5xl h-auto max-h-[90vh] md:h-[85vh] transform-gpu transition-all duration-700 ease-out ${bookVisibilityClass} flex flex-col md:block shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]`}
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button - More elegant */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 md:-right-12 text-parchment hover:text-oxblood dark:hover:text-lamplight transition-all duration-300 z-[110] bg-white/5 md:bg-transparent rounded-full p-2 group"
                    aria-label="Close"
                >
                    <div className="group-hover:rotate-90 transition-transform duration-300">
                        <CloseIcon />
                    </div>
                </button>

                {/* Book Container */}
                <div className="w-full h-full flex flex-col md:flex-row perspective-1000 bg-parchment-texture overflow-hidden rounded-xl border border-oxblood/10 dark:border-parchment/10">
                    {/* Left Page (The Recognition) */}
                    <div className="w-full h-2/5 md:w-1/2 md:h-full bg-parchment dark:bg-ink-light/50 p-8 md:p-14 flex flex-col justify-between relative overflow-hidden bg-parchment-texture">
                        {/* Corner Detail */}
                        <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-oxblood/5 pointer-events-none"></div>
                        
                        <div className="relative z-10 space-y-2">
                            <span className="text-xs font-sans uppercase tracking-[0.4em] text-oxblood/40 dark:text-parchment/30 font-black">Archive Entry No. {winner.rank}</span>
                            <h2 className={`font-display text-4xl md:text-6xl font-black italic tracking-tighter ${rankColors[winner.rank as keyof typeof rankColors]}`}>
                                {winner.name} <span className="text-3xl md:text-5xl not-italic ml-2">{medal}</span>
                            </h2>
                            <div className="w-12 h-0.5 bg-oxblood/20"></div>
                        </div>

                        <div className="text-center relative z-10 py-8 md:py-0">
                            <p className="text-stone-600 dark:text-parchment/50 italic text-sm uppercase tracking-widest mb-4 font-sans">Winning Title</p>
                            <h3 className="font-display text-2xl md:text-4xl text-stone-900 dark:text-parchment leading-tight">
                                "{winner.title}"
                            </h3>
                        </div>

                        <div className="text-center relative z-10 border-t border-oxblood/5 pt-8">
                            <p className="font-display text-3xl text-oxblood dark:text-parchment italic font-black">Poéthra</p>
                            <p className="text-[10px] text-stone-600 dark:text-parchment/50 uppercase tracking-[0.5em] mt-1 font-sans">The Repository of Souls</p>
                        </div>
                    </div>

                    {/* Spine Gutter Shadow */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-12 -translate-x-1/2 bg-gradient-to-r from-ink/20 via-ink/30 to-ink/20 dark:from-black/20 dark:via-black/30 dark:to-black/20 z-20 pointer-events-none blur-[1px]"></div>

                    {/* Right Page (The Work) */}
                    <div className="w-full h-3/5 md:w-1/2 md:h-full bg-parchment-dark dark:bg-ink-light/50 p-8 md:p-14 flex flex-col bg-parchment-texture relative">
                        <div className="relative z-10 flex flex-col h-full">
                            <h4 className="font-display text-lg md:text-xl text-stone-600 dark:text-parchment/50 uppercase tracking-[0.3em] mb-10 text-center">The Script</h4>
                            <div className="flex-grow overflow-y-auto px-4 md:px-0">
                                <div className="text-stone-700 dark:text-parchment/80 leading-[1.8] text-base md:text-lg font-sans font-medium whitespace-pre-wrap max-w-prose mx-auto">
                                    {winner.content ? (
                                        winner.content
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center gap-4 opacity-80">
                                            <div className="w-12 h-px bg-stone-400 dark:bg-parchment/30"></div>
                                            <p className="italic text-stone-600 dark:text-parchment/60 text-center font-display text-lg">
                                                (The ink fades... This entry exists only in memory.)
                                            </p>
                                            <div className="w-12 h-px bg-stone-400 dark:bg-parchment/30"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Page Number-like detail */}
                                <div className="mt-8 text-center text-[10px] font-sans text-stone-600 dark:text-parchment/50 uppercase tracking-widest opacity-70">
                                Folio {new Date().getFullYear()}-II
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Atmosphere orbs */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-oxblood/5 rounded-full filter blur-[120px] pointer-events-none animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-parchment/5 rounded-full filter blur-[120px] pointer-events-none animate-pulse-slow animation-delay-3000"></div>
        </div>
    );
};

export default WinnerModal;