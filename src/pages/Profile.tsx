import { useAuthStore } from '@/stores/authStore';
import { useSessionStore } from '@/stores/sessionStore';
import { useProjectStore } from '@/stores/projectStore';
import { User, Mail, Calendar, Clock, FolderKanban } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const user = useAuthStore((s) => s.user);
  const sessions = useSessionStore((s) => s.sessions);
  const projects = useProjectStore((s) => s.projects);
  const totalHours = sessions.reduce((acc, s) => acc + s.duration, 0) / 60;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <h1 className="mb-8 font-heading text-2xl font-bold lg:text-3xl">Profile</h1>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold">{user?.name || 'Developer'}</h2>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg bg-background p-4">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Total Hours</p>
              <p className="font-heading font-bold">{totalHours.toFixed(1)}h</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-background p-4">
            <FolderKanban className="h-5 w-5 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Projects</p>
              <p className="font-heading font-bold">{projects.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-background p-4">
            <Calendar className="h-5 w-5 text-warning" />
            <div>
              <p className="text-xs text-muted-foreground">Sessions</p>
              <p className="font-heading font-bold">{sessions.length}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
