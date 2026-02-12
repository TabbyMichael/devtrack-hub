import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', hours: 4.2 },
  { day: 'Tue', hours: 5.8 },
  { day: 'Wed', hours: 3.5 },
  { day: 'Thu', hours: 6.1 },
  { day: 'Fri', hours: 4.7 },
  { day: 'Sat', hours: 2.3 },
  { day: 'Sun', hours: 1.2 },
];

const HoursChart = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Daily Hours This Week
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 16%, 18%)" />
          <XAxis
            dataKey="day"
            stroke="hsl(215, 12%, 50%)"
            tick={{ fontSize: 12, fill: 'hsl(215, 12%, 50%)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="hsl(215, 12%, 50%)"
            tick={{ fontSize: 12, fill: 'hsl(215, 12%, 50%)' }}
            axisLine={false}
            tickLine={false}
            unit="h"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(224, 24%, 10%)',
              border: '1px solid hsl(220, 16%, 18%)',
              borderRadius: '8px',
              color: 'hsl(210, 20%, 92%)',
              fontSize: 13,
            }}
            cursor={{ fill: 'hsl(220, 16%, 14%)' }}
          />
          <Bar dataKey="hours" fill="hsl(199, 89%, 48%)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HoursChart;
