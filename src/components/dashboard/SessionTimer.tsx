import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Square } from 'lucide-react';
import { useSessionStore } from '@/stores/sessionStore';
import { useProjectStore } from '@/stores/projectStore';
import { useToast } from '@/hooks/use-toast';

const SessionTimer = () => {
  const { activeSession, startSession, stopSession } = useSessionStore();
  const projects = useProjectStore((s) => s.projects);
  const [selectedProject, setSelectedProject] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!activeSession) {
      setElapsed(0);
      return;
    }
    const interval = setInterval(() => {
      const start = new Date(activeSession.startTime).getTime();
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

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
    stopSession();
    toast({ title: 'Session saved', description: 'Your session has been recorded.' });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Session Timer
      </h3>

      <div className="mb-6 text-center">
        <p
          className={`font-heading text-5xl font-bold tabular-nums ${
            activeSession ? 'text-primary animate-pulse-glow' : 'text-foreground'
          }`}
        >
          {formatTime(elapsed)}
        </p>
        {activeSession && (
          <p className="mt-2 text-sm text-muted-foreground">
            Working on <span className="text-primary">{activeSession.projectName}</span>
          </p>
        )}
      </div>

      {!activeSession ? (
        <div className="space-y-3">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleStart} className="w-full gap-2">
            <Play className="h-4 w-4" />
            Start Session
          </Button>
        </div>
      ) : (
        <Button onClick={handleStop} variant="destructive" className="w-full gap-2">
          <Square className="h-4 w-4" />
          Stop Session
        </Button>
      )}
    </div>
  );
};

export default SessionTimer;
