import React, { useState, useMemo } from 'react';
import { getParticipants } from '../services/leaderboardService';
import { Participant } from '../types';
import { FireIcon } from '../components/icons/SocialIcons';

const getRankClass = (rank: number) => {
    switch (rank) {
        case 1:
            return 'bg-gradient-to-r from-yellow-500 to-amber-400 text-gray-900 shadow-yellow-500/50';
        case 2:
            return 'bg-gradient-to-r from-slate-400 to-gray-300 text-gray-900 shadow-slate-400/50';
        case 3:
            return 'bg-gradient-to-r from-yellow-700 to-orange-600 text-white shadow-orange-700/50';
        default:
            return 'bg-gray-800 hover:bg-gray-700';
    }
};

const LeaderboardItem: React.FC<{ participant: Participant; rank: number }> = ({ participant, rank }) => (
    <div className={`flex items-center p-3 md:p-4 rounded-lg transition-all duration-300 shadow-md ${getRankClass(rank)}`}>
        <div className="w-10 md:w-12 text-xl md:text-2xl font-bold text-center">{rank}</div>
        <div className="flex-grow font-semibold text-base md:text-lg ml-2 md:ml-4">{participant.name}</div>
        <div className="w-16 md:w-24 text-center flex items-center justify-center">
            {participant.currentStreak > 0 && (
                <>
                    <span className="mr-1 text-sm md:text-base">{participant.currentStreak}</span>
                    <FireIcon />
                </>
            )}
        </div>
        <div className="w-20 md:w-24 text-center text-lg md:text-xl font-bold">{participant.totalPoints} pts</div>
    </div>
);

const HallOfFameCard: React.FC<{ title: string; participant?: Participant; color: string }> = ({ title, participant, color }) => (
    <div className={`p-6 rounded-lg shadow-lg text-center bg-gray-800 border-t-4 ${color}`}>
        <h3 className="text-lg md:text-xl font-bold text-gray-300 mb-2">{title}</h3>
        {participant ? (
            <>
                <p className="text-xl md:text-2xl font-semibold text-white">{participant.name}</p>
                <p className="text-sm text-gray-400">{participant.totalPoints} Total Points</p>
            </>
        ) : (
            <p className="text-gray-400">No data available</p>
        )}
    </div>
);


const LeaderboardPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const allParticipants = useMemo(() => getParticipants(), []);
    
    const sortedParticipants = useMemo(() => {
        return [...allParticipants].sort((a, b) => b.totalPoints - a.totalPoints);
    }, [allParticipants]);

    const filteredParticipants = useMemo(() => {
        return sortedParticipants.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [sortedParticipants, searchTerm]);
    
    const hallOfFame = useMemo(() => {
        if (allParticipants.length === 0) {
            return { highestStreak: undefined, highestBestRank: undefined, mostConsistent: undefined };
        }
        const highestStreak = [...allParticipants].sort((a,b) => b.currentStreak - a.currentStreak)[0];
        const highestBestRank = sortedParticipants[0];
        
        const mostConsistent = [...allParticipants].sort((a, b) => b.participationHistory.length - a.participationHistory.length)[0];
        
        return { highestStreak, highestBestRank, mostConsistent };
    }, [allParticipants, sortedParticipants]);

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4 text-yellow-400">Leaderboard</h1>
                <p className="text-center text-gray-300 text-base md:text-lg mb-8">Weekly rankings of our most dedicated writers.</p>
                {allParticipants.length > 0 && (
                    <div className="max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Search for a participant..."
                            className="w-full bg-gray-800 border border-gray-600 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}
            </div>

            <div className="max-w-4xl mx-auto space-y-3">
                {filteredParticipants.length > 0 ? (
                    filteredParticipants.map((p, index) => (
                        <LeaderboardItem key={p.id} participant={p} rank={sortedParticipants.indexOf(p) + 1} />
                    ))
                ) : (
                    <div className="text-center bg-gray-800/50 p-8 rounded-lg">
                        <h3 className="text-2xl font-semibold text-white">The leaderboard is empty.</h3>
                        <p className="text-gray-400 mt-2">Admins can upload weekly results on the Admin page to populate the rankings.</p>
                    </div>
                )}
            </div>
            
            {allParticipants.length > 0 && (
                <div className="pt-10">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-yellow-400">Hall of Fame</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <HallOfFameCard title="Top Scorer" participant={hallOfFame.highestBestRank} color="border-yellow-500" />
                        <HallOfFameCard title="Longest Streak" participant={hallOfFame.highestStreak} color="border-orange-500" />
                        <HallOfFameCard title="Most Consistent" participant={hallOfFame.mostConsistent} color="border-purple-500" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaderboardPage;