import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project } from '@/types';
import { apiService } from '@/services/api';

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: (page?: number, limit?: number) => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'totalHours' | 'sessionsCount' | 'createdAt' | 'status' | 'priority'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  restoreProject: (id: string) => Promise<void>;
  toggleArchive: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],
      loading: false,
      error: null,

      fetchProjects: async (page = 1, limit = 20) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.get('/v1/projects', { page: page.toString(), limit: limit.toString() });
          if (!response.ok) throw new Error('Failed to fetch projects');
          const data = await response.json();
          set({ projects: data.data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      addProject: async (project) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.post('/v1/projects', project);
          if (!response.ok) throw new Error('Failed to create project');
          const newProject = await response.json();
          set((state) => ({ projects: [...state.projects, newProject], loading: false }));
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      updateProject: async (id, updatedProject) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.patch(`/v1/projects/${id}`, updatedProject);
          if (!response.ok) throw new Error('Failed to update project');
          const updatedProj = await response.json();
          set((state) => ({
            projects: state.projects.map((p) => (p.id === id ? { ...p, ...updatedProj } : p)),
            loading: false,
          }));
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      deleteProject: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.delete(`/v1/projects/${id}`);
          if (!response.ok) throw new Error('Failed to delete project');
          set((state) => ({
            projects: state.projects.map((p) => 
              p.id === id ? { ...p, deletedAt: new Date().toISOString() } : p
            ),
            loading: false,
          }));
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      restoreProject: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.post(`/v1/projects/${id}/restore`);
          if (!response.ok) throw new Error('Failed to restore project');
          const restoredProject = await response.json();
          set((state) => ({
            projects: state.projects.map((p) => (p.id === id ? restoredProject : p)),
            loading: false,
          }));
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      toggleArchive: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.get(`/v1/projects/${id}`);
          if (!response.ok) throw new Error('Failed to fetch project');
          const project = await response.json();
          const newStatus = project.status === 'active' ? 'archived' : 'active';
          const updateResponse = await apiService.patch(`/v1/projects/${id}`, { status: newStatus });
          if (!updateResponse.ok) throw new Error('Failed to update project status');
          const updatedProject = await updateResponse.json();
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === id ? { ...p, status: updatedProject.status } : p
            ),
            loading: false,
          }));
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },
    }),
    { name: 'devtrack-projects' }
  )
);
