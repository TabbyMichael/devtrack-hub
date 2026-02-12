import { useState, useEffect } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Edit2, Palette, Trophy } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/types';

const colors = [
    'hsl(199, 89%, 48%)',
    'hsl(152, 60%, 48%)',
    'hsl(280, 65%, 60%)',
    'hsl(35, 92%, 60%)',
    'hsl(340, 75%, 55%)',
    'hsl(170, 70%, 45%)',
];

interface ProjectEditModalProps {
    project: Project;
}

const ProjectEditModal = ({ project }: ProjectEditModalProps) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description);
    const [color, setColor] = useState(project.color);
    const [priority, setPriority] = useState(project.priority);
    const updateProject = useProjectStore((s) => s.updateProject);
    const { toast } = useToast();

    useEffect(() => {
        if (open) {
            setName(project.name);
            setDescription(project.description);
            setColor(project.color);
            setPriority(project.priority);
        }
    }, [open, project]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast({ title: 'Error', description: 'Project name is required.', variant: 'destructive' });
            return;
        }
        updateProject(project.id, {
            name: name.trim(),
            description: description.trim(),
            color,
            priority
        });
        toast({ title: 'Project updated', description: `${name} has been updated.` });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:bg-primary/5">
                    <Edit2 className="h-4 w-4" />
                    Edit Project
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-card glassmorphism border-primary/10">
                <DialogHeader>
                    <DialogTitle className="font-heading text-2xl font-black italic tracking-tight">Edit Project</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Project Name</Label>
                        <Input
                            id="edit-name"
                            placeholder="Project Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-background/50 border-border h-12 text-lg font-bold"
                            maxLength={50}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-desc" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
                        <Textarea
                            id="edit-desc"
                            placeholder="What are we building?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-background/50 border-border min-h-[100px]"
                            maxLength={200}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Trophy className="h-3 w-3" /> Priority
                            </Label>
                            <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                                <SelectTrigger className="bg-background/50 border-border h-12 font-bold">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent className="glassmorphism">
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Palette className="h-3 w-3" /> Color Scheme
                            </Label>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {colors.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setColor(c)}
                                        className={`h-7 w-7 rounded-full transition-all duration-300 ${color === c ? 'scale-125 ring-2 ring-primary ring-offset-2 ring-offset-card' : 'hover:scale-110'
                                            }`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg shadow-lg shadow-primary/20">
                        Save Changes
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ProjectEditModal;
