import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session, ActiveSession } from '@/types';

interface SessionState {
  sessions: Session[];
  activeSession: ActiveSession | null;
  loading: boolean;
  error: string | null;
  startSession: (projectId: string, projectName: string) => Promise<void>;
  stopSession: (sessionId: string, notes?: string) => Promise<void>;
  pauseSession: (sessionId: string) => Promise<void>;
  resumeSession: (sessionId: string) => Promise<void>;
  fetchSessions: (page?: number, limit?: number) => Promise<void>;
  fetchActiveSession: () => Promise<void>;
  clearSessions: () => void;
  addManualSession: (session: Omit<Session, 'id'>) => void;
  deleteSession: (id: string) => Promise<void>;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSession: null,
      loading: false,
      error: null,

      fetchSessions: async (page = 1, limit = 20) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/v1/sessions?page=${page}&limit=${limit}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) throw new Error('Failed to fetch sessions');
          
          const data = await response.json();
          set({ sessions: data.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      fetchActiveSession: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/v1/sessions/active', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (response.status === 404) {
            set({ activeSession: null, loading: false });
            return;
          }
          
          if (!response.ok) throw new Error('Failed to fetch active session');
          
          const data = await response.json();
          set({ activeSession: data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      startSession: async (projectId, projectName) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/v1/sessions/start', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ projectId }),
          });
          
          if (!response.ok) throw new Error('Failed to start session');
          
          const data = await response.json();
          set({
            activeSession: {
              id: data.id,
              projectId: data.projectId,
              projectName,
              startTime: data.startTime,
              isPaused: false,
              totalPauseSeconds: 0,
            },
            loading: false,
          });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      stopSession: async (sessionId, notes = '') => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/v1/sessions/${sessionId}/stop`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ notes }),
          });
          
          if (!response.ok) throw new Error('Failed to stop session');
          
          const data = await response.json();
          set({
            sessions: [data, ...get().sessions],
            activeSession: null,
            loading: false,
          });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      pauseSession: async (sessionId) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/v1/sessions/${sessionId}/pause`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) throw new Error('Failed to pause session');
          
          const data = await response.json();
          set({
            activeSession: { ...get().activeSession, isPaused: true, lastPauseTime: new Date().toISOString() },
            loading: false,
          });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      resumeSession: async (sessionId) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/v1/sessions/${sessionId}/resume`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) throw new Error('Failed to resume session');
          
          const data = await response.json();
          set({
            activeSession: { ...get().activeSession, isPaused: false, lastPauseTime: undefined },
            loading: false,
          });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      deleteSession: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/v1/sessions/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) throw new Error('Failed to delete session');
          
          set({
            sessions: get().sessions.filter((s) => s.id !== id),
            loading: false,
          });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      clearSessions: () => set({ sessions: [] }),
      addManualSession: (session) =>
        set((state) => ({
          sessions: [
            {
              ...session,
              id: String(Date.now()),
            },
            ...state.sessions,
          ],
        })),
    }),
    { name: 'devtrack-sessions' }
  )
);
