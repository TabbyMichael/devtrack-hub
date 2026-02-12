import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    // Actions
    updateTimer: (timer: Partial<SettingsState['timer']>) => void;
    updateNotifications: (notifications: Partial<SettingsState['notifications']>) => void;
    updateDisplay: (display: Partial<SettingsState['display']>) => void;
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
            updateTimer: (timer) =>
                set((state) => ({ timer: { ...state.timer, ...timer } })),
            updateNotifications: (notifications) =>
                set((state) => ({ notifications: { ...state.notifications, ...notifications } })),
            updateDisplay: (display) =>
                set((state) => ({ display: { ...state.display, ...display } })),
            resetSettings: () => set(DEFAULT_SETTINGS),
        }),
        {
            name: 'devtrack-settings',
        }
    )
);
