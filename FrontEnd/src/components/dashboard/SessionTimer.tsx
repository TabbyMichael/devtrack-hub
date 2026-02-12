import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Play,
  Square,
  Pause,
  RefreshCcw,
  Zap,
  Clock,
  AlertCircle,
  Hash,
  MessageSquare
} from 'lucide-react';
import { useSessionStore } from '@/stores/sessionStore';
import { useProjectStore } from '@/stores/projectStore';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const SessionTimer = () => {
  const { activeSession, startSession, stopSession, pauseSession, resumeSession } = useSessionStore();
  const projects = useProjectStore((s) => s.projects);
  const [selectedProject, setSelectedProject] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (!activeSession) {
      setElapsed(0);
      return;
    }

    const updateTimer = () => {
      const start = new Date(activeSession.startTime).getTime();
      let totalPauseSeconds = activeSession.totalPauseSeconds;

      if (activeSession.isPaused && activeSession.lastPauseTime) {
        const lastPause = new Date(activeSession.lastPauseTime).getTime();
        totalPauseSeconds += Math.floor((Date.now() - lastPause) / 1000);
      }

      const totalElapsed = Math.floor((Date.now() - start) / 1000);
      setElapsed(Math.max(0, totalElapsed - totalPauseSeconds));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return {
      h: h.toString().padStart(2, '0'),
      m: m.toString().padStart(2, '0'),
      s: s.toString().padStart(2, '0')
    };
  }, []);

  const time = useMemo(() => formatTime(elapsed), [elapsed, formatTime]);

  const handleStart = () => {
    if (!selectedProject) {
      toast({ title: 'Select a project', description: 'Choose a project to track time for.', variant: 'destructive' });
      return;
    }
    const project = projects.find((p) => p.id === selectedProject);
    if (project) {
      startSession(project.id, project.name);
      toast({ title: 'Session started', description: `Tracking time for ${project.name}` });
    }
  };

  const handleStop = () => {
    stopSession(notes.trim() ? notes : undefined);
    setNotes('');
    toast({ title: 'Session saved', description: 'Your session has been recorded.' });
  };

  return (
    <div className="rounded-[2.5rem] border border-border bg-card shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
      {/* Visual Header */}
      <div className="relative h-48 bg-gradient-to-br from-primary to-accent overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        <AnimatePresence mode="wait">
          {!activeSession ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-10 flex flex-col items-center text-primary-foreground"
            >
              <div className="h-16 w-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
                <Clock className="h-8 w-8" />
              </div>
              <p className="font-black text-xl tracking-tight">Ready to Focus?</p>
              <p className="text-xs opacity-80 uppercase font-black tracking-widest mt-1">Select project to start</p>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-10 flex flex-col items-center text-primary-foreground text-center px-6"
            >
              <div className={cn(
                "h-16 w-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3",
                !activeSession.isPaused && "animate-pulse"
              )}>
                {activeSession.isPaused ? <Pause className="h-8 w-8" /> : <Zap className="h-8 w-8 fill-current" />}
              </div>
              <p className="font-black text-2xl tracking-tight truncate max-w-[200px]">{activeSession.projectName}</p>
              <p className="text-xs opacity-80 uppercase font-black tracking-widest mt-1">
                {activeSession.isPaused ? 'On Break' : 'Focus Mode Active'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Timer Display */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center -mt-12 bg-card rounded-t-[3rem] shadow-[0_-10px_20px_rgba(0,0,0,0.05)] relative z-20">
        <div className="flex items-center gap-2 mb-10">
          <div className="flex flex-col items-center">
            <span className="text-6xl font-black font-heading tracking-tighter tabular-nums">{time.h}</span>
            <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Hrs</span>
          </div>
          <span className="text-5xl font-black mb-4">:</span>
          <div className="flex flex-col items-center">
            <span className="text-6xl font-black font-heading tracking-tighter tabular-nums text-primary">{time.m}</span>
            <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Min</span>
          </div>
          <span className="text-5xl font-black mb-4">:</span>
          <div className="flex flex-col items-center">
            <span className="text-6xl font-black font-heading tracking-tighter tabular-nums">{time.s}</span>
            <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Sec</span>
          </div>
        </div>

        {/* Controls */}
        <AnimatePresence mode="wait">
          {!activeSession ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full space-y-4"
            >
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="w-full pl-10 h-14 rounded-2xl border-2 focus:ring-primary/20 bg-muted/30">
                    <SelectValue placeholder="Which project?" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl shadow-xl">
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleStart} size="lg" className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg gap-3 shadow-lg shadow-primary/20 group">
                <Play className="h-6 w-6 group-hover:scale-110 transition-transform" />
                START SPRINT
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="tracking"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full space-y-6"
            >
              <div className="relative group">
                <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What are you accomplishing?"
                  className="w-full h-24 rounded-2xl border-2 border-muted bg-muted/30 pl-11 pr-4 py-4 text-sm font-medium focus:border-primary/50 outline-none transition-all resize-none"
                  maxLength={200}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={activeSession.isPaused ? resumeSession : pauseSession}
                  variant="outline"
                  className={cn(
                    "flex-1 h-16 rounded-2xl border-2 font-black text-sm uppercase tracking-widest transition-all",
                    activeSession.isPaused ? "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10" : "hover:bg-muted"
                  )}
                >
                  {activeSession.isPaused ? (
                    <><RefreshCcw className="h-5 w-5 mr-3 animate-spin duration-1000" /> RESUME</>
                  ) : (
                    <><Pause className="h-5 w-5 mr-3" /> BREAK</>
                  )}
                </Button>
                <Button
                  onClick={handleStop}
                  className="flex-1 h-16 rounded-2xl bg-destructive hover:bg-destructive/90 text-destructive-foreground font-black text-sm uppercase tracking-widest shadow-lg shadow-destructive/10"
                >
                  <Square className="h-5 w-5 mr-3" /> STOP
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mini Insight at bottom */}
      {!activeSession && (
        <div className="p-4 bg-muted/30 border-t border-border flex items-center gap-3">
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Don't forget to break every 50 minutes for peak focus.
          </p>
        </div>
      )}
    </div>
  );
};

export default SessionTimer;
