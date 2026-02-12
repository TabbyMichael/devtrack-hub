import { useState, useMemo } from 'react';
import ProjectCard from '@/components/projects/ProjectCard';
import CreateProjectModal from '@/components/projects/CreateProjectModal';
import { useProjectStore } from '@/stores/projectStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SortDesc, SortAsc, LayoutGrid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

const Projects = () => {
  const projects = useProjectStore((s) => s.projects);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'hours' | 'sessions' | 'newest'>('newest');

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || p.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'hours') return b.totalHours - a.totalHours;
        if (sortBy === 'sessions') return b.sessionsCount - a.sessionsCount;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [projects, search, statusFilter, priorityFilter, sortBy]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto pb-12"
    >
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold lg:text-4xl text-foreground">Projects</h1>
          <p className="mt-1 text-muted-foreground">{projects.length} projects tracked in total</p>
        </div>
        <CreateProjectModal />
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border h-11 focus-visible:ring-primary/20"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 w-full sm:w-auto gap-2 bg-card border-border whitespace-nowrap">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuCheckboxItem checked={statusFilter === 'all'} onCheckedChange={() => setStatusFilter('all')}>All Statuses</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={statusFilter === 'active'} onCheckedChange={() => setStatusFilter('active')}>Active</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={statusFilter === 'archived'} onCheckedChange={() => setStatusFilter('archived')}>Archived</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Priority</DropdownMenuLabel>
              <DropdownMenuCheckboxItem checked={priorityFilter === 'all'} onCheckedChange={() => setPriorityFilter('all')}>All Priorities</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={priorityFilter === 'high'} onCheckedChange={() => setPriorityFilter('high')}>High Priority</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={priorityFilter === 'medium'} onCheckedChange={() => setPriorityFilter('medium')}>Medium Priority</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={priorityFilter === 'low'} onCheckedChange={() => setPriorityFilter('low')}>Low Priority</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 w-full sm:w-auto gap-2 bg-card border-border whitespace-nowrap">
                <SortDesc className="h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuItem onClick={() => setSortBy('newest')}>Newest First</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('name')}>Alphabetical</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('hours')}>Focus Time</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('sessions')}>Sessions</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredProjects.length > 0 ? (
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 rounded-3xl border-2 border-dashed border-border bg-muted/20"
          >
            <div className="p-4 rounded-full bg-muted mb-4 text-muted-foreground">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="font-heading text-lg font-semibold">No projects found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search or filters.</p>
            <Button variant="ghost" className="mt-4 text-primary" onClick={() => { setSearch(''); setStatusFilter('all'); setPriorityFilter('all'); }}>
              Clear all filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Projects;
