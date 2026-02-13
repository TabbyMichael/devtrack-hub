import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSessionStore } from '@/stores/sessionStore';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('sessionStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { clearSessions } = useSessionStore.getState();
    clearSessions();
    useSessionStore.setState({ 
      sessions: [], 
      activeSession: null, 
      loading: false, 
      error: null 
    });
    mockFetch.mockClear();
    // Clear localStorage to prevent persisted state interference
    localStorage.clear();
  });

  it('should initialize with default values', () => {
    const store = useSessionStore.getState();
    
    expect(store.sessions).toEqual([]);
    expect(store.activeSession).toBeNull();
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('should handle successful session start', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        id: 'session-1',
        projectId: 'project-1',
        startTime: new Date().toISOString()
      })
    };
    
    mockFetch.mockResolvedValue(mockResponse);
    
    const store = useSessionStore.getState();
    await store.startSession('project-1', 'Test Project');
    
    const updatedStore = useSessionStore.getState();
    expect(updatedStore.activeSession).not.toBeNull();
    expect(updatedStore.activeSession?.projectId).toBe('project-1');
    expect(updatedStore.activeSession?.projectName).toBe('Test Project');
    expect(typeof updatedStore.activeSession?.startTime).toBe('string');
    expect(updatedStore.loading).toBe(false);
  });

  it('should handle session start error gracefully', async () => {
    const mockResponse = {
      ok: false,
      status: 400,
      json: async () => ({ message: 'Failed to start session' })
    };
    
    mockFetch.mockResolvedValue(mockResponse);
    
    const store = useSessionStore.getState();
    await store.startSession('project-1', 'Test Project');
    
    const updatedStore = useSessionStore.getState();
    expect(updatedStore.error).toBe('Failed to start session');
    expect(updatedStore.loading).toBe(false);
    // Active session should remain null since the operation failed
    expect(updatedStore.activeSession).toBeNull();
  });

  it('should handle successful session stop', async () => {
    // Set up initial state
    const initialState = useSessionStore.getState();
    initialState.activeSession = {
      id: 'session-1',
      projectId: 'project-1',
      projectName: 'Test Project',
      startTime: new Date().toISOString(),
      isPaused: false,
      totalPauseSeconds: 0
    };
    
    const mockResponse = {
      ok: true,
      json: async () => ({
        id: 'session-1',
        projectId: 'project-1',
        projectName: 'Test Project',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        duration: 30,
        notes: 'Test notes'
      })
    };
    
    mockFetch.mockResolvedValue(mockResponse);
    
    const store = useSessionStore.getState();
    await store.stopSession('session-1', 'Test notes');
    
    const updatedStore = useSessionStore.getState();
    expect(updatedStore.sessions).toHaveLength(1);
    expect(updatedStore.sessions[0].duration).toBe(30);
    expect(updatedStore.activeSession).toBeNull();
    expect(updatedStore.loading).toBe(false);
  });

  it('should handle session stop error gracefully', async () => {
    // Set up initial state
    const initialState = useSessionStore.getState();
    initialState.activeSession = {
      id: 'session-1',
      projectId: 'project-1',
      projectName: 'Test Project',
      startTime: new Date().toISOString(),
      isPaused: false,
      totalPauseSeconds: 0
    };
    
    const mockResponse = {
      ok: false,
      status: 400,
      json: async () => ({ message: 'Failed to stop session' })
    };
    
    mockFetch.mockResolvedValue(mockResponse);
    
    const store = useSessionStore.getState();
    await store.stopSession('session-1', 'Test notes');
    
    const updatedStore = useSessionStore.getState();
    expect(updatedStore.error).toBe('Failed to stop session');
    expect(updatedStore.loading).toBe(false);
    // Active session should still be there since the operation failed
    expect(updatedStore.activeSession).not.toBeNull();
  });

  it('should handle successful session pause', async () => {
    // Set up initial state
    const initialState = useSessionStore.getState();
    initialState.activeSession = {
      id: 'session-1',
      projectId: 'project-1',
      projectName: 'Test Project',
      startTime: new Date().toISOString(),
      isPaused: false,
      totalPauseSeconds: 0
    };
    
    const mockResponse = {
      ok: true,
      json: async () => ({})
    };
    
    mockFetch.mockResolvedValue(mockResponse);
    
    const store = useSessionStore.getState();
    await store.pauseSession('session-1');
    
    const updatedStore = useSessionStore.getState();
    expect(updatedStore.activeSession?.isPaused).toBe(true);
    expect(updatedStore.activeSession?.lastPauseTime).toBeDefined();
    expect(updatedStore.loading).toBe(false);
  });

  it('should handle successful session resume', async () => {
    // Set up initial state with paused session
    const initialState = useSessionStore.getState();
    initialState.activeSession = {
      id: 'session-1',
      projectId: 'project-1',
      projectName: 'Test Project',
      startTime: new Date().toISOString(),
      isPaused: true,
      lastPauseTime: new Date().toISOString(),
      totalPauseSeconds: 30
    };
    
    const mockResponse = {
      ok: true,
      json: async () => ({})
    };
    
    mockFetch.mockResolvedValue(mockResponse);
    
    const store = useSessionStore.getState();
    await store.resumeSession('session-1');
    
    const updatedStore = useSessionStore.getState();
    expect(updatedStore.activeSession?.isPaused).toBe(false);
    expect(updatedStore.activeSession?.lastPauseTime).toBeUndefined();
    expect(updatedStore.loading).toBe(false);
  });

  it('should handle successful session deletion', async () => {
    // Set up initial state with sessions
    const initialState = useSessionStore.getState();
    initialState.sessions = [
      { id: 'session-1', projectId: 'project-1', projectName: 'Test Project', startTime: '2023-01-01T00:00:00Z', endTime: '2023-01-01T01:00:00Z', duration: 60, notes: 'Test' },
      { id: 'session-2', projectId: 'project-1', projectName: 'Test Project', startTime: '2023-01-02T00:00:00Z', endTime: '2023-01-02T00:30:00Z', duration: 30, notes: 'Test' }
    ];
    
    const mockResponse = {
      ok: true,
      json: async () => ({})
    };
    
    mockFetch.mockResolvedValue(mockResponse);
    
    const store = useSessionStore.getState();
    await store.deleteSession('session-1');
    
    const updatedStore = useSessionStore.getState();
    expect(updatedStore.sessions).toHaveLength(1);
    expect(updatedStore.sessions[0].id).toBe('session-2');
    expect(updatedStore.loading).toBe(false);
  });
});