import HoursChart from '@/components/analytics/HoursChart';
import ProjectPieChart from '@/components/analytics/ProjectPieChart';
import { useSessionStore } from '@/stores/sessionStore';
import { Flame, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Analytics = () => {
  const sessions = useSessionStore((s) => s.sessions);
  const totalHours = sessions.reduce((acc, s) => acc + s.duration, 0) / 60;
  const avgDaily = totalHours / 7;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold lg:text-3xl">Analytics</h1>
        <p className="mt-1 text-muted-foreground">Insights into your development productivity.</p>
      </div>

      {/* Summary cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Hours</p>
            <p className="font-heading text-2xl font-bold">{totalHours.toFixed(1)}h</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Daily</p>
            <p className="font-heading text-2xl font-bold">{avgDaily.toFixed(1)}h</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: 'hsl(35, 92%, 60%, 0.1)' }}>
            <Flame className="h-5 w-5 text-warning" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <p className="font-heading text-2xl font-bold">7 days</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <HoursChart />
        <ProjectPieChart />
      </div>
    </motion.div>
  );
};

export default Analytics;
