import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Clock, Calendar, MessageSquare } from 'lucide-react';
import { useSessionStore } from '@/stores/sessionStore';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/types';

interface ManualSessionModalProps {
    project: Project;
}

const ManualSessionModal = ({ project }: ManualSessionModalProps) => {
    const [open, setOpen] = useState(false);
    const [duration, setDuration] = useState('60'); // Minutes
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const addManualSession = useSessionStore((s) => s.addManualSession);
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const durationNum = parseInt(duration);
        if (isNaN(durationNum) || durationNum <= 0) {
            toast({ title: 'Invalid duration', description: 'Please enter a valid number of minutes.', variant: 'destructive' });
            return;
        }

        const sessionDate = new Date(date);
        const now = new Date();
        sessionDate.setHours(now.getHours(), now.getMinutes());

        addManualSession({
            projectId: project.id,
            projectName: project.name,
            startTime: sessionDate.toISOString(),
            endTime: new Date(sessionDate.getTime() + durationNum * 60000).toISOString(),
            duration: durationNum,
            notes: notes.trim()
        });

        toast({ title: 'Session added', description: `Successfully logged ${durationNum} minutes for ${project.name}.` });
        setDuration('60');
        setNotes('');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                    <Plus className="h-4 w-4" />
                    Add Session
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-card glassmorphism border-primary/10 max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-heading text-2xl font-black italic tracking-tight">Manual Log</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Clock className="h-3 w-3" /> Duration (min)
                            </Label>
                            <Input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="bg-background/50 border-border h-12 font-bold text-lg"
                                min="1"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Calendar className="h-3 w-3" /> Date
                            </Label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="bg-background/50 border-border h-12 font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <MessageSquare className="h-3 w-3" /> Notes & Achievements
                        </Label>
                        <Textarea
                            placeholder="What did you get done?"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="bg-background/50 border-border min-h-[100px]"
                            maxLength={200}
                        />
                    </div>

                    <Button type="submit" className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg shadow-xl shadow-primary/20">
                        Log Session
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ManualSessionModal;
