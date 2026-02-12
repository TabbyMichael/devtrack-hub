import { create } from 'zustand';
import type { Session, ActiveSession } from '@/types';

interface SessionState {
  sessions: Session[];
  activeSession: ActiveSession | null;
  startSession: (projectId: string, projectName: string) => void;
  stopSession: (notes?: string) => void;
}

const mockSessions: Session[] = [
  { id: '1', projectId: '1', projectName: 'DevTrack', startTime: '2026-02-12T09:00:00', endTime: '2026-02-12T11:30:00', duration: 150, notes: 'Implemented dashboard UI' },
  { id: '2', projectId: '2', projectName: 'Portfolio Site', startTime: '2026-02-12T13:00:00', endTime: '2026-02-12T14:45:00', duration: 105, notes: 'Designed hero section' },
  { id: '3', projectId: '1', projectName: 'DevTrack', startTime: '2026-02-11T10:00:00', endTime: '2026-02-11T12:00:00', duration: 120, notes: 'Auth flow implementation' },
  { id: '4', projectId: '4', projectName: 'Mobile App', startTime: '2026-02-11T14:00:00', endTime: '2026-02-11T16:30:00', duration: 150, notes: 'Navigation setup' },
  { id: '5', projectId: '3', projectName: 'API Gateway', startTime: '2026-02-10T09:30:00', endTime: '2026-02-10T11:00:00', duration: 90, notes: 'Rate limiting middleware' },
  { id: '6', projectId: '5', projectName: 'Data Pipeline', startTime: '2026-02-10T13:00:00', endTime: '2026-02-10T15:15:00', duration: 135, notes: 'Data transformation logic' },
  { id: '7', projectId: '1', projectName: 'DevTrack', startTime: '2026-02-09T09:00:00', endTime: '2026-02-09T10:30:00', duration: 90, notes: 'Project setup and routing' },
  { id: '8', projectId: '2', projectName: 'Portfolio Site', startTime: '2026-02-09T11:00:00', endTime: '2026-02-09T12:00:00', duration: 60, notes: 'Contact form' },
];

export const useSessionStore = create<SessionState>((set) => ({
  sessions: mockSessions,
  activeSession: null,

  startSession: (projectId, projectName) =>
    set({
      activeSession: {
        projectId,
        projectName,
        startTime: new Date().toISOString(),
      },
    }),

  stopSession: (notes) =>
    set((state) => {
      if (!state.activeSession) return state;
      const start = new Date(state.activeSession.startTime);
      const duration = Math.round((Date.now() - start.getTime()) / 60000);
      const newSession: Session = {
        id: String(Date.now()),
        projectId: state.activeSession.projectId,
        projectName: state.activeSession.projectName,
        startTime: state.activeSession.startTime,
        endTime: new Date().toISOString(),
        duration,
        notes,
      };
      return {
        sessions: [newSession, ...state.sessions],
        activeSession: null,
      };
    }),
}));
