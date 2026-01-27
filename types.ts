
export interface Participant {
    id: string;
    name: string;
    totalPoints: number;
    currentStreak: number;
    participationHistory: number[]; // Array of weeks participated
    bestRank: number | null;
}

export interface WeeklyWinnerInfo {
    name: string;
    id: string;
    content?: string;
    title?: string;
}

export interface WeeklyResult {
    id: string; // Format: YYYY_Sem_Week
    year: number;
    semester: string; // "H1" | "H2"
    weekNumber: number;
    weeklyParticipants: string[]; // Array of participant names
    winners: {
        first: WeeklyWinnerInfo;
        second: WeeklyWinnerInfo;
        third: WeeklyWinnerInfo;
    };
    createdAt?: string; // ISO 8601 timestamp
    updatedAt?: string; // ISO 8601 timestamp
    timestamp?: any;
}