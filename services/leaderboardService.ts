import { Participant } from '../types';
import { POINTS } from '../constants';

const LOCAL_STORAGE_KEY_PARTICIPANTS = 'poethra_participants';
const LOCAL_STORAGE_KEY_WEEK = 'poethra_week';

// --- Participant Management ---

export const getParticipants = (): Participant[] => {
    try {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY_PARTICIPANTS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Error fetching participants from localStorage", error);
        return [];
    }
};

export const saveParticipants = (participants: Participant[]): boolean => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY_PARTICIPANTS, JSON.stringify(participants));
        return true;
    } catch (error) {
        console.error("Error saving participants to localStorage", error);
        return false;
    }
}

export const addParticipant = (name: string): { success: boolean, message: string } => {
    if (!name || name.trim() === '') {
        return { success: false, message: 'Participant name cannot be empty.' };
    }
    const allParticipants = getParticipants();
    const existingParticipant = allParticipants.some(p => p.name.toLowerCase() === name.trim().toLowerCase());

    if (existingParticipant) {
        return { success: false, message: `Participant '${name}' already exists.` };
    }

    const newParticipant: Participant = {
        id: String(Date.now() + Math.random()),
        name: name.trim(),
        totalPoints: 0,
        currentStreak: 0,
        participationHistory: [],
        bestRank: null
    };

    const updatedParticipants = [...allParticipants, newParticipant];
    const saved = saveParticipants(updatedParticipants);

    if (saved) {
        return { success: true, message: `Participant '${name}' added successfully.` };
    }
    return { success: false, message: 'Failed to save new participant.' };
};

export const deleteParticipant = (participantId: string): { success: boolean, message: string } => {
    let allParticipants = getParticipants();
    const participantToDelete = allParticipants.find(p => p.id === participantId);
    
    if (!participantToDelete) {
        return { success: false, message: 'Participant not found.' };
    }

    const updatedParticipants = allParticipants.filter(p => p.id !== participantId);
    const saved = saveParticipants(updatedParticipants);

    if (saved) {
        return { success: true, message: `Participant '${participantToDelete.name}' deleted.` };
    }
    return { success: false, message: 'Failed to delete participant.' };
};


// --- Leaderboard Update Logic ---

export const getCurrentWeek = (): number => {
    return parseInt(localStorage.getItem(LOCAL_STORAGE_KEY_WEEK) || '0', 10);
};

export const updateLeaderboard = (
    weeklyParticipantNames: string[],
    winners: { first: string; second: string; third: string }
): { success: boolean, message: string } => {

    // Validation
    if (!winners.first || !winners.second || !winners.third) {
        return { success: false, message: "Please select 1st, 2nd, and 3rd place winners." };
    }
    const winnerNames = [winners.first, winners.second, winners.third];
    if (new Set(winnerNames).size !== 3) {
        return { success: false, message: "Each of the top 3 winners must be a unique participant." };
    }

    const weeklyParticipantNamesSet = new Set(weeklyParticipantNames.map(name => name.toLowerCase()));
    for (const winner of winnerNames) {
        if (!weeklyParticipantNamesSet.has(winner.toLowerCase())) {
            return { success: false, message: `Winner '${winner}' is not in the weekly participants list.` };
        }
    }

    const allParticipants = getParticipants();
    const newWeek = getCurrentWeek() + 1;

    // Update streaks and participation history
    let updatedParticipants = allParticipants.map(p => {
        if (weeklyParticipantNamesSet.has(p.name.toLowerCase())) {
            // Participated this week
            return {
                ...p,
                currentStreak: p.currentStreak + 1,
                participationHistory: [...p.participationHistory, newWeek]
            };
        }
        // Missed this week
        return { ...p, currentStreak: 0 };
    });

    // Calculate points and update ranks
    const finalParticipants = updatedParticipants.map(p => {
        if (!weeklyParticipantNamesSet.has(p.name.toLowerCase())) {
            return p; // No points if they didn't participate this week
        }

        let pointsToAdd = POINTS.PARTICIPATION;
        let rank: number | null = null;

        if (p.name.toLowerCase() === winners.first.toLowerCase()) {
            pointsToAdd = POINTS.FIRST_PLACE;
            rank = 1;
        } else if (p.name.toLowerCase() === winners.second.toLowerCase()) {
            pointsToAdd = POINTS.SECOND_PLACE;
            rank = 2;
        } else if (p.name.toLowerCase() === winners.third.toLowerCase()) {
            pointsToAdd = POINTS.THIRD_PLACE;
            rank = 3;
        } else {
            rank = 4; // Simplified rank for other participants
        }

        const newTotalPoints = p.totalPoints + pointsToAdd;
        const newBestRank = (p.bestRank === null || (rank !== null && rank < p.bestRank)) ? rank : p.bestRank;

        return { ...p, totalPoints: newTotalPoints, bestRank: newBestRank };
    });
    
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY_PARTICIPANTS, JSON.stringify(finalParticipants));
        localStorage.setItem(LOCAL_STORAGE_KEY_WEEK, String(newWeek));
        return { success: true, message: `Leaderboard updated successfully for week ${newWeek}.` };
    } catch (error) {
        console.error("Error saving to localStorage", error);
        return { success: false, message: "Failed to update leaderboard." };
    }
};