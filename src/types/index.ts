export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  totalHours: number;
  sessionsCount: number;
  createdAt: string;
}

export interface Session {
  id: string;
  projectId: string;
  projectName: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  notes?: string;
}

export interface ActiveSession {
  projectId: string;
  projectName: string;
  startTime: string;
}
