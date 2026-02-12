import { useParams, Link } from 'react-router-dom';
import { useProjectStore } from '@/stores/projectStore';
import { useSessionStore } from '@/stores/sessionStore';
import { ArrowLeft, Clock, Hash, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const project = useProjectStore((s) => s.projects.find((p) => p.id === id));
  const sessions = useSessionStore((s) => s.sessions.filter((s) => s.projectId === id));

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <p>Project not found.</p>
        <Link to="/projects" className="mt-2 text-primary hover:underline">
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <Link
        to="/projects"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      <div className="mb-8 flex items-center gap-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold"
          style={{ backgroundColor: project.color.replace('hsl(', 'hsla(').replace(')', ', 0.12)'), color: project.color }}
        >
          {project.name.charAt(0)}
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <Clock className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Total Hours</p>
            <p className="font-heading text-xl font-bold">{project.totalHours}h</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <Hash className="h-5 w-5 text-accent" />
          <div>
            <p className="text-sm text-muted-foreground">Sessions</p>
            <p className="font-heading text-xl font-bold">{project.sessionsCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <Calendar className="h-5 w-5 text-warning" />
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="font-heading text-xl font-bold">
              {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Sessions
        </h3>
        {sessions.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No sessions recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-lg bg-background p-3">
                <div>
                  <p className="text-sm font-medium">{session.notes || 'No notes'}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(session.startTime).toLocaleString('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <p className="font-heading text-sm font-medium">{(session.duration / 60).toFixed(1)}h</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
