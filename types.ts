
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
}

export interface WeeklyResult {
    id: string; // Format: YYYY_Sem_Week
    year: number;
    semester: string; // "H1" | "H2"
    weekNumber: number;
    winners: {
        first: WeeklyWinnerInfo;
        second: WeeklyWinnerInfo;
        third: WeeklyWinnerInfo;
    };
    timestamp?: any;
}