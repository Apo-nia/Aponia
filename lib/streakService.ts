import { StreakData } from '../src/types/user';
import { mockDatabase } from './database';

export class StreakService {
  private static instance: StreakService;
  private userId: string;

  private constructor() {
    this.userId = this.getValidUserId();
  }

  public static getInstance(): StreakService {
    if (!StreakService.instance) {
      StreakService.instance = new StreakService();
    }
    return StreakService.instance;
  }

  private getValidUserId(): string {
    if (typeof window === 'undefined') return 'user123'; // SSR fallback
    
    let userId = localStorage.getItem('UserId');
    
    // Check if the stored userId exists in mock database
    if (userId && mockDatabase[userId]) {
      return userId;
    }
    
    // If no valid userId found, default to user123 (exists in mock database)
    userId = 'user123';
    localStorage.setItem('UserId', userId);
    return userId;
  }

  public getCurrentUserId(): string {
    return this.userId;
  }

  public switchUser(userId: string): boolean {
    // Only allow switching to users that exist in mock database
    if (mockDatabase[userId]) {
      this.userId = userId;
      if (typeof window !== 'undefined') {
        localStorage.setItem('UserId', userId);
      }
      return true;
    }
    return false;
  }

  public getAvailableUserIds(): string[] {
    return Object.keys(mockDatabase);
  }

  public async getStreakData(): Promise<StreakData | null> {
    try {
      const response = await fetch(`/api/streak?userId=${this.userId}`);
      const data = await response.json();
      
      if (data.success) {
        return data.streak;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to fetch streak data:', error);
      return null;
    }
  }

  public async completeSession(): Promise<boolean> {
    try {
      const response = await fetch('/api/streak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: this.userId, 
          action: 'complete' 
        }),
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Failed to complete session:', error);
      return false;
    }
  }

  public async restoreStreak(): Promise<{ success: boolean; error?: string; streak?: StreakData; focusPoints?: number }> {
    try {
      const response = await fetch('/api/streak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: this.userId, 
          action: 'restore' 
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to restore streak:', error);
      return { success: false, error: 'Network error' };
    }
  }

  public async getFocusPoints(): Promise<number> {
    try {
      const response = await fetch(`/api/focuspoint?userId=${this.userId}`);
      const data = await response.json();
      
      if (data.success) {
        return data.focusPoints;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to fetch focus points:', error);
      return 0;
    }
  }
}
