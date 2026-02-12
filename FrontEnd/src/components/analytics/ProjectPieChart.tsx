import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ProjectPieChartProps {
  data: { name: string; value: number }[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--warning))',
  'hsl(var(--success))',
  'hsl(var(--destructive))',
];

const ProjectPieChart = ({ data }: ProjectPieChartProps) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-semibold text-lg">Project Distribution</h3>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold bg-muted px-2 py-1 rounded">
          By Hours
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                className="transition-all hover:opacity-80"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              fontSize: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            formatter={(value: number) => [`${value}h`, 'Workload']}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            formatter={(value) => <span className="text-xs font-medium text-muted-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectPieChart;
