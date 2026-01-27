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
    const bookVisibilityClass = isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0';

    if (!winner) {
        // Render an empty div when there is no winner to allow for fade-out animations
        return <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${modalVisibilityClass}`} />;
    }

    const medal = ['🥇', '🥈', '🥉'][winner.rank - 1];
    const rankTextColors = {
        1: 'text-amber-700 dark:text-yellow-300',
        2: 'text-slate-700 dark:text-slate-300',
        3: 'text-orange-700 dark:text-amber-400',
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity duration-300 ${modalVisibilityClass}`}
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className={`relative w-full max-w-lg md:max-w-4xl h-auto max-h-[90vh] md:h-[80vh] transform-gpu transition-all duration-300 ease-out ${bookVisibilityClass} flex flex-col md:block`}
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 md:-top-4 md:-right-4 text-white hover:text-yellow-300 transition-colors z-30 bg-black/50 md:bg-black/30 rounded-full p-2"
                    aria-label="Close"
                >
                    <CloseIcon />
                </button>

                {/* Book Container */}
                <div className="w-full h-full flex flex-col md:flex-row perspective-1000">
                    {/* Left Page */}
                    <div className="w-full h-1/2 md:w-1/2 md:h-full bg-[#fdf6e7] dark:bg-[#2c271f] rounded-t-lg md:rounded-l-lg md:rounded-r-none shadow-2xl p-6 md:p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
                        <div>
                            <h2 className={`font-lora text-3xl md:text-5xl font-bold ${rankTextColors[winner.rank as keyof typeof rankTextColors]}`}>{winner.name} <span className="text-3xl md:text-4xl">{medal}</span></h2>
                            <p className="text-stone-600 dark:text-stone-400 mt-2 text-base md:text-lg">Winner of the Week</p>
                        </div>
                        <div className="text-center">
                            <p className="text-stone-500 dark:text-stone-500 italic">Winning Entry</p>
                            <h3 className="font-lora text-xl md:text-3xl text-stone-800 dark:text-stone-200 mt-1">"{winner.title}"</h3>
                        </div>
                        <div className="text-center">
                            <p className="font-lora text-2xl text-amber-800 dark:text-yellow-500">Poéthra</p>
                            <p className="text-xs text-stone-400 dark:text-stone-600 uppercase tracking-widest">Hall of Champions</p>
                        </div>
                    </div>

                    {/* Right Page (The Work) */}
                    <div className="w-full h-1/2 md:w-1/2 md:h-full bg-[#fdf6e7] dark:bg-[#2c271f] rounded-b-lg md:rounded-r-lg md:rounded-l-none shadow-2xl p-6 md:p-8 lg:p-12 flex items-center justify-center overflow-y-auto">
                        <div className="w-full h-full border-4 border-amber-800/20 dark:border-yellow-200/20 p-4 border-dashed flex flex-col items-center justify-start text-center overflow-y-auto">
                            <h4 className="font-lora text-xl md:text-2xl text-stone-700 dark:text-stone-300 mb-4 sticky top-0 bg-[#fdf6e7] dark:bg-[#2c271f] py-2 w-full">A Glimpse of Brilliance</h4>
                            <div className="text-stone-600 dark:text-stone-300 leading-relaxed text-sm md:text-base whitespace-pre-wrap text-left w-full">
                                {winner.content ? (
                                    winner.content
                                ) : (
                                    <p className="text-center italic text-stone-500 dark:text-stone-500">
                                        (No content available for this entry.)
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Spine Shadow */}
                    <div className="absolute top-0 left-1/2 w-8 h-full bg-gradient-to-r from-black/20 to-transparent -translate-x-1/2 blur-sm pointer-events-none hidden md:block"></div>
                </div>
            </div>

            {/* Flickering light effect */}
            <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-400/5 dark:bg-yellow-400/10 rounded-full filter blur-3xl opacity-40 dark:opacity-60 animate-pulse-slow"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500/5 dark:bg-purple-500/10 rounded-full filter blur-3xl opacity-40 dark:opacity-60 animate-pulse-slow animation-delay-3000"></div>
        </div>
    );
};

export default WinnerModal;