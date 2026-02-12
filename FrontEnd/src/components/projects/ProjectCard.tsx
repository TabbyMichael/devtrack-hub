import type { Project } from '@/types';
import {
  FolderKanban,
  Clock,
  Hash,
  MoreHorizontal,
  Archive,
  Trash2,
  Pencil,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useProjectStore } from '@/stores/projectStore';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const ProjectCard = ({ project }: { project: Project }) => {
  const { deleteProject, toggleArchive } = useProjectStore();
  const { toast } = useToast();

  const handleArchive = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleArchive(project.id);
    toast({
      title: project.status === 'active' ? 'Project Archived' : 'Project Reactivated',
      description: `${project.name} has been ${project.status === 'active' ? 'archived' : 'moved back to active'}.`,
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete ${project.name}?`)) {
      deleteProject(project.id);
      toast({
        title: 'Project Deleted',
        description: `${project.name} has been removed permanently.`,
        variant: 'destructive',
      });
    }
  };

  const priorityColors = {
    high: 'text-destructive bg-destructive/10 border-destructive/20',
    medium: 'text-warning bg-warning/10 border-warning/20',
    low: 'text-success bg-success/10 border-success/20',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={`/projects/${project.id}`}
        className={cn(
          "group relative flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-xl overflow-hidden",
          project.status === 'archived' && "opacity-75 grayscale-[0.5]"
        )}
      >
        {/* Top Section: Icon & Header & Actions */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110 duration-300 shadow-sm"
            style={{
              backgroundColor: project.color.replace('hsl(', 'hsla(').replace(')', ', 0.15)'),
              color: project.color,
              border: `1px solid ${project.color.replace('hsl(', 'hsla(').replace(')', ', 0.3)')}`
            }}
          >
            <FolderKanban className="h-6 w-6" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.preventDefault()} asChild>
              <button className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-xl border-border">
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Pencil className="h-4 w-4" /> Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleArchive} className="gap-2 cursor-pointer">
                <Archive className="h-4 w-4" /> {project.status === 'active' ? 'Archive' : 'Reactivate'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4" /> Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content Section */}
        <div className="space-y-1 mb-6 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-lg leading-tight group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            {project.status === 'archived' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted border border-border text-muted-foreground font-bold uppercase tracking-wider">
                Archived
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Badges & Tags Row */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className={cn(
            "flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-wider",
            priorityColors[project.priority]
          )}>
            <AlertCircle className="h-3 w-3" />
            {project.priority}
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-border bg-muted/50 text-muted-foreground uppercase tracking-wider">
            <Calendar className="h-3 w-3" />
            Active
          </span>
        </div>

        {/* Bottom Metrics Section */}
        <div className="pt-4 border-t border-border flex items-center justify-between text-muted-foreground">
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-0.5">Focus</span>
              <span className="flex items-center gap-1 text-sm font-bold text-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {project.totalHours}h
              </span>
            </div>
            <div className="flex flex-col border-l border-border pl-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-0.5">Logs</span>
              <span className="flex items-center gap-1 text-sm font-bold text-foreground">
                <Hash className="h-3.5 w-3.5 text-accent" />
                {project.sessionsCount}
              </span>
            </div>
          </div>

          <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 shadow-sm">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
