import React, { useState, useMemo, useEffect } from 'react';
import { fetchLeaderboard } from '../services/leaderboardService';
import type{ Participant } from '../types';
import { FireIcon } from '../components/icons/SocialIcons';

const LeaderboardItem: React.FC<{ participant: Participant; rank: number }> = ({ participant, rank }) => {
    const isTopThree = rank <= 3;

    // Full-bleed row backgrounds for podium — warm editorial palette
    const topThreeRowBg = [
        // 1st — Manuscript Gold: aged amber wash
        'bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-700/30 shadow-md shadow-amber-100/60 dark:shadow-amber-900/30',
        // 2nd — Quill Silver: cool parchment-stone
        'bg-stone-100 dark:bg-ink-light/40 border border-stone-200/70 dark:border-parchment/15 shadow-sm shadow-stone-100/60 dark:shadow-none',
        // 3rd — Worn Bronze: sienna earth
        'bg-orange-50 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-800/30 shadow-sm shadow-orange-100/50 dark:shadow-orange-900/20',
    ];

    // Rank circle colors — kept distinct from old oxblood defaults
    const rankCircleStyles = [
        'bg-amber-500 text-white shadow-lg shadow-amber-400/40 ring-2 ring-amber-300/50 dark:ring-amber-600/40',
        'bg-stone-400 text-white shadow-md shadow-stone-400/30 ring-2 ring-stone-300/50 dark:ring-stone-500/40',
        'bg-amber-700 text-white shadow-md shadow-amber-700/30 ring-2 ring-amber-500/40 dark:ring-amber-700/40',
    ];

    const pointsColorClass = [
        'text-amber-700 dark:text-amber-400',
        'text-stone-600 dark:text-parchment/70',
        'text-amber-800 dark:text-amber-600',
    ];

    const baseClass = isTopThree
        ? `group flex items-center gap-3 p-4 md:p-5 rounded-xl transition-all duration-500 ${topThreeRowBg[rank - 1]}`
        : 'group flex items-center gap-3 p-3 md:p-4 rounded-xl transition-all duration-500 border-b border-oxblood/5 dark:border-parchment/5 hover:bg-oxblood/[0.02] dark:hover:bg-parchment/[0.02]';

    return (
        <div className={baseClass}>
            {/* Rank Indicator */}
            <div className={`flex-shrink-0 flex items-center justify-center rounded-full font-display font-black transition-transform duration-500 group-hover:scale-110 ${
                isTopThree
                    ? `w-10 h-10 md:w-14 md:h-14 text-base md:text-2xl ${rankCircleStyles[rank - 1]}`
                    : 'w-9 h-9 md:w-12 md:h-12 text-base md:text-xl text-stone-500 dark:text-parchment/60'
            }`}>
                {rank}
            </div>

            {/* Name */}
            <div className={`flex-1 min-w-0 px-2 md:px-4 font-display transition-colors duration-300 ${
                rank === 1
                    ? 'text-stone-900 dark:text-parchment font-black text-lg md:text-2xl'
                    : isTopThree
                        ? 'text-stone-900 dark:text-parchment font-bold text-base md:text-2xl'
                        : 'text-stone-700 dark:text-parchment text-base md:text-2xl'
            }`}>
                <span className="block">{participant.name}</span>
                {isTopThree && (
                    <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-oxblood dark:text-oxblood-bright font-sans font-black">
                        Triumphed
                    </span>
                )}
            </div>

            {/* Streak */}
            <div className="flex-shrink-0 flex items-center gap-1">
                {participant.currentStreak > 0 && (
                    <div className="flex items-center gap-0.5">
                        <span className={`font-display text-sm md:text-lg font-bold ${
                            isTopThree ? 'text-oxblood dark:text-oxblood-bright' : 'text-oxblood dark:text-oxblood-bright'
                        }`}>{participant.currentStreak}</span>
                        <div className="text-oxblood animate-pulse-slow">
                            <FireIcon />
                        </div>
                    </div>
                )}
            </div>

            {/* Points */}
            <div className="flex-shrink-0 text-right">
                <span className={`text-lg md:text-2xl font-display font-black transition-colors ${
                    isTopThree
                        ? pointsColorClass[rank - 1]
                        : 'text-stone-900 dark:text-parchment group-hover:text-oxblood dark:group-hover:text-oxblood-bright'
                }`}>
                    {participant.totalPoints}
                </span>
                <span className="ml-0.5 text-[9px] md:text-[10px] uppercase tracking-tighter text-stone-500 dark:text-parchment/50 font-sans font-bold">pts</span>
            </div>
        </div>
    );
};

const HallOfFameCard: React.FC<{ title: string; participant?: Participant; color: string }> = ({ title, participant, color }) => (
    <div className={`relative p-8 rounded-2xl transition-all duration-500 bg-parchment-dark/30 dark:bg-ink-light/50 border border-oxblood/10 dark:border-parchment/10 group overflow-hidden`}>
        {/* Decorative background element */}
        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${color} opacity-50`}></div>
        
        <h3 className="text-xs font-sans font-black uppercase tracking-[0.3em] text-oxblood dark:text-parchment mb-6">{title}</h3>
        
        {participant ? (
            <div className="space-y-2">
                <p className="text-3xl font-display font-black text-stone-900 dark:text-parchment group-hover:text-oxblood dark:group-hover:text-oxblood-bright transition-colors inline-block relative">
                    {participant.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-oxblood/20 group-hover:w-full transition-all duration-500"></span>
                </p>
                    <div className="flex items-center justify-center gap-2 text-stone-600 dark:text-parchment/60 italic text-sm font-medium">
                    <span>Devoted for {participant.participationHistory.length} weeks</span>
                </div>
            </div>
        ) : (
            <p className="text-stone-500 dark:text-parchment/50 italic font-medium">The entry remains blank...</p>
        )}
    </div>
);


const LeaderboardPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [allParticipants, setAllParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await fetchLeaderboard();
                setAllParticipants(data);
            } catch (e: any) {
                console.error(e);
            }
            setLoading(false);
        };
        loadData();
    }, []);

    const sortedParticipants = useMemo(() => {
        return [...allParticipants].sort((a, b) => {
            if (b.totalPoints !== a.totalPoints) {
                return b.totalPoints - a.totalPoints;
            }
            return b.currentStreak - a.currentStreak;
        });
    }, [allParticipants]);

    const filteredParticipants = useMemo(() => {
        return sortedParticipants.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [sortedParticipants, searchTerm]);

    const hallOfFame = useMemo(() => {
        if (allParticipants.length === 0) {
            return { highestStreak: undefined, highestBestRank: undefined, mostConsistent: undefined };
        }
        const highestStreak = [...allParticipants].sort((a, b) => b.currentStreak - a.currentStreak)[0];
        const highestBestRank = sortedParticipants[0];
        const mostConsistent = [...allParticipants].sort((a, b) => b.participationHistory.length - a.participationHistory.length)[0];

        return { highestStreak, highestBestRank, mostConsistent };
    }, [allParticipants, sortedParticipants]);

    return (
        <div className="flex flex-col gap-10 py-10 items-center">
            {/* HEADER */}
            <div className="text-center space-y-4 max-w-2xl px-1">
                <h1 className="text-5xl md:text-7xl font-display font-black text-ink dark:text-parchment tracking-tighter italic uppercase">
                    The Weekly Ledger
                </h1>
                <p className="text-stone-500 dark:text-parchment/60 italic text-lg leading-relaxed">
                    "Our history, recorded in scores and streaks. A celebration of those who show up to the blank page, week after week."
                </p>

                {allParticipants.length > 0 && (
                    <div className="relative max-w-md mx-auto mt-8 group">
                        <label htmlFor="wordsmith-search" className="sr-only">Search for a wordsmith</label>
                        <input
                            id="wordsmith-search"
                            type="text"
                            placeholder="Find a wordsmith..."
                            className="w-full bg-parchment-dark/50 dark:bg-ink-light/70 border border-oxblood/10 dark:border-parchment/10 rounded-xl px-6 py-4 text-stone-900 dark:text-parchment placeholder-stone-400 dark:placeholder-parchment/40 focus:outline-none focus:ring-2 focus:ring-oxblood/20 dark:focus:ring-lamplight/30 transition-all font-display italic text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-80 transition-opacity">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>
                )}
            </div>

            {/* LEADERBOARD LIST — directly below search */}
            <div className="w-full max-w-5xl px-1 flex flex-col gap-2">
                {loading ? (
                    <div className="text-center p-20 opacity-50 italic font-display text-2xl animate-pulse">
                        Unrolling the scrolls...
                    </div>
                ) : filteredParticipants.length > 0 ? (
                    filteredParticipants.map((p) => (
                        <LeaderboardItem key={p.id} participant={p} rank={sortedParticipants.indexOf(p) + 1} />
                    ))
                ) : (
                    <div className="text-center py-20 bg-parchment-dark/20 dark:bg-ink-light/30 rounded-3xl border border-dashed border-oxblood/20 dark:border-parchment/10">
                        <h3 className="text-3xl font-display font-black text-stone-600 dark:text-parchment/70 mb-2 italic">The silence is deafening.</h3>
                        <p className="text-stone-500 dark:text-parchment/50">No entries match your search in this ledger.</p>
                    </div>
                )}
            </div>

            {/* HALL OF FAME — secondary, at the bottom, hidden during search */}
            {allParticipants.length > 0 && !searchTerm && (
                <div className="w-full max-w-6xl px-4 space-y-8 pb-4">
                    <div className="flex items-center gap-6">
                        <div className="flex-1 h-px bg-oxblood/10 dark:bg-parchment/10"></div>
                        <span className="text-[10px] font-sans uppercase tracking-[0.4em] text-oxblood/50 dark:text-parchment/60 font-black whitespace-nowrap">Hall of Fame</span>
                        <div className="flex-1 h-px bg-oxblood/10 dark:bg-parchment/10"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <HallOfFameCard title="Poet Laureate" participant={hallOfFame.highestBestRank} color="from-oxblood to-transparent" />
                        <HallOfFameCard title="The Unbroken Flame" participant={hallOfFame.highestStreak} color="from-amber-600 to-transparent" />
                        <HallOfFameCard title="The Faithful Scroll" participant={hallOfFame.mostConsistent} color="from-stone-600 to-transparent" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaderboardPage;
