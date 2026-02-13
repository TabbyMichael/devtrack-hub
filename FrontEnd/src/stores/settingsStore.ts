import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService } from '@/services/api';

interface SettingsState {
    // Timer Settings
    timer: {
        workDuration: number;
        shortBreak: number;
        longBreak: number;
    };
    // Notifications & Sound
    notifications: {
        enabled: boolean;
        soundEnabled: boolean;
        volume: number;
    };
    // Display
    display: {
        autoTimezone: boolean;
    };
    loading: boolean;
    error: string | null;
    // Actions
    fetchSettings: () => Promise<void>;
    updateTimer: (timer: Partial<SettingsState['timer']>) => Promise<void>;
    updateNotifications: (notifications: Partial<SettingsState['notifications']>) => Promise<void>;
    updateDisplay: (display: Partial<SettingsState['display']>) => Promise<void>;
    updateSettings: (settings: Partial<SettingsState>) => Promise<void>;
    resetSettings: () => void;
}

const DEFAULT_SETTINGS = {
    timer: {
        workDuration: 25,
        shortBreak: 5,
        longBreak: 15,
    },
    notifications: {
        enabled: true,
        soundEnabled: true,
        volume: 50,
    },
    display: {
        autoTimezone: true,
    },
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            ...DEFAULT_SETTINGS,
            loading: false,
            error: null,
            
            fetchSettings: async () => {
                set({ loading: true, error: null });
                try {
                    const response = await apiService.get('/v1/users/preferences');
                    if (!response.ok) throw new Error('Failed to fetch settings');
                    const data = await response.json();
                    set({ ...data, loading: false });
                } catch (error) {
                    set({ error: error.message, loading: false });
                }
            },
            
            updateTimer: async (timer) => {
                set({ loading: true, error: null });
                try {
                    const response = await apiService.patch('/v1/users/preferences', { timer: { ...timer } });
                    if (!response.ok) throw new Error('Failed to update timer settings');
                    const updatedSettings = await response.json();
                    set((state) => ({ 
                        timer: { ...state.timer, ...timer },
                        loading: false 
                    }));
                } catch (error) {
                    set({ error: error.message, loading: false });
                }
            },
            
            updateNotifications: async (notifications) => {
                set({ loading: true, error: null });
                try {
                    const response = await apiService.patch('/v1/users/preferences', { notifications: { ...notifications } });
                    if (!response.ok) throw new Error('Failed to update notification settings');
                    const updatedSettings = await response.json();
                    set((state) => ({ 
                        notifications: { ...state.notifications, ...notifications },
                        loading: false 
                    }));
                } catch (error) {
                    set({ error: error.message, loading: false });
                }
            },
            
            updateDisplay: async (display) => {
                set({ loading: true, error: null });
                try {
                    const response = await apiService.patch('/v1/users/preferences', { display: { ...display } });
                    if (!response.ok) throw new Error('Failed to update display settings');
                    const updatedSettings = await response.json();
                    set((state) => ({ 
                        display: { ...state.display, ...display },
                        loading: false 
                    }));
                } catch (error) {
                    set({ error: error.message, loading: false });
                }
            },
            
            updateSettings: async (settings) => {
                set({ loading: true, error: null });
                try {
                    const response = await apiService.patch('/v1/users/preferences', settings);
                    if (!response.ok) throw new Error('Failed to update settings');
                    const updatedSettings = await response.json();
                    set({ ...updatedSettings, loading: false });
                } catch (error) {
                    set({ error: error.message, loading: false });
                }
            },
            
            resetSettings: () => set(DEFAULT_SETTINGS),
        }),
        {
            name: 'devtrack-settings',
        }
    )
);
