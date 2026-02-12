import { create } from 'zustand';
import type { Project } from '@/types';

interface ProjectState {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'totalHours' | 'sessionsCount' | 'createdAt'>) => void;
  deleteProject: (id: string) => void;
}

const mockProjects: Project[] = [
  { id: '1', name: 'DevTrack', description: 'Developer productivity dashboard', color: 'hsl(199, 89%, 48%)', totalHours: 24.5, sessionsCount: 18, createdAt: '2026-01-15' },
  { id: '2', name: 'Portfolio Site', description: 'Personal portfolio website', color: 'hsl(152, 60%, 48%)', totalHours: 12.3, sessionsCount: 8, createdAt: '2026-01-20' },
  { id: '3', name: 'API Gateway', description: 'Microservice API gateway', color: 'hsl(280, 65%, 60%)', totalHours: 8.7, sessionsCount: 5, createdAt: '2026-02-01' },
  { id: '4', name: 'Mobile App', description: 'Cross-platform mobile application', color: 'hsl(35, 92%, 60%)', totalHours: 15.1, sessionsCount: 12, createdAt: '2026-02-05' },
  { id: '5', name: 'Data Pipeline', description: 'ETL data processing pipeline', color: 'hsl(340, 75%, 55%)', totalHours: 6.2, sessionsCount: 4, createdAt: '2026-02-08' },
];

export const useProjectStore = create<ProjectState>((set) => ({
  projects: mockProjects,

  addProject: (project) =>
    set((state) => ({
      projects: [
        ...state.projects,
        {
          ...project,
          id: String(Date.now()),
          totalHours: 0,
          sessionsCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
        },
      ],
    })),

  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    })),
}));
