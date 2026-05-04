import React from 'react';

interface WinnerBookProps {
    winnerName: string;
    rank: number;
    title: string;
    onClick: () => void;
    /** When true, hides the author name + label and promotes the title as the dominant cover element (mobile-only) */
    mobileMode?: boolean;
}

const WinnerBook: React.FC<WinnerBookProps> = ({ winnerName, rank, title, onClick, mobileMode = false }) => {
    const rankColors = {
        1: 'from-oxblood to-[#4A111D] border-oxblood-light/20 shadow-oxblood/40',
        2: 'from-stone-600 to-stone-800 border-stone-500/20 shadow-stone-900/40',
        3: 'from-amber-800 to-amber-950 border-amber-700/20 shadow-amber-900/40',
    };

    const rankSpineColors = {
        1: 'from-[#4A111D] to-oxblood',
        2: 'from-stone-900 to-stone-700',
        3: 'from-amber-950 to-amber-900',
    };

    const medal = ['🥇', '🥈', '🥉'][rank - 1];
    
    return (
        <button 
            className="group perspective-1000 bg-transparent border-none text-left p-0 cursor-pointer block focus-visible:outline-oxblood dark:focus-visible:outline-parchment rounded-lg" 
            onClick={onClick}
            aria-label={`View submission by ${winnerName}: ${title}`}
        >
            <div 
                className={`relative w-40 h-56 sm:w-48 sm:h-64 rounded-r-lg transform-style-preserve-3d transition-all duration-700 shadow-2xl group-hover:[transform:rotateY(-25deg)_rotateX(5deg)_scale(1.05)] group-focus:[transform:rotateY(-25deg)_rotateX(5deg)_scale(1.05)]`}
            >
                {/* Spine - The physical binding */}
                <div className={`absolute left-0 top-0 w-10 h-full bg-gradient-to-r ${rankSpineColors[rank]} transform origin-left flex items-center justify-center border-r border-white/10 z-20 shadow-[inset_-2px_0_10px_rgba(0,0,0,0.5)]`} style={{transform: 'rotateY(-90deg)'}}>
                    <p className="transform rotate-180 text-parchment font-display font-medium whitespace-nowrap opacity-60 text-[10px] sm:text-xs uppercase tracking-[0.3em]" style={{ writingMode: 'vertical-rl' }}>
                        {winnerName}
                    </p>
                </div>

                {/* Cover - The face of the achievement */}
                <div className={`absolute left-0 top-0 w-full h-full bg-gradient-to-br ${rankColors[rank]} rounded-r-lg flex flex-col justify-between p-4 sm:p-6 border-l border-white/10 overflow-hidden bg-parchment-texture`}>
                    {/* Texture overlay */}
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-parchment-texture"></div>
                    
                    {mobileMode ? (
                        /* ── Mobile cover: medal + title only, title is the hero ── */
                        <div className="flex flex-col items-center justify-between h-full w-full px-1 py-2 relative z-10">
                            {/* Medal — top anchor */}
                            <span className="text-2xl drop-shadow-lg">{medal}</span>

                            {/* Entry title — dominant book-cover element */}
                            <div className="flex-1 flex items-center justify-center w-full py-3">
                                <p
                                    className="text-center text-parchment leading-snug px-1"
                                    style={{
                                        fontFamily: '"Georgia", "Palatino Linotype", serif',
                                        fontSize: '1rem',
                                        fontWeight: 700,
                                        fontStyle: 'italic',
                                        lineHeight: 1.25,
                                        letterSpacing: '0.01em',
                                        textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                                    }}
                                >
                                    {title}
                                </p>
                            </div>

                            {/* Subtle decorative rule at bottom */}
                            <div className="h-px w-10 bg-parchment/25 mx-auto" />
                        </div>
                    ) : (
                        /* ── Desktop cover: original layout — untouched ── */
                        <>
                            <div className="text-center relative z-10 flex flex-col items-center gap-2">
                                <span className="text-3xl sm:text-4xl drop-shadow-lg">{medal}</span>
                                <h3 className="font-display text-lg sm:text-xl font-black text-parchment leading-tight uppercase tracking-tighter">
                                    {winnerName}
                                </h3>
                            </div>

                            <div className="text-center relative z-10 space-y-1">
                                <div className="h-px w-8 bg-parchment/20 mx-auto mb-2"></div>
                                <p className="text-[10px] sm:text-xs italic text-parchment/60 font-sans uppercase tracking-widest">Winning Entry</p>
                                <p className="font-display font-bold text-parchment text-sm sm:text-base leading-tight">
                                    &ldquo;{title}&rdquo;
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Page edges (The 3D depth) */}
                <div className="absolute right-0 top-0 w-4 h-full bg-parchment-dark/40 dark:bg-parchment-dark/60 transform origin-right shadow-inner z-0" style={{transform: 'rotateY(90deg)'}}></div>
            </div>
        </button>
    );
};

export default WinnerBook;
