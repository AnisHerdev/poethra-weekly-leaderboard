export interface Participant {
    id: string;
    name: string;
    totalPoints: number;
    currentStreak: number;
    totalParticipations?: number;
    participationHistory?: number[]; // Optional/deprecated for new schema
    bestRank?: number | null; // Optional/deprecated for new schema
}

export class SuspenseModeActiveError extends Error {
    readonly isLeaderboardBlurred: boolean;
    readonly customNotice?: string;

    constructor(customNotice?: string) {
        super('Leaderboard is currently in suspense mode.');
        this.name = 'SuspenseModeActiveError';
        this.isLeaderboardBlurred = true;
        this.customNotice = customNotice;
        Object.setPrototypeOf(this, SuspenseModeActiveError.prototype);
    }
}

export interface LeaderboardSettings {
    isLeaderboardBlurred?: boolean;
    customNotice?: string;
    [key: string]: any;
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
    totalParticipations?: number;
}

export interface WeeklyWinnerInfo {
    name: string;
    participantId?: string; // New field from updated schema
    id?: string; // Kept for backward compatibility
    content?: string;
    title?: string;
}

export interface NormalizedWeeklyWinners {
    first: WeeklyWinnerInfo[];
    second: WeeklyWinnerInfo[];
    third: WeeklyWinnerInfo[];
}

export interface WeeklyResult {
    id: string; // Format: YYYY_Sem_Week
    year: number;
    semester: string; // "H1" | "H2"
    weekNumber: number;
    participantIds: string[]; // Replaced weeklyParticipants
    winners: {
        first: WeeklyWinnerInfo | WeeklyWinnerInfo[];
        second: WeeklyWinnerInfo | WeeklyWinnerInfo[];
        third: WeeklyWinnerInfo | WeeklyWinnerInfo[];
    };
    createdAt?: string; // ISO 8601 timestamp
    updatedAt?: string; // ISO 8601 timestamp
    timestamp?: any;
}

export interface NormalizedWeeklyResult extends Omit<WeeklyResult, 'winners'> {
    winners: NormalizedWeeklyWinners;
}

export interface ClubEvent {
    id: string;
    title: string;
    subtitle: string;
    date: string;
    description: string;
    imageUrl: string;
    imageCaption?: string;
    youtubeUrl?: string;
    tiltAngle?: number;
}
