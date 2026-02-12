import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  accentColor?: string;
  className?: string;
}

const StatsCard = ({ title, value, subtitle, icon: Icon, accentColor, className }: StatsCardProps) => {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/20", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 font-heading text-3xl font-bold">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div
          className={cn('flex h-10 w-10 items-center justify-center rounded-lg')}
          style={{ backgroundColor: accentColor ? `${accentColor}20` : undefined, color: accentColor }}
        >
          <Icon className={cn('h-5 w-5', !accentColor && 'text-primary')} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
