import { useState, useMemo, useEffect } from 'react';
import StatsCard from '@/components/dashboard/StatsCard';
import SessionTimer from '@/components/dashboard/SessionTimer';
import { useSessionStore } from '@/stores/sessionStore';
import { useProjectStore } from '@/stores/projectStore';
import { useAuthStore } from '@/stores/authStore';
import {
  Clock,
  CalendarDays,
  FolderKanban,
  Flame,
  Zap,
  Target,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/stores/settingsStore';

const Dashboard = () => {
  const user = useAuthStore((s) => s.user);
  const sessions = useSessionStore((s) => s.sessions);
  const projects = useProjectStore((s) => s.projects);
  const { timer } = useSettingsStore();

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const todayDate = new Date().toISOString().split('T')[0];
  const todaySessions = useMemo(() =>
    sessions.filter((s) => s.startTime.startsWith(todayDate)),
    [sessions, todayDate]);

  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.duration, 0);
  const todayHours = todayMinutes / 60;

  // Daily Goal (derived from settings or mock)
  const dailyGoalHours = (timer.workDuration * 4) / 60; // Just as an example goal
  const progressPercent = Math.min(100, (todayHours / dailyGoalHours) * 100);

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as any
      }
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      className="max-w-7xl mx-auto space-y-10 pb-12"
    >
      {/* Header Section */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold tracking-tight text-sm uppercase">
            <Zap className="h-4 w-4 fill-primary" />
            Productivity Hub
          </div>
          <h1 className="font-heading text-4xl font-black lg:text-5xl tracking-tight text-foreground">
            {greeting}, <span className="text-primary">{user?.name || 'Developer'}</span> 👋
          </h1>
          <p className="text-muted-foreground text-lg font-medium italic">
            "Your only limit is your mind."
          </p>
        </div>

        {/* Daily Progress Tracker Card */}
        <div className="w-full md:w-80 p-5 rounded-3xl border border-border bg-card/50 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="h-20 w-20 text-primary" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Daily Focus Goal</span>
              <span className="text-xs font-black text-primary">{progressPercent.toFixed(0)}%</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black font-heading">{todayHours.toFixed(1)}h</span>
              <span className="text-muted-foreground text-sm font-bold">/ {dailyGoalHours.toFixed(1)}h</span>
            </div>
            <Progress value={progressPercent} className="h-2.5 bg-muted" />
            <p className="text-[10px] text-muted-foreground font-medium">
              {progressPercent >= 100 ? "Goal reached! You're on fire today." : `${(dailyGoalHours - todayHours).toFixed(1)}h more to reach your daily target.`}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Summary Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Hours Today"
          value={todayHours.toFixed(1) + 'h'}
          subtitle="+0.5h from yesterday"
          icon={Clock}
          accentColor="var(--primary)"
          className="bg-primary/5 border-primary/10"
        />
        <StatsCard
          title="Active Projects"
          value={String(projects.filter(p => p.status === 'active').length)}
          subtitle={`${sessions.length} total sessions`}
          icon={FolderKanban}
          accentColor="var(--accent)"
          className="bg-accent/5 border-accent/10"
        />
        <StatsCard
          title="Efficiency"
          value="92%"
          subtitle="Top 5% of users"
          icon={TrendingUp}
          accentColor="var(--success)"
          className="bg-success/5 border-success/10"
        />
        <StatsCard
          title="Streak"
          value="7 days"
          subtitle="Best: 22 days"
          icon={Flame}
          accentColor="var(--warning)"
          className="bg-warning/5 border-warning/10"
        />
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3 items-start">
        {/* Main Workspace - Timer */}
        <motion.div variants={item} className="lg:col-span-1 sticky top-8">
          <SessionTimer />
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={item} className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-border bg-card shadow-lg overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <History className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg">
                  Recent Activity
                </h3>
              </div>
              <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/5">
                Full History <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="divide-y divide-border">
              <AnimatePresence>
                {sessions.slice(0, 5).map((session, idx) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div
                          className="h-12 w-12 rounded-2xl flex items-center justify-center text-background shadow-md group-hover:scale-105 transition-transform"
                          style={{ backgroundColor: projects.find(p => p.id === session.projectId)?.color || 'var(--primary)' }}
                        >
                          <Clock className="h-6 w-6 opacity-80" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background bg-success" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-bold text-base leading-none group-hover:text-primary transition-colors">
                          {session.projectName}
                        </p>
                        <p className="text-xs font-medium text-muted-foreground max-w-[200px] truncate">
                          {session.notes || 'No notes provided for this session'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-black font-heading tracking-tight">
                          {(session.duration / 60).toFixed(1)}h
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {new Date(session.startTime).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="h-8 rounded-lg border-primary/20 hover:bg-primary/5 font-bold text-[10px] uppercase opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        Resume
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {sessions.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-muted-foreground font-medium">No recent activity. Start your first session to see it here!</p>
              </div>
            )}
          </div>

          {/* Quick Tip / Insight Card */}
          <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-background to-accent/5 border border-primary/10 p-6 flex items-center gap-6">
            <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center animate-pulse">
              <Zap className="h-8 w-8 text-primary fill-primary" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Pro Tip: Deep Work Sprints</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You're 22% more productive between 9 AM and 11 AM. Try scheduling your most complex tasks during this morning window!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
