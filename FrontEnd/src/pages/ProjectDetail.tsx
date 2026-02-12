import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjectStore } from '@/stores/projectStore';
import { useSessionStore } from '@/stores/sessionStore';
import {
  ArrowLeft,
  Clock,
  Hash,
  Calendar,
  Trash2,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  Zap,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ProjectEditModal from '@/components/projects/ProjectEditModal';
import ManualSessionModal from '@/components/projects/ManualSessionModal';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const project = useProjectStore((s) => s.projects.find((p) => p.id === id));
  const { sessions, deleteSession } = useSessionStore();
  const { toast } = useToast();

  const projectSessions = useMemo(() =>
    sessions.filter((s) => s.projectId === id),
    [sessions, id]);

  const totalMinutes = useMemo(() =>
    projectSessions.reduce((acc, s) => acc + s.duration, 0),
    [projectSessions]);

  const totalHours = (totalMinutes / 60).toFixed(1);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <Layout className="h-16 w-16 mb-4 opacity-10" />
        <h2 className="text-xl font-bold text-foreground">Project not found</h2>
        <p className="mt-2">The project you're looking for doesn't exist or was removed.</p>
        <Link to="/projects" className="mt-6">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Workspace
          </Button>
        </Link>
      </div>
    );
  }

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
    toast({ title: 'Session deleted', description: 'The session has been removed from history.' });
  };

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as any } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto space-y-8 pb-12"
    >
      {/* Breadcrumbs & Navigation */}
      <motion.nav variants={item} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
        <Link to="/projects" className="hover:text-primary transition-colors">Projects</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{project.name}</span>
      </motion.nav>

      {/* Header Section */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div
            className="h-16 w-16 md:h-20 md:w-20 rounded-[2rem] flex items-center justify-center text-background shadow-2xl relative"
            style={{ backgroundColor: project.color }}
          >
            <span className="text-3xl font-black italic">{project.name.charAt(0)}</span>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background flex items-center justify-center shadow-md">
              <Badge variant="outline" className={cn(
                "h-4 w-4 p-0 rounded-full border-0",
                project.priority === 'high' ? 'bg-destructive' :
                  project.priority === 'medium' ? 'bg-warning' : 'bg-primary'
              )} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-3xl font-black lg:text-4xl tracking-tight text-foreground">{project.name}</h1>
              <Badge variant="secondary" className="uppercase font-black text-[10px] tracking-tighter h-5">
                {project.status}
              </Badge>
            </div>
            <p className="text-muted-foreground font-medium italic">{project.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ProjectEditModal project={project} />
          <ManualSessionModal project={project} />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DetailStatCard
          icon={<Clock className="h-5 w-5" />}
          label="Investment"
          value={`${totalHours}h`}
          subtitle="Total focus time"
          color="primary"
        />
        <DetailStatCard
          icon={<Hash className="h-5 w-5" />}
          label="Sprints"
          value={String(projectSessions.length)}
          subtitle="Total sessions"
          color="accent"
        />
        <DetailStatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Efficiency"
          value="88%"
          subtitle="Avg focus intensity"
          color="success"
        />
        <DetailStatCard
          icon={<Zap className="h-5 w-5" />}
          label="Active Since"
          value={new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          subtitle="Project initiation"
          color="warning"
        />
      </motion.div>

      {/* Main Content: History */}
      <motion.div variants={item} className="rounded-3xl border border-border bg-card shadow-xl overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
          <h3 className="font-heading font-black uppercase tracking-widest text-sm text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" /> Session History
          </h3>
          <span className="text-xs font-bold text-muted-foreground">{projectSessions.length} recorded entries</span>
        </div>

        <div className="divide-y divide-border">
          <AnimatePresence mode="popLayout">
            {projectSessions.map((session, idx) => (
              <motion.div
                key={session.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-muted/30 transition-colors gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center font-bold text-lg text-primary shadow-sm">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-base leading-none group-hover:text-primary transition-colors">
                      {session.notes || 'No activity notes provided'}
                    </p>
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                      {new Date(session.startTime).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-8">
                  <div className="text-right">
                    <p className="text-lg font-black font-heading tracking-tight">
                      {(session.duration / 60).toFixed(1)}h
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Duration</p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glassmorphism w-40">
                      <DropdownMenuItem className="cursor-pointer font-bold text-xs" onClick={() => {
                        navigator.clipboard.writeText(session.notes || '');
                        toast({ title: 'Copied', description: 'Session notes copied to clipboard.' });
                      }}>
                        Copy Notes
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer font-bold text-xs text-destructive hover:text-destructive focus:text-destructive"
                        onClick={() => handleDeleteSession(session.id)}
                      >
                        Delete Session
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {projectSessions.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-3xl bg-muted flex items-center justify-center">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold">No sessions found</p>
              <p className="text-sm text-muted-foreground mt-1 px-12">This project's history is empty. Start a timer or log a manual session to begin.</p>
            </div>
            <ManualSessionModal project={project} />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// --- Helper Component ---
const DetailStatCard = ({ icon, label, value, subtitle, color }: { icon: any, label: string, value: string, subtitle: string, color: string }) => (
  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md group">
    <div className="flex items-center gap-4 mb-3">
      <div className={cn(
        "p-2.5 rounded-xl transition-colors",
        color === 'primary' ? 'bg-primary/10 text-primary' :
          color === 'accent' ? 'bg-accent/10 text-accent' :
            color === 'success' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
      )}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="font-heading text-xl font-black">{value}</p>
      </div>
    </div>
    <div className="h-1 w-full bg-muted rounded-full overflow-hidden mt-3">
      <div className={cn(
        "h-full transition-all duration-1000",
        color === 'primary' ? 'bg-primary' :
          color === 'accent' ? 'bg-accent' :
            color === 'success' ? 'bg-success' : 'bg-warning'
      )} style={{ width: '65%' }} />
    </div>
    <p className="text-[10px] text-muted-foreground mt-2 font-medium">{subtitle}</p>
  </div>
);

export default ProjectDetail;
