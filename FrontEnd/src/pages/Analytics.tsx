import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target,
  Zap,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { format, subDays, startOfDay, isSameDay, isWithinInterval, subMonths } from 'date-fns';
import { useSessionStore } from '@/stores/sessionStore';
import { useProjectStore } from '@/stores/projectStore';
import HoursChart from '@/components/analytics/HoursChart';
import ProjectPieChart from '@/components/analytics/ProjectPieChart';
import { Button } from '@/components/ui/button';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const sessions = useSessionStore((s) => s.sessions);
  const projects = useProjectStore((s) => s.projects);

  // --- Filtered Data ---
  const filteredSessions = useMemo(() => {
    if (timeRange === 'all') return sessions;
    const now = new Date();
    const days = timeRange === 'week' ? 7 : 30;
    const threshold = subDays(now, days);
    return sessions.filter(s => new Date(s.startTime) >= threshold);
  }, [sessions, timeRange]);

  // --- Stats Calculations ---
  const totalMinutes = filteredSessions.reduce((acc, s) => acc + s.duration, 0);
  const totalHours = totalMinutes / 60;

  const avgDaily = useMemo(() => {
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    return totalHours / days;
  }, [totalHours, timeRange]);

  const streak = useMemo(() => {
    const dates = Array.from(new Set(sessions.map((s) => s.startTime.split('T')[0]))).sort().reverse();
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split('T')[0];
      if (dates.includes(key)) count += 1;
      else break;
    }
    return count;
  }, [sessions]);

  // Heatmap Data (simplified representation)
  const heatmapData = useMemo(() => {
    const numDays = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
    const labels = timeRange === 'week' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : [];

    return Array.from({ length: numDays }).map((_, i) => {
      const date = subDays(new Date(), (numDays - 1) - i);
      const daySessions = sessions.filter(s => isSameDay(new Date(s.startTime), date));
      const hours = daySessions.reduce((acc, s) => acc + s.duration, 0) / 60;
      return {
        day: format(date, timeRange === 'week' ? 'EEE' : 'MMM d'),
        fullDate: format(date, 'MMM d, yyyy'),
        hours: parseFloat(hours.toFixed(1)),
      };
    });
  }, [sessions, timeRange]);

  // Pie Data
  const pieData = useMemo(() => {
    const hoursByProject: Record<string, number> = {};
    filteredSessions.forEach((s) => {
      hoursByProject[s.projectId] = (hoursByProject[s.projectId] || 0) + s.duration / 60;
    });
    return projects
      .map((p) => ({
        name: p.name,
        value: Number((hoursByProject[p.id] || 0).toFixed(1)),
      }))
      .filter(p => p.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [filteredSessions, projects]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto pb-12"
    >
      {/* Header with Range Selection */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold lg:text-4xl text-foreground">Analytics</h1>
          <p className="mt-1 text-muted-foreground italic">"Productivity is never an accident."</p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-lg border border-border">
          <Button
            variant={timeRange === 'week' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setTimeRange('week')}
            className="text-xs h-8 px-4"
          >
            Week
          </Button>
          <Button
            variant={timeRange === 'month' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setTimeRange('month')}
            className="text-xs h-8 px-4"
          >
            Month
          </Button>
          <Button
            variant={timeRange === 'all' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setTimeRange('all')}
            className="text-xs h-8 px-4"
          >
            All Time
          </Button>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Clock className="h-5 w-5 text-primary" />}
          label="Total Hours"
          value={`${totalHours.toFixed(1)}h`}
          trend="+12%"
          positive={true}
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-accent" />}
          label="Daily Avg"
          value={`${avgDaily.toFixed(1)}h`}
          trend="+5%"
          positive={true}
        />
        <StatCard
          icon={<Flame className="h-5 w-5 text-warning" />}
          label="Current Streak"
          value={`${streak} days`}
          trend="Steady"
          positive={null}
        />
        <StatCard
          icon={<Zap className="h-5 w-5 text-success" />}
          label="Focus Score"
          value="84"
          trend="+2.4"
          positive={true}
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <HoursChart data={heatmapData} />
        <ProjectPieChart data={pieData} />
      </div>

      {/* Deeper Insights Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Consistency
            </h3>
            <span className="text-xs text-muted-foreground underline cursor-help">How is this calculated?</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {heatmapData.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1 min-w-[32px]">
                <div
                  className="h-8 w-8 rounded-lg border border-border transition-colors duration-500"
                  style={{
                    backgroundColor: d.hours > 4 ? 'hsl(var(--primary))' :
                      d.hours > 2 ? 'hsl(var(--primary) / 0.6)' :
                        d.hours > 0 ? 'hsl(var(--primary) / 0.2)' :
                          'transparent'
                  }}
                  title={`${d.fullDate}: ${d.hours}h`}
                />
                <span className="text-[10px] text-muted-foreground font-medium">{d.day.substring(0, 1)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-heading font-semibold mb-6 flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            Top Focus Goal
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Weekly Goal</p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-accent">28h / 40h</span>
                <span className="text-sm font-medium text-accent/70">70%</span>
              </div>
              <div className="h-2 w-full bg-accent/10 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-accent transition-all duration-1000" style={{ width: '70%' }} />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground text-center">You're on track! Only 12 more hours to reach your pro developer goal.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Helper Component ---
const StatCard = ({ icon, label, value, trend, positive }: { icon: React.ReactNode, label: string, value: string, trend: string, positive: boolean | null }) => (
  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md group">
    <div className="flex items-start justify-between mb-4">
      <div className="p-2.5 rounded-xl bg-muted group-hover:bg-primary/5 transition-colors">
        {icon}
      </div>
      {trend && (
        <span className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${positive === true ? 'text-success bg-success/10' :
          positive === false ? 'text-destructive bg-destructive/10' :
            'text-muted-foreground bg-muted'
          }`}>
          {positive === true && <ArrowUpRight className="h-3 w-3 mr-0.5" />}
          {positive === false && <ArrowDownRight className="h-3 w-3 mr-0.5" />}
          {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-sm text-muted-foreground font-medium">{label}</p>
      <p className="font-heading text-2xl font-bold mt-1">{value}</p>
    </div>
  </div>
);

export default Analytics;
