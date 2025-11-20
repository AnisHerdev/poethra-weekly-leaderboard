import React from 'react';

interface WinnerBookProps {
    winnerName: string;
    rank: number;
    title: string;
    onClick: () => void;
}

const WinnerBook: React.FC<WinnerBookProps> = ({ winnerName, rank, title, onClick }) => {
    const rankColors = {
        1: 'from-yellow-400 to-amber-500 border-yellow-300',
        2: 'from-slate-300 to-gray-400 border-slate-200',
        3: 'from-orange-500 to-amber-600 border-orange-400',
    };

    const rankTextColors = {
        1: 'text-amber-900',
        2: 'text-slate-900',
        3: 'text-orange-900',
    };
    
    const rankSpineColors = {
        1: 'from-yellow-600 to-amber-700',
        2: 'from-slate-500 to-gray-600',
        3: 'from-orange-700 to-amber-800',
    };

    const medal = ['🥇', '🥈', '🥉'][rank - 1];
    
    // Combine transform classes for hover effect
    const hoverTransform = { transform: 'rotateY(-25deg) scale(1.05)' };

    return (
        <div className="group perspective-1000" onClick={onClick}>
            <div 
                className="relative w-40 h-56 sm:w-48 sm:h-64 rounded-lg transform-style-preserve-3d transition-transform duration-500 cursor-pointer shadow-2xl shadow-black/20 dark:shadow-black/50"
                style={{ transition: 'transform 0.5s' }}
                onMouseEnter={e => e.currentTarget.style.transform = hoverTransform.transform}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
                {/* Spine */}
                <div className={`absolute left-0 top-0 w-8 h-full bg-gradient-to-r ${rankSpineColors[rank]} transform origin-left flex items-center justify-center`} style={{transform: 'rotateY(-90deg)'}}>
                    <p className="transform rotate-180 text-white font-lora whitespace-nowrap opacity-80 text-xs sm:text-sm" style={{ writingMode: 'vertical-rl' }}>{winnerName}</p>
                </div>

                {/* Cover */}
                <div className={`absolute left-0 top-0 w-full h-full bg-gradient-to-br ${rankColors[rank]} rounded-lg flex flex-col justify-between p-3 sm:p-4 border-l-4 border-opacity-50 ${rankColors[rank]}`}>
                    <div className="text-center">
                        <span className="text-3xl sm:text-4xl">{medal}</span>
                        <h3 className={`font-lora text-xl sm:text-2xl font-bold mt-2 ${rankTextColors[rank]}`}>{winnerName}</h3>
                    </div>
                    <div className="text-center opacity-80">
                        <p className={`text-xs sm:text-sm italic ${rankTextColors[rank]}`}>Winning Entry</p>
                        <p className={`font-semibold mt-1 text-sm ${rankTextColors[rank]}`}>"{title}"</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WinnerBook;