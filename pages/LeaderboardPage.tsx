import React, { useState, useMemo, useEffect } from 'react';
import { fetchLeaderboard, SuspenseModeActiveError } from '../services/leaderboardService';
import type { Participant } from '../types';
import { FireIcon } from '../components/icons/SocialIcons';

const LeaderboardItem: React.FC<{ participant: Participant; rank: number }> = ({ participant, rank }) => {
    const isTopThree = rank <= 3;

    // Full-bleed row backgrounds for podium - warm editorial palette
    const topThreeRowBg = [
        // 1st - Manuscript Gold: aged amber wash
        'bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-700/30 shadow-md shadow-amber-100/60 dark:shadow-amber-900/30',
        // 2nd - Quill Silver: cool parchment-stone
        'bg-stone-100 dark:bg-ink-light/40 border border-stone-200/70 dark:border-parchment/15 shadow-sm shadow-stone-100/60 dark:shadow-none',
        // 3rd - Worn Bronze: sienna earth
        'bg-orange-50 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-800/30 shadow-sm shadow-orange-100/50 dark:shadow-orange-900/20',
    ];

    // Rank circle colors - kept distinct from old oxblood defaults
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

    const podiumIndex = Math.min(Math.max(rank - 1, 0), 2);

    const baseClass = isTopThree
        ? `group flex items-center gap-3 p-4 md:p-5 rounded-xl transition-all duration-500 ${topThreeRowBg[podiumIndex]}`
        : 'group flex items-center gap-3 p-3 md:p-4 rounded-xl transition-all duration-500 border-b border-oxblood/5 dark:border-parchment/5 hover:bg-oxblood/[0.02] dark:hover:bg-parchment/[0.02]';

    return (
        <div className={baseClass}>
            {/* Rank Indicator */}
            <div className={`flex-shrink-0 flex items-center justify-center rounded-full font-display font-black transition-transform duration-500 group-hover:scale-110 ${
                isTopThree
                    ? `w-10 h-10 md:w-14 md:h-14 text-base md:text-2xl ${rankCircleStyles[podiumIndex]}`
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
                <span className="block truncate">{participant.name}</span>
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
                        <span className="font-display text-sm md:text-lg font-bold text-oxblood dark:text-oxblood-bright">
                            {participant.currentStreak}
                        </span>
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
                        ? pointsColorClass[podiumIndex]
                        : 'text-stone-900 dark:text-parchment group-hover:text-oxblood dark:group-hover:text-oxblood-bright'
                }`}>
                    {participant.totalPoints}
                </span>
                <span className="ml-0.5 text-[9px] md:text-[10px] uppercase tracking-tighter text-stone-500 dark:text-parchment/50 font-sans font-bold">pts</span>
            </div>
        </div>
    );
};

const HallOfFameCard: React.FC<{ 
    title: string; 
    participants?: Participant[]; 
    statLabel?: (p: Participant) => string;
    color: string;
    isMasked?: boolean;
    maskedLabel?: string;
}> = ({ title, participants, statLabel, color, isMasked, maskedLabel }) => {
    if (isMasked) {
        return (
            <div className={`relative p-8 rounded-2xl transition-all duration-500 bg-parchment-dark/30 dark:bg-ink-light/50 border border-oxblood/10 dark:border-parchment/10 group overflow-hidden`}>
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${color} opacity-50`}></div>
                
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-sans font-black uppercase tracking-[0.3em] text-oxblood dark:text-parchment">{title}</h3>
                    <span className="text-[9px] font-sans font-black uppercase tracking-widest px-2 py-0.5 rounded bg-oxblood/10 dark:bg-oxblood/30 text-oxblood dark:text-oxblood-bright">
                        Sealed
                    </span>
                </div>
                
                <div className="space-y-2">
                    <p className="text-2xl md:text-3xl font-display font-black text-stone-400 dark:text-parchment/40 tracking-widest select-none">
                        ••••••••••••
                    </p>
                    <div className="flex items-center justify-start gap-2 text-stone-500 dark:text-parchment/50 italic text-sm font-medium">
                        <span>{maskedLabel || "Deliberations in progress..."}</span>
                    </div>
                </div>
            </div>
        );
    }

    const hasParticipants = participants && participants.length > 0;
    const names = hasParticipants ? participants.map(p => p.name).join(' & ') : '';

    return (
        <div className={`relative p-8 rounded-2xl transition-all duration-500 bg-parchment-dark/30 dark:bg-ink-light/50 border border-oxblood/10 dark:border-parchment/10 group overflow-hidden`}>
            {/* Decorative background element */}
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${color} opacity-50`}></div>
            
            <h3 className="text-xs font-sans font-black uppercase tracking-[0.3em] text-oxblood dark:text-parchment mb-6">{title}</h3>
            
            {hasParticipants ? (
                <div className="space-y-2">
                    <p className="text-2xl md:text-3xl font-display font-black text-stone-900 dark:text-parchment group-hover:text-oxblood dark:group-hover:text-oxblood-bright transition-colors inline-block relative">
                        {names}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-oxblood/20 group-hover:w-full transition-all duration-500"></span>
                    </p>
                    {statLabel && participants[0] && (
                        <div className="flex items-center justify-start gap-2 text-stone-600 dark:text-parchment/60 italic text-sm font-medium">
                            <span>{statLabel(participants[0])}</span>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-stone-500 dark:text-parchment/50 italic font-medium">The entry remains blank...</p>
            )}
        </div>
    );
};

// Poetic mystery pseudonyms for synthetic suspense rows
const DUMMY_PSEUDONYMS = [
    { title: "The Veiled Laureate", mask: "••••••••••••" },
    { title: "Midnight Sonneteer", mask: "••••••••••••••" },
    { title: "Silent Calligrapher", mask: "••••••••••" },
    { title: "Scribe of Shadows", mask: "••••••••••••••••" },
    { title: "The Anonymous Muse", mask: "••••••••••••" },
    { title: "Keeper of Verses", mask: "••••••••••••••" },
    { title: "The Amber Elegist", mask: "••••••••••" },
    { title: "Solitary Rhymester", mask: "••••••••••••" },
    { title: "Phantom of the Stanza", mask: "••••••••••••••" },
];

const LeaderboardPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const deferredSearch = React.useDeferredValue(searchTerm);
    const [allParticipants, setAllParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSuspenseMode, setIsSuspenseMode] = useState(false);
    const [customNotice, setCustomNotice] = useState<string | null>(null);

    // 8-10 synthetic, randomized dummy rows behind the frosted blur overlay
    const dummyParticipants: Participant[] = useMemo(() => {
        let baseScore = 385 + Math.floor(Math.random() * 30);
        return DUMMY_PSEUDONYMS.map((item, idx) => {
            const score = baseScore;
            baseScore -= Math.floor(18 + Math.random() * 15);
            return {
                id: `suspense-dummy-${idx + 1}`,
                name: `${item.mask} (${item.title})`,
                totalPoints: Math.max(score, 60),
                currentStreak: Math.max(7 - idx, 1),
            };
        });
    }, []);

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await fetchLeaderboard();
                if (isMounted) {
                    setIsSuspenseMode(false);
                    setCustomNotice(null);
                    setAllParticipants(data.filter(p => p.totalPoints > 0));
                }
            } catch (e: any) {
                if (isMounted) {
                    if (e instanceof SuspenseModeActiveError || e?.name === 'SuspenseModeActiveError') {
                        setIsSuspenseMode(true);
                        setCustomNotice(e.customNotice || null);
                        setAllParticipants([]);
                    } else {
                        console.error("Error loading leaderboard:", e);
                    }
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        loadData();
        return () => {
            isMounted = false;
        };
    }, []);

    const sortedParticipants = useMemo(() => {
        return [...allParticipants]
            .filter(p => p.totalPoints > 0)
            .sort((a, b) => {
                if (b.totalPoints !== a.totalPoints) {
                    return b.totalPoints - a.totalPoints;
                }
                return b.currentStreak - a.currentStreak;
            });
    }, [allParticipants]);

    // Standard Competition Ranking (1224 rule)
    const participantRanks = useMemo(() => {
        const rankMap = new Map<string, number>();
        let currentRank = 1;
        for (let i = 0; i < sortedParticipants.length; i++) {
            if (i > 0) {
                const prev = sortedParticipants[i - 1];
                const curr = sortedParticipants[i];
                const isTied = prev.totalPoints === curr.totalPoints && prev.currentStreak === curr.currentStreak;
                if (!isTied) {
                    currentRank = i + 1;
                }
            }
            rankMap.set(sortedParticipants[i].id, currentRank);
        }
        return rankMap;
    }, [sortedParticipants]);

    const filteredParticipants = useMemo(() => {
        return sortedParticipants.filter(p => p.name.toLowerCase().includes(deferredSearch.toLowerCase()));
    }, [sortedParticipants, deferredSearch]);

    const hallOfFame = useMemo(() => {
        if (allParticipants.length === 0) {
            return { highestStreak: [], highestBestRank: [], mostConsistent: [] };
        }
        
        // Highest Best Rank (Top total points)
        const maxScore = sortedParticipants[0]?.totalPoints || 0;
        const highestBestRank = sortedParticipants.filter(p => p.totalPoints === maxScore && maxScore > 0);

        // Highest Streak
        const maxStreak = Math.max(...allParticipants.map(p => p.currentStreak || 0));
        const highestStreak = maxStreak > 0 ? allParticipants.filter(p => p.currentStreak === maxStreak) : [];

        // Most Consistent
        const getParticipationCount = (p: Participant) => p.totalParticipations || p.participationHistory?.length || 0;
        const maxConsistent = Math.max(...allParticipants.map(getParticipationCount));
        const mostConsistent = maxConsistent > 0 ? allParticipants.filter(p => getParticipationCount(p) === maxConsistent) : [];

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

                {/* Search Bar - disabled during Suspense Mode */}
                {(allParticipants.length > 0 || isSuspenseMode) && (
                    <div className={`relative max-w-md mx-auto mt-8 group ${isSuspenseMode ? 'opacity-60' : ''}`}>
                        <label htmlFor="wordsmith-search" className="sr-only">Search for a wordsmith</label>
                        <input
                            id="wordsmith-search"
                            type="text"
                            disabled={isSuspenseMode}
                            placeholder={isSuspenseMode ? "Ledger sealed during deliberations..." : "Find a wordsmith..."}
                            className={`w-full bg-parchment-dark/50 dark:bg-ink-light/70 border border-oxblood/10 dark:border-parchment/10 rounded-xl px-6 py-4 text-stone-900 dark:text-parchment placeholder-stone-400 dark:placeholder-parchment/40 focus:outline-none transition-all font-display italic text-lg ${
                                isSuspenseMode 
                                    ? 'cursor-not-allowed select-none bg-stone-200/50 dark:bg-ink/50' 
                                    : 'focus:ring-2 focus:ring-oxblood/20 dark:focus:ring-lamplight/30'
                            }`}
                            value={isSuspenseMode ? '' : searchTerm}
                            onChange={(e) => {
                                if (!isSuspenseMode) {
                                    setSearchTerm(e.target.value);
                                }
                            }}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-80 transition-opacity">
                            {isSuspenseMode ? (
                                <svg className="w-5 h-5 text-oxblood dark:text-oxblood-bright" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth={2} />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* LEADERBOARD LIST / SUSPENSE VIEW */}
            <div className="w-full max-w-5xl px-1 flex flex-col gap-2">
                {loading ? (
                    <div className="text-center p-20 opacity-50 italic font-display text-2xl animate-pulse">
                        Unrolling the scrolls...
                    </div>
                ) : isSuspenseMode ? (
                    <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-oxblood/15 dark:border-parchment/15">
                        {/* Synthetic dummy rows rendered behind the frosted blur overlay */}
                        <div 
                            className="flex flex-col gap-2 p-1 select-none pointer-events-none filter blur-[4px] opacity-65"
                            aria-hidden="true"
                        >
                            {dummyParticipants.map((p, idx) => (
                                <LeaderboardItem 
                                    key={p.id} 
                                    participant={p} 
                                    rank={idx + 1} 
                                />
                            ))}
                        </div>

                        {/* Frosted CSS blur overlay */}
                        <div 
                            className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 md:p-8 bg-parchment/75 dark:bg-ink/80 overflow-y-auto"
                            style={{ 
                                backdropFilter: 'blur(12px)', 
                                WebkitBackdropFilter: 'blur(12px)' 
                            }}
                        >
                            {/* Editorial Suspense Banner */}
                            <div className="w-full max-w-2xl mx-auto p-6 md:p-10 rounded-2xl bg-parchment-dark/95 dark:bg-ink-light/95 border-2 border-oxblood/30 dark:border-parchment/25 shadow-2xl text-center space-y-5 animate-fade-in-up">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-oxblood/10 dark:bg-oxblood/20 text-oxblood dark:text-oxblood-bright mx-auto ring-4 ring-oxblood/15 dark:ring-parchment/15 shadow-inner">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-[10px] md:text-xs font-sans font-black uppercase tracking-[0.35em] text-oxblood dark:text-oxblood-bright">
                                        Official Archival Notice
                                    </span>
                                    <h2 className="text-2xl md:text-4xl font-display font-black text-stone-900 dark:text-parchment italic leading-tight tracking-tight">
                                        The Scrolls Are Sealed: Final Deliberations in Progress
                                    </h2>
                                </div>

                                <div className="py-4 px-6 rounded-xl bg-parchment/70 dark:bg-ink/60 border border-oxblood/15 dark:border-parchment/10 max-w-xl mx-auto">
                                    <p className="text-stone-800 dark:text-parchment/90 font-serif italic text-base md:text-lg leading-relaxed">
                                        "{customNotice || "Scores locked in suspense until the Grand Ceremony"}"
                                    </p>
                                </div>

                                <div className="flex items-center justify-center gap-2 text-stone-500 dark:text-parchment/60 text-xs font-sans tracking-widest uppercase">
                                    <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                    <span>Honors & Rankings Concealed • Awaiting Unveiling</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : filteredParticipants.length > 0 ? (
                    filteredParticipants.map((p) => (
                        <LeaderboardItem 
                            key={p.id} 
                            participant={p} 
                            rank={participantRanks.get(p.id) || (sortedParticipants.indexOf(p) + 1)} 
                        />
                    ))
                ) : (
                    <div className="text-center py-20 bg-parchment-dark/20 dark:bg-ink-light/30 rounded-3xl border border-dashed border-oxblood/20 dark:border-parchment/10">
                        <h3 className="text-3xl font-display font-black text-stone-600 dark:text-parchment/70 mb-2 italic">The silence is deafening.</h3>
                        <p className="text-stone-500 dark:text-parchment/50">No entries match your search in this ledger.</p>
                    </div>
                )}
            </div>

            {/* HALL OF FAME - masked during Suspense Mode to protect Poet Laureate & top scores */}
            {(allParticipants.length > 0 || isSuspenseMode) && !searchTerm && (
                <div className="w-full max-w-6xl px-4 space-y-8 pb-4">
                    <div className="flex items-center gap-6">
                        <div className="flex-1 h-px bg-oxblood/10 dark:bg-parchment/10"></div>
                        <span className="text-[10px] font-sans uppercase tracking-[0.4em] text-oxblood/50 dark:text-parchment/60 font-black whitespace-nowrap">Hall of Fame</span>
                        <div className="flex-1 h-px bg-oxblood/10 dark:bg-parchment/10"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <HallOfFameCard 
                            title="Poet Laureate" 
                            participants={isSuspenseMode ? [] : hallOfFame.highestBestRank} 
                            statLabel={(p) => `${p.totalPoints} points accumulated`}
                            color="from-oxblood to-transparent" 
                            isMasked={isSuspenseMode}
                            maskedLabel="Score and identity sealed until ceremony"
                        />
                        <HallOfFameCard 
                            title="The Unbroken Flame" 
                            participants={isSuspenseMode ? [] : hallOfFame.highestStreak} 
                            statLabel={(p) => `${p.currentStreak} weeks unbroken streak`}
                            color="from-amber-600 to-transparent" 
                            isMasked={isSuspenseMode}
                            maskedLabel="Streak record sealed in deliberation"
                        />
                        <HallOfFameCard 
                            title="The Faithful Scroll" 
                            participants={isSuspenseMode ? [] : hallOfFame.mostConsistent} 
                            statLabel={(p) => `Devoted for ${p.totalParticipations || p.participationHistory?.length || 0} weeks`}
                            color="from-stone-600 to-transparent" 
                            isMasked={isSuspenseMode}
                            maskedLabel="Devotion tally sealed in deliberation"
                        />
                    </div>

                </div>
            )}
        </div>
    );
};

export default LeaderboardPage;
