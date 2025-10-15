
export interface Participant {
  id: string;
  name: string;
  totalPoints: number;
  currentStreak: number;
  participationHistory: number[]; // Array of weeks participated
  bestRank: number | null;
}
