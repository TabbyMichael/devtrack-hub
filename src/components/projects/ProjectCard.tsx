import type { Project } from '@/types';
import { FolderKanban, Clock, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group block rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg"
    >
      <div className="mb-4 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${project.color}20`, color: project.color }}
        >
          <FolderKanban className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-heading font-semibold group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          <p className="text-xs text-muted-foreground">{project.description}</p>
        </div>
      </div>
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {project.totalHours}h
        </span>
        <span className="flex items-center gap-1">
          <Hash className="h-3.5 w-3.5" />
          {project.sessionsCount} sessions
        </span>
      </div>
    </Link>
  );
};

export default ProjectCard;
