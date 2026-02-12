import { motion } from 'framer-motion';
import { Bell, Moon, Globe } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Settings = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <h1 className="mb-8 font-heading text-2xl font-bold lg:text-3xl">Settings</h1>

      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 font-heading font-semibold">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="notifications" className="cursor-pointer">
                  Desktop Notifications
                </Label>
              </div>
              <Switch id="notifications" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="dark-mode" className="cursor-pointer">
                  Dark Mode
                </Label>
              </div>
              <Switch id="dark-mode" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="timezone" className="cursor-pointer">
                  Auto Timezone
                </Label>
              </div>
              <Switch id="timezone" defaultChecked />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-2 font-heading font-semibold">Data</h3>
          <p className="text-sm text-muted-foreground">
            Your data is stored locally in this demo. Connect a backend to persist data across sessions.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
