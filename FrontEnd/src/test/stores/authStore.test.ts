import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '@/stores/authStore';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('authStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { logout } = useAuthStore.getState();
    logout();
    mockFetch.mockClear();
  });

  it('should initialize with default values', () => {
    const store = useAuthStore.getState();
    
    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.refreshToken).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('should handle successful login', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      })
    };
    
    mockFetch.mockResolvedValue(mockResponse);
    
    const store = useAuthStore.getState();
    await store.login('test@example.com', 'password123');
    
    const updatedStore = useAuthStore.getState();
    expect(updatedStore.isAuthenticated).toBe(true);
    expect(updatedStore.user).toEqual({
      id: '1',
      name: 'Test User',
      email: 'test@example.com'
    });
    expect(updatedStore.token).toBe('mock-access-token');
    expect(updatedStore.refreshToken).toBe('mock-refresh-token');
    expect(updatedStore.isLoading).toBe(false);
  });

  it('should handle login error', async () => {
    const mockResponse = {
      ok: false,
      json: async () => ({ message: 'Invalid credentials' })
    };
    
    mockFetch.mockResolvedValue(mockResponse);
    
    const store = useAuthStore.getState();
    
    await expect(store.login('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    
    const updatedStore = useAuthStore.getState();
    expect(updatedStore.isAuthenticated).toBe(false);
    expect(updatedStore.error).toBe('Invalid credentials');
    expect(updatedStore.isLoading).toBe(false);
  });

  it('should handle successful registration', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      })
    };
    
    mockFetch.mockResolvedValue(mockResponse);
    
    const store = useAuthStore.getState();
    await store.register('Test User', 'test@example.com', 'password123');
    
    const updatedStore = useAuthStore.getState();
    expect(updatedStore.isAuthenticated).toBe(true);
    expect(updatedStore.user).toEqual({
      id: '1',
      name: 'Test User',
      email: 'test@example.com'
    });
    expect(updatedStore.token).toBe('mock-access-token');
    expect(updatedStore.refreshToken).toBe('mock-refresh-token');
    expect(updatedStore.isLoading).toBe(false);
  });

  it('should handle logout', () => {
    // First login to set up authenticated state
    const initialState = useAuthStore.getState();
    initialState.user = { id: '1', name: 'Test User', email: 'test@example.com' };
    initialState.token = 'mock-token';
    initialState.refreshToken = 'mock-refresh-token';
    initialState.isAuthenticated = true;
    
    const store = useAuthStore.getState();
    store.logout();
    
    const updatedStore = useAuthStore.getState();
    expect(updatedStore.user).toBeNull();
    expect(updatedStore.token).toBeNull();
    expect(updatedStore.refreshToken).toBeNull();
    expect(updatedStore.isAuthenticated).toBe(false);
  });
});