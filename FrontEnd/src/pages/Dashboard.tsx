import StatsCard from '@/components/dashboard/StatsCard';
import SessionTimer from '@/components/dashboard/SessionTimer';
import { useSessionStore } from '@/stores/sessionStore';
import { useProjectStore } from '@/stores/projectStore';
import { useAuthStore } from '@/stores/authStore';
import { Clock, CalendarDays, FolderKanban, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const user = useAuthStore((s) => s.user);
  const sessions = useSessionStore((s) => s.sessions);
  const projects = useProjectStore((s) => s.projects);

  const todayDate = new Date().toISOString().split('T')[0]
  const todayHours = sessions
    .filter((s) => s.startTime.startsWith(todayDate))
    .reduce((acc, s) => acc + s.duration, 0) / 60;

  const weekHours = sessions.reduce((acc, s) => acc + s.duration, 0) / 60;

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={container}>
      <motion.div variants={item} className="mb-8">
        <h1 className="font-heading text-2xl font-bold lg:text-3xl">
          Good morning, {user?.name || 'Developer'} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">Here&apos;s your productivity overview.</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Hours Today"
          value={todayHours.toFixed(1) + 'h'}
          subtitle="+0.5h from yesterday"
          icon={Clock}
          accentColor="hsl(199, 89%, 48%)"
        />
        <StatsCard
          title="This Week"
          value={weekHours.toFixed(1) + 'h'}
          subtitle="Target: 40h"
          icon={CalendarDays}
          accentColor="hsl(152, 60%, 48%)"
        />
        <StatsCard
          title="Active Projects"
          value={String(projects.length)}
          subtitle={`${sessions.length} total sessions`}
          icon={FolderKanban}
          accentColor="hsl(280, 65%, 60%)"
        />
        <StatsCard
          title="Current Streak"
          value="7 days"
          subtitle="Best: 14 days"
          icon={Flame}
          accentColor="hsl(35, 92%, 60%)"
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Timer */}
        <motion.div variants={item} className="lg:col-span-1">
          <SessionTimer />
        </motion.div>

        {/* Recent Sessions */}
        <motion.div variants={item} className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Recent Sessions
            </h3>
            <div className="space-y-3">
              {sessions.slice(0, 6).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg bg-background p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium">{session.projectName}</p>
                      <p className="text-xs text-muted-foreground">{session.notes}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium font-heading">
                      {(session.duration / 60).toFixed(1)}h
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(session.startTime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
