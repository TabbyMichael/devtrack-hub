import { motion } from 'framer-motion';
import {
  Bell,
  Moon,
  Globe,
  Timer,
  Volume2,
  Download,
  Trash2,
  History,
  ShieldCheck,
  Languages,
  Info
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useSettingsStore } from '@/stores/settingsStore';
import { useSessionStore } from '@/stores/sessionStore';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { timer, notifications, display, updateTimer, updateNotifications, updateDisplay, resetSettings } = useSettingsStore();
  const { sessions, clearSessions } = useSessionStore();
  const { toast } = useToast();

  const handleExport = () => {
    const data = JSON.stringify(sessions, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `devtrack-sessions-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: 'Data Exported', description: 'Your session history has been downloaded.' });
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all session history? This cannot be undone.')) {
      if (typeof clearSessions === 'function') {
        clearSessions();
      }
      toast({ title: 'History Cleared', description: 'All session data has been removed.', variant: 'destructive' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto pb-12"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold lg:text-4xl">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your preferences and workspace configuration.</p>
        </div>
        <Button variant="outline" size="sm" onClick={resetSettings} className="gap-2">
          <History className="h-4 w-4" />
          Reset Defaults
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Appearance & Themes */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-semibold text-lg">Appearance</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="dark-mode" className="cursor-pointer font-medium">Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">Toggle between themes</p>
                </div>
              </div>
              <Switch
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="timezone" className="cursor-pointer font-medium">Auto Timezone</Label>
                  <p className="text-xs text-muted-foreground">Sync with system time</p>
                </div>
              </div>
              <Switch
                id="timezone"
                checked={display.autoTimezone}
                onCheckedChange={(checked) => updateDisplay({ autoTimezone: checked })}
              />
            </div>
          </div>
        </div>

        {/* Timer Configuration */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Timer className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-semibold text-lg">Timer (Minutes)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Work</Label>
              <Input
                type="number"
                value={timer.workDuration}
                onChange={(e) => updateTimer({ workDuration: parseInt(e.target.value) || 0 })}
                className="bg-background text-center font-bold h-12 sm:h-auto"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Short</Label>
              <Input
                type="number"
                value={timer.shortBreak}
                onChange={(e) => updateTimer({ shortBreak: parseInt(e.target.value) || 0 })}
                className="bg-background text-center font-bold h-12 sm:h-auto"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Long</Label>
              <Input
                type="number"
                value={timer.longBreak}
                onChange={(e) => updateTimer({ longBreak: parseInt(e.target.value) || 0 })}
                className="bg-background text-center font-bold h-12 sm:h-auto"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Sound */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-semibold text-lg">Notifications</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-enabled" className="cursor-pointer font-medium">Desktop Alerts</Label>
              <Switch
                id="notif-enabled"
                checked={notifications.enabled}
                onCheckedChange={(checked) => updateNotifications({ enabled: checked })}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Label className="font-medium">Sound Alerts</Label>
                </div>
                <Switch
                  checked={notifications.soundEnabled}
                  onCheckedChange={(checked) => updateNotifications({ soundEnabled: checked })}
                />
              </div>
              <div className="px-1">
                <Slider
                  value={[notifications.volume]}
                  onValueChange={([v]) => updateNotifications({ volume: v })}
                  max={100}
                  step={1}
                  disabled={!notifications.soundEnabled}
                  className="my-4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data & Export */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Download className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-semibold text-lg">Data Management</h3>
          </div>

          <div className="space-y-3">
            <Button onClick={handleExport} variant="outline" className="w-full justify-start gap-3 border-dashed h-12">
              <Download className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Export History</p>
                <p className="text-[10px] text-muted-foreground">Download as JSON</p>
              </div>
            </Button>
            <Button onClick={handleClearHistory} variant="outline" className="w-full justify-start gap-3 border-dashed h-12 text-destructive hover:bg-destructive/5 hover:text-destructive">
              <Trash2 className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Clear All Sessions</p>
                <p className="text-[10px] text-destructive/70">Irreversible action</p>
              </div>
            </Button>
          </div>
        </div>

        {/* Localization & Region */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Languages className="h-5 w-5" />
            </div>
            <h3 className="font-heading font-semibold text-lg">Localization</h3>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
            <span className="text-sm font-medium">Primary Language</span>
            <span className="text-sm text-primary font-bold">English (US)</span>
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground flex items-center gap-2">
            <Info className="h-3 w-3" />
            More languages coming soon in Phase 3.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
