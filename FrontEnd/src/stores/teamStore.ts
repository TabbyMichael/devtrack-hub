import { create } from 'zustand';
import { Team } from '@/types';
import { api } from '@/lib/api';

interface TeamStore {
  teams: Team[];
  currentTeam: Team | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTeams: () => Promise<void>;
  createTeam: (data: { name: string; slug: string; description?: string; avatar?: string }) => Promise<Team>;
  updateTeam: (id: string, data: Partial<{ name: string; description: string; avatar: string }>) => Promise<Team>;
  deleteTeam: (id: string) => Promise<void>;
  switchTeam: (teamId: string) => Promise<void>;
  inviteMember: (teamId: string, email: string, role: string) => Promise<void>;
  removeMember: (teamId: string, memberId: string) => Promise<void>;
  updateMemberRole: (teamId: string, memberId: string, role: string) => Promise<void>;
  acceptInvitation: (token: string) => Promise<void>;
  rejectInvitation: (token: string) => Promise<void>;
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  teams: [],
  currentTeam: null,
  loading: false,
  error: null,

  fetchTeams: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/teams');
      set({ teams: response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch teams',
        loading: false 
      });
    }
  },

  createTeam: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/teams', data);
      const newTeam = response.data;
      set(state => ({
        teams: [...state.teams, newTeam],
        loading: false
      }));
      return newTeam;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to create team',
        loading: false 
      });
      throw error;
    }
  },

  updateTeam: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch(`/teams/${id}`, data);
      const updatedTeam = response.data;
      set(state => ({
        teams: state.teams.map(team => 
          team.id === id ? updatedTeam : team
        ),
        currentTeam: state.currentTeam?.id === id ? updatedTeam : state.currentTeam,
        loading: false
      }));
      return updatedTeam;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update team',
        loading: false 
      });
      throw error;
    }
  },

  deleteTeam: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/teams/${id}`);
      set(state => ({
        teams: state.teams.filter(team => team.id !== id),
        currentTeam: state.currentTeam?.id === id ? null : state.currentTeam,
        loading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete team',
        loading: false 
      });
      throw error;
    }
  },

  switchTeam: async (teamId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/teams/switch', { teamId });
      const team = response.data;
      set({ 
        currentTeam: team,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to switch team',
        loading: false 
      });
      throw error;
    }
  },

  inviteMember: async (teamId, email, role) => {
    set({ loading: true, error: null });
    try {
      await api.post(`/teams/${teamId}/invite`, { email, role });
      // Refresh team data to get updated members
      const response = await api.get(`/teams/${teamId}`);
      const updatedTeam = response.data;
      set(state => ({
        teams: state.teams.map(team => 
          team.id === teamId ? updatedTeam : team
        ),
        currentTeam: state.currentTeam?.id === teamId ? updatedTeam : state.currentTeam,
        loading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to invite member',
        loading: false 
      });
      throw error;
    }
  },

  removeMember: async (teamId, memberId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/teams/${teamId}/members/${memberId}`);
      // Refresh team data
      const response = await api.get(`/teams/${teamId}`);
      const updatedTeam = response.data;
      set(state => ({
        teams: state.teams.map(team => 
          team.id === teamId ? updatedTeam : team
        ),
        currentTeam: state.currentTeam?.id === teamId ? updatedTeam : state.currentTeam,
        loading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to remove member',
        loading: false 
      });
      throw error;
    }
  },

  updateMemberRole: async (teamId, memberId, role) => {
    set({ loading: true, error: null });
    try {
      await api.patch(`/teams/${teamId}/members/${memberId}`, { role });
      // Refresh team data
      const response = await api.get(`/teams/${teamId}`);
      const updatedTeam = response.data;
      set(state => ({
        teams: state.teams.map(team => 
          team.id === teamId ? updatedTeam : team
        ),
        currentTeam: state.currentTeam?.id === teamId ? updatedTeam : state.currentTeam,
        loading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update member role',
        loading: false 
      });
      throw error;
    }
  },

  acceptInvitation: async (token) => {
    set({ loading: true, error: null });
    try {
      await api.post('/teams/invitations/accept', { token });
      // Refresh teams list
      await get().fetchTeams();
      set({ loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to accept invitation',
        loading: false 
      });
      throw error;
    }
  },

  rejectInvitation: async (token) => {
    set({ loading: true, error: null });
    try {
      await api.post('/teams/invitations/reject', { token });
      // Refresh teams list
      await get().fetchTeams();
      set({ loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to reject invitation',
        loading: false 
      });
      throw error;
    }
  }
}));