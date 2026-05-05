import { Participant, WeeklyResult } from '../types';
import { db } from '../src/firebase';
import { collection, getDocs, query, orderBy, doc, Timestamp } from 'firebase/firestore';

// --- Firestore Integration ---
const IS_PRODUCTION = true;

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
                totalPoints: parseInt(data.totalScore) || 0,
                currentStreak: parseInt(data.currentStreak) || 0,
                participationHistory: data.participationHistory || [],
                bestRank: data.bestRank || null
            };
        });

        // Sort by points descending, then streak descending
        return participants.sort((a, b) => {
            if (b.totalPoints !== a.totalPoints) {
                return b.totalPoints - a.totalPoints;
            }
            return b.currentStreak - a.currentStreak;
        });
    } catch (error: any) {
        console.error("Error fetching leaderboard from Firestore:", error);
        throw error;
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