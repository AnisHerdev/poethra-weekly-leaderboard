import { Participant, WeeklyResult } from '../types';
import { db } from '../src/firebase';
import { collection, getDocs, query, orderBy, doc, Timestamp } from 'firebase/firestore';

// --- Firestore Integration ---
const IS_PRODUCTION = false;

const PARTICIPANTS_COLLECTION = IS_PRODUCTION
    ? 'participants_production'
    : 'participants_test';

const SEMESTERS_COLLECTION = IS_PRODUCTION
    ? 'semesters_production'
    : 'semesters_test';

const SEMESTER_STATS_COLLECTION = IS_PRODUCTION
    ? 'semester_stats_production'
    : 'semester_stats_test';

// Toggle between 'weekly_results_production' and 'weekly_results_test'
const LEADERBOARD_COLLECTION = IS_PRODUCTION
    ? 'weekly_results_production'
    : 'weekly_results_test';


export const fetchLeaderboard = async (): Promise<Participant[]> => {
    try {
        // 1. Fetch active semester
        const semestersQ = query(collection(db, SEMESTERS_COLLECTION));
        const semestersSnapshot = await getDocs(semestersQ);
        const activeSemesterDoc = semestersSnapshot.docs.find(doc => doc.data().isActive === true);
        
        if (!activeSemesterDoc) {
            console.warn("No active semester found.");
            return [];
        }

        const activeSemesterId = activeSemesterDoc.id;

        // 2. Fetch stats for active semester
        const statsQ = query(collection(db, SEMESTER_STATS_COLLECTION));
        const statsSnapshot = await getDocs(statsQ);
        const semesterStats = statsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter((data: any) => data.semesterId === activeSemesterId);

        // 3. Fetch master roster
        const participantsQ = query(collection(db, PARTICIPANTS_COLLECTION));
        const participantsSnapshot = await getDocs(participantsQ);
        
        // Create a map for quick lookup: participantId -> name
        const participantsMap = new Map<string, any>();
        participantsSnapshot.docs.forEach(doc => {
            participantsMap.set(doc.id, doc.data());
        });

        // 4. Map stats to Participant return type
        const participants: Participant[] = semesterStats.map((stat: any) => {
            const masterData = participantsMap.get(stat.participantId);
            return {
                id: stat.participantId, // We use participantId as the id for the Participant object
                name: masterData?.name || "Unknown",
                totalPoints: parseInt(stat.totalScore) || 0,
                currentStreak: parseInt(stat.currentStreak) || 0,
                participationHistory: [], // Optional/deprecated
                bestRank: null // Optional/deprecated
            };
        });

        // 5. Sort by points descending, then streak descending
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
                participantIds: data.participantIds || [],
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