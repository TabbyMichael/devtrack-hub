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
  status: 'active' | 'archived';
  priority: 'low' | 'medium' | 'high';
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
  id?: string;
  projectId: string;
  projectName: string;
  startTime: string;
  isPaused: boolean;
  lastPauseTime?: string;
  totalPauseSeconds: number;
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  acceptedAt?: string;
  invitedAt: string;
  user?: User;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatar?: string;
  members?: TeamMember[];
  _count?: {
    members: number;
    projects: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  teamId: string;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'CANCELLED' | 'PAST_DUE';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}
