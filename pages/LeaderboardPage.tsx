import React, { useState, useMemo, useEffect } from 'react';
import { fetchLeaderboard } from '../services/leaderboardService';
import { Participant } from '../types';
import { FireIcon } from '../components/icons/SocialIcons';

const LeaderboardItem: React.FC<{ participant: Participant; rank: number }> = ({ participant, rank }) => {
    const isTopThree = rank <= 3;
    
    // Ledger styles
    const baseClass = "group flex items-center p-4 rounded-xl transition-all duration-500 border-b border-oxblood/5 dark:border-parchment/5 hover:bg-oxblood/[0.02] dark:hover:bg-parchment/[0.02]";
    
    const rankColors = [
        'bg-oxblood text-parchment shadow-lg shadow-oxblood/20',
        'bg-stone-500 text-parchment shadow-lg shadow-stone-500/20',
        'bg-amber-800 text-parchment shadow-lg shadow-amber-800/20',
    ];

    return (
        <div className={baseClass}>
            {/* Rank Indicator */}
            <div className={`w-12 h-12 flex items-center justify-center rounded-full font-display text-xl font-black transition-transform duration-500 group-hover:scale-110 ${isTopThree ? rankColors[rank - 1] : 'text-stone-400 dark:text-stone-600'}`}>
                {rank}
            </div>
            
            {/* Name - Feeling like a handwritten entry */}
            <div className={`flex-grow px-6 font-display text-xl md:text-2xl transition-colors duration-300 ${isTopThree ? 'text-stone-900 dark:text-parchment font-bold' : 'text-stone-600 dark:text-stone-400'}`}>
                {participant.name}
                {isTopThree && <span className="ml-2 text-[10px] uppercase tracking-widest text-oxblood opacity-50 font-sans">Triumphed</span>}
            </div>

            {/* Streak - Literary devotion */}
            <div className="flex items-center gap-2 px-4 border-l border-oxblood/10 dark:border-parchment/10">
                {participant.currentStreak > 0 && (
                    <div className="flex items-center gap-1 group/streak">
                        <span className="font-display text-lg font-bold text-oxblood dark:text-parchment-dark">{participant.currentStreak}</span>
                        <div className="text-oxblood animate-pulse-slow">
                            <FireIcon />
                        </div>
                    </div>
                )}
            </div>

            {/* Points - The Ledger Value */}
            <div className="w-32 text-right">
                <span className="text-2xl font-display font-black text-stone-900 dark:text-parchment group-hover:text-oxblood transition-colors">
                    {participant.totalPoints}
                </span>
                <span className="ml-1 text-[10px] uppercase tracking-tighter text-stone-400 font-sans">pts</span>
            </div>
        </div>
    );
};

const HallOfFameCard: React.FC<{ title: string; participant?: Participant; color: string }> = ({ title, participant, color }) => (
    <div className={`relative p-8 rounded-2xl transition-all duration-500 bg-parchment-dark/30 dark:bg-ink-light/30 border border-oxblood/10 dark:border-parchment/10 group overflow-hidden`}>
        {/* Decorative background element */}
        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${color} opacity-50`}></div>
        
        <h3 className="text-xs font-sans font-black uppercase tracking-[0.3em] text-oxblood/60 dark:text-parchment/40 mb-6">{title}</h3>
        
        {participant ? (
            <div className="space-y-2">
                <p className="text-3xl font-display font-black text-stone-900 dark:text-parchment group-hover:text-oxblood transition-colors inline-block relative">
                    {participant.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-oxblood/20 group-hover:w-full transition-all duration-500"></span>
                </p>
                <div className="flex items-center justify-center gap-2 text-stone-500 dark:text-stone-500 italic text-sm">
                    <span>Devoted for {participant.participationHistory.length} weeks</span>
                </div>
            </div>
        ) : (
            <p className="text-stone-400 italic">The entry remains blank...</p>
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
        <div className="flex flex-col gap-20 py-10 items-center">
            {/* HEADER */}
            <div className="text-center space-y-4 max-w-2xl px-6">
                <h1 className="text-5xl md:text-7xl font-display font-black text-ink dark:text-parchment tracking-tighter italic uppercase">
                    The Weekly Ledger
                </h1>
                <p className="text-stone-500 dark:text-stone-400 italic text-lg leading-relaxed">
                    "Our history, recorded in scores and streaks. A celebration of those who show up to the blank page, week after week."
                </p>

                {allParticipants.length > 0 && (
                    <div className="relative max-w-md mx-auto mt-12 group">
                        <input
                            type="text"
                            placeholder="Find a wordsmith..."
                            className="w-full bg-parchment-dark/50 dark:bg-ink-light/50 border border-oxblood/10 dark:border-parchment/10 rounded-xl px-6 py-4 text-stone-800 dark:text-parchment focus:outline-none focus:ring-2 focus:ring-oxblood/20 dark:focus:ring-parchment/20 transition-all font-display italic text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-50 transition-opacity">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>
                )}
            </div>

            {/* HALL OF FAME */}
            {allParticipants.length > 0 && (
                <div className="w-full max-w-6xl px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <HallOfFameCard title="Poet Laureate" participant={hallOfFame.highestBestRank} color="from-oxblood to-transparent" />
                        <HallOfFameCard title="The Unbroken Flame" participant={hallOfFame.highestStreak} color="from-amber-600 to-transparent" />
                        <HallOfFameCard title="The Faithful Scroll" participant={hallOfFame.mostConsistent} color="from-stone-600 to-transparent" />
                    </div>
                </div>
            )}

            {/* LEADERBOARD LIST */}
            <div className="w-full max-w-5xl px-6 flex flex-col gap-2">
                {loading ? (
                    <div className="text-center p-20 opacity-50 italic font-display text-2xl animate-pulse">
                        Unrolling the scrolls...
                    </div>
                ) : filteredParticipants.length > 0 ? (
                    filteredParticipants.map((p) => (
                        <LeaderboardItem key={p.id} participant={p} rank={sortedParticipants.indexOf(p) + 1} />
                    ))
                ) : (
                    <div className="text-center py-20 bg-parchment-dark/20 dark:bg-ink-light/20 rounded-3xl border border-dashed border-oxblood/20">
                        <h3 className="text-3xl font-display font-black text-stone-400 mb-2 italic">The silence is deafening.</h3>
                        <p className="text-stone-400">No entries match your search in this ledger.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaderboardPage;