import { Participant, WeeklyResult } from '../types';
import { POINTS } from '../constants';
import { db } from '../src/firebase';
import { collection, getDocs, query, orderBy, addDoc, deleteDoc, doc, writeBatch, setDoc, Timestamp } from 'firebase/firestore';

const LOCAL_STORAGE_KEY_WEEK = 'poethra_week';
const LOCAL_STORAGE_KEY_WEEKLY_RESULTS = 'poethra_weekly_results';

// --- Firestore Integration ---
const IS_PRODUCTION = false;

const PARTICIPANTS_COLLECTION = IS_PRODUCTION
    ? 'participants_production'
    : 'participants_test';

// Toggle between 'weekly_results_production' and 'weekly_results_test'
const LEADERBOARD_COLLECTION = IS_PRODUCTION
    ? 'weekly_results_production'
    : 'weekly_results_test';


export const fetchLeaderboard = async (): Promise<Participant[]> => {
    try {
        const q = query(collection(db, PARTICIPANTS_COLLECTION));
        const querySnapshot = await getDocs(q);

        const participants: Participant[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name || "Unknown",
                totalPoints: parseInt(data.points) || 0,
                currentStreak: parseInt(data.streak) || 0,
                participationHistory: data.participationHistory || [],
                bestRank: data.bestRank || null
            };
        });

        // Sort by points descending
        return participants.sort((a, b) => b.totalPoints - a.totalPoints);
    } catch (error: any) {
        console.error("Error fetching leaderboard from Firestore:", error);
        throw error;
    }
};

// --- Participant Management ---

export const getParticipants = async (): Promise<Participant[]> => {
    return await fetchLeaderboard();
};



export const addParticipant = async (name: string): Promise<{ success: boolean, message: string }> => {
    if (!name || name.trim() === '') {
        return { success: false, message: 'Participant name cannot be empty.' };
    }

    try {
        const allParticipants = await getParticipants();
        const existingParticipant = allParticipants.some(p => p.name.toLowerCase() === name.trim().toLowerCase());

        if (existingParticipant) {
            return { success: false, message: `Participant '${name}' already exists.` };
        }

        const newParticipantData = {
            name: name.trim(),
            points: 0, // Firestore schema uses 'points'
            streak: 0, // Firestore schema uses 'streak'
            participationHistory: [],
            bestRank: null
        };

        await addDoc(collection(db, PARTICIPANTS_COLLECTION), newParticipantData);
        return { success: true, message: `Participant '${name}' added successfully.` };

    } catch (error) {
        console.error("Error adding participant to Firestore:", error);
        return { success: false, message: 'Failed to save new participant.' };
    }
};

export const deleteParticipant = async (participantId: string): Promise<{ success: boolean, message: string }> => {
    try {
        await deleteDoc(doc(db, PARTICIPANTS_COLLECTION, participantId));
        return { success: true, message: 'Participant deleted successfully.' };
    } catch (error) {
        console.error("Error deleting participant from Firestore:", error);
        return { success: false, message: 'Failed to delete participant.' };
    }
};

// --- Weekly Results Management ---

export const fetchWeeklyResults = async (): Promise<WeeklyResult[]> => {
    try {
        // Order by year desc, then weekNumber desc to get latest first
        const q = query(collection(db, LEADERBOARD_COLLECTION), orderBy("year", "desc"), orderBy("weekNumber", "desc"));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                year: data.year,
                semester: data.semester,
                weekNumber: data.weekNumber,
                weeklyParticipants: data.weeklyParticipants || [],
                winners: data.winners,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                timestamp: data.timestamp
            } as WeeklyResult;
        });
    } catch (error) {
        console.error("Error fetching weekly results from Firestore:", error);
        return [];
    }
};



// --- Leaderboard Update Logic ---



export const updateLeaderboard = async (
    weeklyParticipantNames: string[],
    winners: { first: string; second: string; third: string },
    details: { year: number, semester: string, weekNumber: number },
    winnersContent: { first: string, second: string, third: string },
    winnersTitles: { first: string, second: string, third: string }
): Promise<{ success: boolean, message: string }> => {

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

    try {
        const allParticipants = await getParticipants();
        const batch = writeBatch(db);

        // Update streaks and participation history
        const updatedParticipants = allParticipants.map(p => {
            let updatedP = { ...p };

            if (weeklyParticipantNamesSet.has(p.name.toLowerCase())) {
                // Participated this week
                updatedP.currentStreak = p.currentStreak + 1;
                // We can just push the week number for now, or maybe a composite string if needed later
                // For now, keeping it as number to match existing type
                updatedP.participationHistory = [...p.participationHistory, details.weekNumber];
            } else {
                // Missed this week
                updatedP.currentStreak = 0;
            }
            return updatedP;
        });

        // Calculate points and update ranks
        // We don't need to map again, we can do it in one pass, but keeping logic separate for clarity
        updatedParticipants.forEach(p => {
            if (!weeklyParticipantNamesSet.has(p.name.toLowerCase())) {
                // Update Firestore even if only streak changed (reset to 0)
                const docRef = doc(db, PARTICIPANTS_COLLECTION, p.id);
                batch.update(docRef, {
                    streak: p.currentStreak,
                    participationHistory: p.participationHistory
                });
                return;
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

            const docRef = doc(db, PARTICIPANTS_COLLECTION, p.id);
            batch.update(docRef, {
                points: newTotalPoints,
                streak: p.currentStreak,
                participationHistory: p.participationHistory,
                bestRank: newBestRank
            });
        });

        // Prepare Weekly Result Document
        const winnerNamesMap = {
            first: winners.first.toLowerCase(),
            second: winners.second.toLowerCase(),
            third: winners.third.toLowerCase(),
        };

        const winnerParticipants = {
            first: allParticipants.find(p => p.name.toLowerCase() === winnerNamesMap.first),
            second: allParticipants.find(p => p.name.toLowerCase() === winnerNamesMap.second),
            third: allParticipants.find(p => p.name.toLowerCase() === winnerNamesMap.third),
        };

        if (!winnerParticipants.first || !winnerParticipants.second || !winnerParticipants.third) {
            return { success: false, message: "Could not find one of the winning participants." };
        }

        const weeklyResultId = `${details.year}_${details.semester}_${details.weekNumber}`;
        const now = new Date().toISOString();
        const newWeeklyResult: WeeklyResult = {
            id: weeklyResultId,
            year: details.year,
            semester: details.semester,
            weekNumber: details.weekNumber,
            weeklyParticipants: weeklyParticipantNames,
            winners: {
                first: {
                    id: winnerParticipants.first.id,
                    name: winnerParticipants.first.name,
                    content: winnersContent.first,
                    title: winnersTitles.first
                },
                second: {
                    id: winnerParticipants.second.id,
                    name: winnerParticipants.second.name,
                    content: winnersContent.second,
                    title: winnersTitles.second
                },
                third: {
                    id: winnerParticipants.third.id,
                    name: winnerParticipants.third.name,
                    content: winnersContent.third,
                    title: winnersTitles.third
                },
            },
            createdAt: now,
            updatedAt: now,
            timestamp: Timestamp.now()
        };

        const weeklyResultRef = doc(db, LEADERBOARD_COLLECTION, weeklyResultId);
        batch.set(weeklyResultRef, newWeeklyResult);

        // Commit the batch update to Firestore
        await batch.commit();

        return { success: true, message: `Leaderboard updated successfully for ${details.semester} Week ${details.weekNumber}.` };

    } catch (error) {
        console.error("Error updating leaderboard in Firestore", error);
        return { success: false, message: "Failed to update leaderboard." };
    }
};