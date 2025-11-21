import React, { useState, useEffect, useCallback } from 'react';
import {
    getParticipants,
    addParticipant,
    deleteParticipant,
    updateLeaderboard,
} from '../services/leaderboardService';
import { Participant } from '../types';

const AdminPage: React.FC = () => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [newParticipantName, setNewParticipantName] = useState('');
    const [weeklyParticipants, setWeeklyParticipants] = useState<string[]>([]);
    const [winners, setWinners] = useState({ first: '', second: '', third: '' });
    const [winnersContent, setWinnersContent] = useState({ first: '', second: '', third: '' });
    const [winnersTitles, setWinnersTitles] = useState({ first: '', second: '', third: '' });
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [year, setYear] = useState(new Date().getFullYear());
    const [semester, setSemester] = useState<'H1' | 'H2'>('H1');
    const [weekNumber, setWeekNumber] = useState(1);

    const refreshData = useCallback(async () => {
        const data = await getParticipants();
        setParticipants(data);
        // setCurrentWeek(getCurrentWeek()); // No longer needed
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    };

    const handleAddParticipant = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await addParticipant(newParticipantName);
        if (result.success) {
            setNewParticipantName('');
            refreshData();
        }
        showNotification(result.success ? 'success' : 'error', result.message);
    };

    const handleDeleteParticipant = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this participant? This action cannot be undone.')) {
            const result = await deleteParticipant(id);
            if (result.success) {
                refreshData();
                // Also remove them from this week's selection if they were selected
                const deletedParticipantName = participants.find(p => p.id === id)?.name;
                if (deletedParticipantName) {
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

    const handleUpdateLeaderboard = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await updateLeaderboard(
            weeklyParticipants,
            winners,
            { year, semester, weekNumber },
            winnersContent,
            winnersTitles
        );

        if (result.success) {
            refreshData();
            setWeeklyParticipants([]);
            setWinners({ first: '', second: '', third: '' });
            setWinnersContent({ first: '', second: '', third: '' });
            setWinnersTitles({ first: '', second: '', third: '' });
            setWeekNumber(prev => prev + 1); // Auto-increment week
        }
        showNotification(result.success ? 'success' : 'error', result.message);
    };

    const getAvailableWinnersForSlot = (currentSlotValue: string) => {
        const otherWinners = Object.values(winners).filter(w => w && w !== currentSlotValue);
        return weeklyParticipants.filter(p => !otherWinners.includes(p));
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-center text-amber-700 dark:text-yellow-400">Admin Panel</h1>

            {notification && (
                <div className={`p - 4 rounded - md text - center ${notification.type === 'success' ? 'bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-300' : 'bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-300'} `} role="alert">
                    {notification.message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Participant Management */}
                <section className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-lg border border-stone-200 dark:border-gray-700" aria-labelledby="manage-participants-heading">
                    <h2 id="manage-participants-heading" className="text-2xl font-bold mb-6 text-stone-800 dark:text-white">Manage Participants</h2>
                    <form onSubmit={handleAddParticipant} className="flex flex-col sm:flex-row gap-4 mb-6">
                        <label htmlFor="new-participant-name" className="sr-only">New participant name</label>
                        <input
                            id="new-participant-name"
                            type="text"
                            value={newParticipantName}
                            onChange={(e) => setNewParticipantName(e.target.value)}
                            placeholder="New participant name..."
                            className="flex-grow bg-stone-100 dark:bg-gray-700 border border-stone-300 dark:border-gray-600 rounded-md px-4 py-2 text-stone-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-600 dark:focus:ring-yellow-500"
                        />
                        <button type="submit" className="bg-amber-600 dark:bg-yellow-500 text-white dark:text-gray-900 font-bold py-2 px-6 rounded-md hover:bg-amber-700 dark:hover:bg-yellow-400 transition-colors">
                            Add
                        </button>
                    </form>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {participants.length > 0 ? (
                            participants.map(p => (
                                <div key={p.id} className="flex items-center justify-between bg-stone-100 dark:bg-gray-700 p-3 rounded-md">
                                    <span className="text-stone-700 dark:text-gray-200">{p.name}</span>
                                    <button onClick={() => handleDeleteParticipant(p.id)} className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold text-sm" aria-label={`Delete ${p.name} `}>
                                        Delete
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-stone-500 dark:text-gray-400 text-center py-4">No participants added yet.</p>
                        )}
                    </div>
                </section>

                {/* Update Leaderboard */}
                <section className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-lg border border-stone-200 dark:border-gray-700" aria-labelledby="update-leaderboard-heading">
                    <h2 id="update-leaderboard-heading" className="text-2xl font-bold mb-4 text-stone-800 dark:text-white">Update Leaderboard</h2>

                    <form onSubmit={handleUpdateLeaderboard} className="space-y-6">
                        {/* Week Details Inputs */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="year" className="block text-sm font-medium text-stone-600 dark:text-gray-300 mb-1">Year</label>
                                <input
                                    type="number"
                                    id="year"
                                    value={year}
                                    onChange={(e) => setYear(parseInt(e.target.value))}
                                    className="w-full bg-stone-100 dark:bg-gray-700 border border-stone-300 dark:border-gray-600 rounded-md px-3 py-2 text-stone-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-600 dark:focus:ring-yellow-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="semester" className="block text-sm font-medium text-stone-600 dark:text-gray-300 mb-1">Semester</label>
                                <select
                                    id="semester"
                                    value={semester}
                                    onChange={(e) => setSemester(e.target.value as 'H1' | 'H2')}
                                    className="w-full bg-stone-100 dark:bg-gray-700 border border-stone-300 dark:border-gray-600 rounded-md px-3 py-2 text-stone-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-600 dark:focus:ring-yellow-500"
                                >
                                    <option value="H1">H1</option>
                                    <option value="H2">H2</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="week" className="block text-sm font-medium text-stone-600 dark:text-gray-300 mb-1">Week</label>
                                <input
                                    type="number"
                                    id="week"
                                    value={weekNumber}
                                    onChange={(e) => setWeekNumber(parseInt(e.target.value))}
                                    min="1"
                                    className="w-full bg-stone-100 dark:bg-gray-700 border border-stone-300 dark:border-gray-600 rounded-md px-3 py-2 text-stone-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-600 dark:focus:ring-yellow-500"
                                />
                            </div>
                        </div>

                        <fieldset>
                            <legend className="text-lg font-semibold mb-3 text-stone-700 dark:text-gray-200">1. Select This Week's Participants</legend>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2 border border-stone-200 dark:border-gray-700 rounded-md">
                                {participants.length > 0 ? (
                                    participants.map(p => (
                                        <label key={p.id} className="flex items-center space-x-2 p-2 rounded-md bg-stone-100/50 dark:bg-gray-700/50 hover:bg-stone-200 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                                            <input
                                                type="checkbox"
                                                name="weekly_participant"
                                                value={p.name}
                                                checked={weeklyParticipants.includes(p.name)}
                                                onChange={() => handleWeeklyParticipantToggle(p.name)}
                                                className="form-checkbox h-4 w-4 bg-stone-200 dark:bg-gray-600 border-stone-300 dark:border-gray-500 text-amber-600 dark:text-yellow-500 focus:ring-amber-600 dark:focus:ring-yellow-500"
                                            />
                                            <span className="text-stone-700 dark:text-gray-300">{p.name}</span>
                                        </label>
                                    ))
                                ) : (
                                    <p className="text-stone-500 dark:text-gray-400 col-span-full text-center py-4">Add participants to get started.</p>
                                )}
                            </div>
                        </fieldset>

                        {weeklyParticipants.length > 2 && (
                            <fieldset>
                                <legend className="text-lg font-semibold mb-3 text-stone-700 dark:text-gray-200">2. Select Winners & Add Content</legend>
                                <div className="space-y-6">
                                    {/* 1st Place */}
                                    <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                                        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">🥇 1st Place</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Winner</label>
                                                <select
                                                    value={winners.first}
                                                    onChange={(e) => setWinners({ ...winners, first: e.target.value })}
                                                    className="w-full p-2 border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                                                >
                                                    <option value="">Select Winner</option>
                                                    {getAvailableWinnersForSlot(winners.first).map(name => (
                                                        <option key={`1st - ${name}`} value={name}>{name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Title of Work</label>
                                                <input
                                                    type="text"
                                                    value={winnersTitles.first}
                                                    onChange={(e) => setWinnersTitles({ ...winnersTitles, first: e.target.value })}
                                                    placeholder="e.g., The Golden Dawn"
                                                    className="w-full p-2 border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Content (Poem/Story)</label>
                                            <textarea
                                                value={winnersContent.first}
                                                onChange={(e) => setWinnersContent({ ...winnersContent, first: e.target.value })}
                                                placeholder="Paste the winning entry here..."
                                                rows={4}
                                                className="w-full p-2 border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-mono text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* 2nd Place */}
                                    <div className="mb-6 p-4 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-lg">
                                        <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-3">🥈 2nd Place</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Winner</label>
                                                <select
                                                    value={winners.second}
                                                    onChange={(e) => setWinners({ ...winners, second: e.target.value })}
                                                    className="w-full p-2 border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                                                >
                                                    <option value="">Select Winner</option>
                                                    {getAvailableWinnersForSlot(winners.second).map(name => (
                                                        <option key={`2nd - ${name}`} value={name}>{name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Title of Work</label>
                                                <input
                                                    type="text"
                                                    value={winnersTitles.second}
                                                    onChange={(e) => setWinnersTitles({ ...winnersTitles, second: e.target.value })}
                                                    placeholder="e.g., Whispers in the Dark"
                                                    className="w-full p-2 border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Content (Poem/Story)</label>
                                            <textarea
                                                value={winnersContent.second}
                                                onChange={(e) => setWinnersContent({ ...winnersContent, second: e.target.value })}
                                                placeholder="Paste the winning entry here..."
                                                rows={4}
                                                className="w-full p-2 border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-mono text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* 3rd Place */}
                                    <div className="mb-8 p-4 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-lg">
                                        <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-3">🥉 3rd Place</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Winner</label>
                                                <select
                                                    value={winners.third}
                                                    onChange={(e) => setWinners({ ...winners, third: e.target.value })}
                                                    className="w-full p-2 border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                                                >
                                                    <option value="">Select Winner</option>
                                                    {getAvailableWinnersForSlot(winners.third).map(name => (
                                                        <option key={`3rd - ${name}`} value={name}>{name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Title of Work</label>
                                                <input
                                                    type="text"
                                                    value={winnersTitles.third}
                                                    onChange={(e) => setWinnersTitles({ ...winnersTitles, third: e.target.value })}
                                                    placeholder="e.g., The Last Leaf"
                                                    className="w-full p-2 border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Content (Poem/Story)</label>
                                            <textarea
                                                value={winnersContent.third}
                                                onChange={(e) => setWinnersContent({ ...winnersContent, third: e.target.value })}
                                                placeholder="Paste the winning entry here..."
                                                rows={4}
                                                className="w-full p-2 border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-mono text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        )}

                        <button
                            type="submit"
                            disabled={!winners.first || !winners.second || !winners.third}
                            className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-700 dark:hover:bg-green-500 transition-colors disabled:bg-stone-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            Submit Results for {year} {semester} Week {weekNumber}
                        </button>
                    </form>
                </section>
            </div>
        </div >
    );
};

export default AdminPage;