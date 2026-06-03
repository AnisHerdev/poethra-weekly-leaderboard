
export interface Participant {
    id: string;
    name: string;
    totalPoints: number;
    currentStreak: number;
    participationHistory?: number[]; // Optional/deprecated for new schema
    bestRank?: number | null; // Optional/deprecated for new schema
}

export interface Semester {
    id: string;
    isActive: boolean;
    name?: string;
}

export interface SemesterStats {
    id: string;
    participantId: string;
    semesterId: string;
    totalScore: number;
    currentStreak: number;
}

export interface WeeklyWinnerInfo {
    name: string;
    participantId?: string; // New field from updated schema
    id?: string; // Kept for backward compatibility
    content?: string;
    title?: string;
}

export interface WeeklyResult {
    id: string; // Format: YYYY_Sem_Week
    year: number;
    semester: string; // "H1" | "H2"
    weekNumber: number;
    participantIds: string[]; // Replaced weeklyParticipants
    winners: {
        first: WeeklyWinnerInfo;
        second: WeeklyWinnerInfo;
        third: WeeklyWinnerInfo;
    };
    createdAt?: string; // ISO 8601 timestamp
    updatedAt?: string; // ISO 8601 timestamp
    timestamp?: any;
}