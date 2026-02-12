import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useProjectStore } from '@/stores/projectStore';
import { useSessionStore } from '@/stores/sessionStore';

const COLORS = [
  'hsl(199, 89%, 48%)',
  'hsl(152, 60%, 48%)',
  'hsl(280, 65%, 60%)',
  'hsl(35, 92%, 60%)',
  'hsl(340, 75%, 55%)',
];

const ProjectPieChart = () => {
  const projects = useProjectStore((s) => s.projects);
  const sessions = useSessionStore((s) => s.sessions);

  const hoursByProject: Record<string, number> = {};
  sessions.forEach((s) => {
    hoursByProject[s.projectId] = (hoursByProject[s.projectId] || 0) + s.duration / 60;
  });
  const data = projects.map((p) => ({
    name: p.name,
    value: Number((hoursByProject[p.id] || 0).toFixed(2)),
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Time by Project
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(224, 24%, 10%)',
              border: '1px solid hsl(220, 16%, 18%)',
              borderRadius: '8px',
              color: 'hsl(210, 20%, 92%)',
              fontSize: 13,
            }}
            formatter={(value: number) => [`${value}h`, 'Hours']}
          />
          <Legend
            formatter={(value) => <span style={{ color: 'hsl(215, 12%, 50%)', fontSize: 12 }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectPieChart;
