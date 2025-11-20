
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
}

export interface WeeklyResult {
    week: number;
    winners: {
        first: WeeklyWinnerInfo;
        second: WeeklyWinnerInfo;
        third: WeeklyWinnerInfo;
    };
}