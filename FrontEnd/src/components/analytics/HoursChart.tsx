import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSessionStore } from '@/stores/sessionStore';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const HoursChart = () => {
  const sessions = useSessionStore((s) => s.sessions);
  const today = new Date();
  const data = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dateKey = d.toISOString().split('T')[0];
    const hours = sessions
      .filter((s) => s.startTime.startsWith(dateKey))
      .reduce((acc, s) => acc + s.duration, 0) / 60;
    return { day: DAY_LABELS[d.getDay()], hours: Number(hours.toFixed(2)) };
  });
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
