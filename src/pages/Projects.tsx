import ProjectCard from '@/components/projects/ProjectCard';
import CreateProjectModal from '@/components/projects/CreateProjectModal';
import { useProjectStore } from '@/stores/projectStore';
import { motion } from 'framer-motion';

const Projects = () => {
  const projects = useProjectStore((s) => s.projects);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold lg:text-3xl">Projects</h1>
          <p className="mt-1 text-muted-foreground">{projects.length} projects tracked</p>
        </div>
        <CreateProjectModal />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </motion.div>
  );
};

export default Projects;
