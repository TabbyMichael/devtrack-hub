import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface HoursChartProps {
  data: { day: string; hours: number; fullDate: string }[];
}

const HoursChart = ({ data }: HoursChartProps) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-semibold text-lg">Daily Activity</h3>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold bg-muted px-2 py-1 rounded">
          Hours / Day
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis
            dataKey="day"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
            unit="h"
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--primary) / 0.05)' }}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              fontSize: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
          <Bar dataKey="hours" radius={[6, 6, 0, 0]} barSize={40}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === data.length - 1 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.3)'}
                className="transition-all hover:fill-primary"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HoursChart;
