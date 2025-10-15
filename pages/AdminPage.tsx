import React, { useState, useEffect, useCallback } from 'react';
import {
    getParticipants,
    addParticipant,
    deleteParticipant,
    updateLeaderboard,
    getCurrentWeek,
} from '../services/leaderboardService';
import { Participant } from '../types';

const AdminPage: React.FC = () => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [newParticipantName, setNewParticipantName] = useState('');
    const [weeklyParticipants, setWeeklyParticipants] = useState<string[]>([]);
    const [winners, setWinners] = useState({ first: '', second: '', third: '' });
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [currentWeek, setCurrentWeek] = useState(0);

    const refreshData = useCallback(() => {
        setParticipants(getParticipants());
        setCurrentWeek(getCurrentWeek());
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    };

    const handleAddParticipant = (e: React.FormEvent) => {
        e.preventDefault();
        const result = addParticipant(newParticipantName);
        if (result.success) {
            setNewParticipantName('');
            refreshData();
        }
        showNotification(result.success ? 'success' : 'error', result.message);
    };

    const handleDeleteParticipant = (id: string) => {
        if (window.confirm('Are you sure you want to delete this participant? This action cannot be undone.')) {
            const result = deleteParticipant(id);
            if (result.success) {
                refreshData();
                // Also remove them from this week's selection if they were selected
                const deletedParticipantName = participants.find(p => p.id === id)?.name;
                if(deletedParticipantName) {
                    setWeeklyParticipants(prev => prev.filter(name => name !== deletedParticipantName));
                }
            }
            showNotification(result.success ? 'success' : 'error', result.message);
        }
    };

    const handleWeeklyParticipantToggle = (name: string) => {
        setWeeklyParticipants(prev => {
            const isSelected = prev.includes(name);
            if (isSelected) {
                // If unselecting a winner, clear their winner slot
                if (winners.first === name) setWinners(w => ({ ...w, first: '' }));
                if (winners.second === name) setWinners(w => ({ ...w, second: '' }));
                if (winners.third === name) setWinners(w => ({ ...w, third: '' }));
                return prev.filter(pName => pName !== name);
            } else {
                return [...prev, name];
            }
        });
    };

    const handleUpdateLeaderboard = (e: React.FormEvent) => {
        e.preventDefault();
        const result = updateLeaderboard(weeklyParticipants, winners);
        if (result.success) {
            refreshData();
            setWeeklyParticipants([]);
            setWinners({ first: '', second: '', third: '' });
        }
        showNotification(result.success ? 'success' : 'error', result.message);
    };
    
    const getAvailableWinnersForSlot = (currentSlotValue: string) => {
        const otherWinners = Object.values(winners).filter(w => w && w !== currentSlotValue);
        return weeklyParticipants.filter(p => !otherWinners.includes(p));
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-center text-yellow-400">Admin Panel</h1>

            {notification && (
                <div className={`p-4 rounded-md text-center ${notification.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`} role="alert">
                    {notification.message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Participant Management */}
                <section className="bg-gray-800/50 p-6 rounded-lg shadow-lg border border-gray-700" aria-labelledby="manage-participants-heading">
                    <h2 id="manage-participants-heading" className="text-2xl font-bold mb-6 text-white">Manage Participants</h2>
                    <form onSubmit={handleAddParticipant} className="flex gap-4 mb-6">
                        <label htmlFor="new-participant-name" className="sr-only">New participant name</label>
                        <input
                            id="new-participant-name"
                            type="text"
                            value={newParticipantName}
                            onChange={(e) => setNewParticipantName(e.target.value)}
                            placeholder="New participant name..."
                            className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <button type="submit" className="bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-md hover:bg-yellow-400 transition-colors">
                            Add
                        </button>
                    </form>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {participants.length > 0 ? (
                             participants.map(p => (
                                <div key={p.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
                                    <span className="text-gray-200">{p.name}</span>
                                    <button onClick={() => handleDeleteParticipant(p.id)} className="text-red-400 hover:text-red-300 font-semibold text-sm" aria-label={`Delete ${p.name}`}>
                                        Delete
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center py-4">No participants added yet.</p>
                        )}
                    </div>
                </section>

                {/* Update Leaderboard */}
                <section className="bg-gray-800/50 p-6 rounded-lg shadow-lg border border-gray-700" aria-labelledby="update-leaderboard-heading">
                    <h2 id="update-leaderboard-heading" className="text-2xl font-bold mb-4 text-white">Update Leaderboard</h2>
                    <p className="text-lg text-yellow-400 mb-6">Updating for Week {currentWeek + 1}</p>
                    
                    <form onSubmit={handleUpdateLeaderboard} className="space-y-6">
                        <fieldset>
                            <legend className="text-lg font-semibold mb-3 text-gray-200">1. Select This Week's Participants</legend>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2 border border-gray-700 rounded-md">
                                {participants.length > 0 ? (
                                    participants.map(p => (
                                        <label key={p.id} className="flex items-center space-x-2 p-2 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer transition-colors">
                                            <input
                                                type="checkbox"
                                                name="weekly_participant"
                                                value={p.name}
                                                checked={weeklyParticipants.includes(p.name)}
                                                onChange={() => handleWeeklyParticipantToggle(p.name)}
                                                className="form-checkbox h-4 w-4 bg-gray-600 border-gray-500 text-yellow-500 focus:ring-yellow-500"
                                            />
                                            <span className="text-gray-300">{p.name}</span>
                                        </label>
                                    ))
                                ) : (
                                    <p className="text-gray-400 col-span-full text-center py-4">Add participants to get started.</p>
                                )}
                            </div>
                        </fieldset>

                        {weeklyParticipants.length > 2 && (
                             <fieldset>
                                <legend className="text-lg font-semibold mb-3 text-gray-200">2. Select Winners</legend>
                                <div className="space-y-4">
                                     {/* 1st Place */}
                                     <div>
                                        <label htmlFor="first-place" className="block text-sm font-medium text-gray-300 mb-1">🥇 1st Place</label>
                                        <select
                                            id="first-place"
                                            value={winners.first}
                                            onChange={(e) => setWinners({ ...winners, first: e.target.value })}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            required
                                        >
                                            <option value="" disabled>Select winner</option>
                                            {getAvailableWinnersForSlot(winners.first).map(name => <option key={`1st-${name}`} value={name}>{name}</option>)}
                                        </select>
                                    </div>
                                    {/* 2nd Place */}
                                     <div>
                                        <label htmlFor="second-place" className="block text-sm font-medium text-gray-300 mb-1">🥈 2nd Place</label>
                                        <select
                                            id="second-place"
                                            value={winners.second}
                                            onChange={(e) => setWinners({ ...winners, second: e.target.value })}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            required
                                        >
                                            <option value="" disabled>Select winner</option>
                                             {getAvailableWinnersForSlot(winners.second).map(name => <option key={`2nd-${name}`} value={name}>{name}</option>)}
                                        </select>
                                    </div>
                                    {/* 3rd Place */}
                                    <div>
                                        <label htmlFor="third-place" className="block text-sm font-medium text-gray-300 mb-1">🥉 3rd Place</label>
                                        <select
                                            id="third-place"
                                            value={winners.third}
                                            onChange={(e) => setWinners({ ...winners, third: e.target.value })}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            required
                                        >
                                            <option value="" disabled>Select winner</option>
                                            {getAvailableWinnersForSlot(winners.third).map(name => <option key={`3rd-${name}`} value={name}>{name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </fieldset>
                        )}

                        <button
                            type="submit"
                            disabled={!winners.first || !winners.second || !winners.third}
                            className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            Submit Results for Week {currentWeek + 1}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default AdminPage;
