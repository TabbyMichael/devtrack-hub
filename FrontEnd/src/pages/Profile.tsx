import { useAuthStore } from '@/stores/authStore';
import { useSessionStore } from '@/stores/sessionStore';
import { useProjectStore } from '@/stores/projectStore';
import {
  User,
  Calendar,
  Clock,
  FolderKanban,
  TrendingUp,
  Award,
  Activity,
  History,
  Layout
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';

const Profile = () => {
  const user = useAuthStore((s) => s.user);
  const sessions = useSessionStore((s) => s.sessions);
  const projects = useProjectStore((s) => s.projects);

  // --- Data Calculations ---
  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
  const totalHours = totalMinutes / 60;
  const avgSession = sessions.length > 0 ? totalMinutes / sessions.length : 0;

  // Calculate top projects
  const projectStats = projects.map(p => {
    const projectSessions = sessions.filter(s => s.projectId === p.id);
    const duration = projectSessions.reduce((acc, s) => acc + s.duration, 0);
    return { ...p, duration };
  }).sort((a, b) => b.duration - a.duration).slice(0, 3);

  // Prepare chart data (last 7 days)
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const daySessions = sessions.filter(s => isSameDay(new Date(s.startTime), date));
    const hours = daySessions.reduce((acc, s) => acc + s.duration, 0) / 60;
    return {
      name: format(date, 'EEE'),
      fullDate: format(date, 'MMM d'),
      hours: parseFloat(hours.toFixed(1)),
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto pb-12"
    >
      <h1 className="mb-8 font-heading text-3xl font-bold lg:text-4xl">Profile</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: User Card & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 text-primary border-2 border-primary/20">
                  <User className="h-12 w-12" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg bg-success border-4 border-card" title="Active" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold">{user?.name || 'Developer'}</h2>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
              </div>
              <div className="flex gap-2 w-full pt-2">
                <div className="flex-1 p-3 rounded-xl bg-muted/30 border border-border">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Lvl</p>
                  <p className="text-lg font-bold">12</p>
                </div>
                <div className="flex-1 p-3 rounded-xl bg-muted/30 border border-border">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Rank</p>
                  <p className="text-lg font-bold">Pro</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Key Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Total Time
                </div>
                <span className="font-bold">{totalHours.toFixed(1)}h</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FolderKanban className="h-4 w-4" />
                  Projects
                </div>
                <span className="font-bold">{projects.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Sessions
                </div>
                <span className="font-bold">{sessions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="h-4 w-4" />
                  Avg. Session
                </div>
                <span className="font-bold">{avgSession.toFixed(0)}m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Charts & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Activity Chart */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
                <Layout className="h-5 w-5 text-primary" />
                Weekly Activity
              </h3>
              <div className="text-xs font-medium text-muted-foreground px-2 py-1 rounded bg-muted">
                Last 7 Days (Hours)
              </div>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--primary) / 0.05)' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="hours" radius={[6, 6, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 6 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.3)'}
                        className="transition-all hover:fill-primary"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Projects */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-heading font-semibold mb-6 flex items-center gap-2">
                <Award className="h-5 w-5 text-warning" />
                Top Projects
              </h3>
              <div className="space-y-4">
                {projectStats.map((p, i) => (
                  <div key={p.id} className="group relative flex items-center gap-4 p-3 rounded-xl bg-muted/20 border border-transparent hover:border-border transition-all">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background font-bold text-primary">
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{(p.duration / 60).toFixed(1)} hours spent</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Milestone / Activity */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-heading font-semibold mb-6 flex items-center gap-2">
                <History className="h-5 w-5 text-accent" />
                Recent History
              </h3>
              <div className="space-y-4">
                {sessions.slice(0, 4).map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="text-sm truncate mr-2">{s.projectName}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{format(new Date(s.startTime), 'MMM d')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
