
"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Calendar, CheckCircle2, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useCollection, useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { cn } from "@/lib/utils";

export default function TasksPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("medium");

  const tasksQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, "users", user.uid, "tasks"),
      orderBy("createdAt", "desc")
    );
  }, [firestore, user]);

  const { data: tasks, isLoading } = useCollection(tasksQuery);

  const logActivity = (title: string) => {
    if (!user || !firestore) return;
    const reminderData = {
      userId: user.uid,
      title,
      reminderTime: new Date().toISOString(),
      isDismissed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    addDocumentNonBlocking(collection(firestore, "users", user.uid, "reminders"), reminderData);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !user || !firestore) return;

    const taskData = {
      userId: user.uid,
      title: newTitle,
      description: newDescription,
      priority: newPriority,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addDocumentNonBlocking(collection(firestore, "users", user.uid, "tasks"), taskData);
    logActivity(`Created task: ${newTitle}`);

    setNewTitle("");
    setNewDescription("");
    setIsDialogOpen(false);
  };

  const toggleComplete = (taskId: string, currentStatus: boolean) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, "users", user.uid, "tasks", taskId);
    updateDocumentNonBlocking(docRef, { 
      isCompleted: !currentStatus,
      updatedAt: new Date().toISOString()
    });
  };

  const deleteTask = async (taskId: string) => {
    if (!user || !firestore) return;
    deleteDocumentNonBlocking(doc(firestore, "users", user.uid, "tasks", taskId));
  };

  const filteredTasks = tasks?.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-headline font-bold">My Workspace</h1>
          <p className="text-muted-foreground text-[11px]">Manage and scale your strategic milestones.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gradient-primary text-white h-10 px-4 rounded-lg font-bold text-xs">
              <Plus className="w-3.5 h-3.5 mr-1.5" /> New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10 rounded-xl p-5">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Add New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTask} className="space-y-3 pt-2">
              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold opacity-60">Title</Label>
                <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="h-10 bg-white/5 rounded-lg" required />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold opacity-60">Description</Label>
                <Textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="bg-white/5 rounded-lg text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase font-bold opacity-60">Priority</Label>
                <Select value={newPriority} onValueChange={setNewPriority}>
                  <SelectTrigger className="h-10 bg-white/5 rounded-lg text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full h-10 bg-gradient-primary font-bold rounded-lg text-xs mt-2">Create Task</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" />
          <Input 
            placeholder="Search objectives..." 
            className="pl-9 h-10 bg-white/5 border-white/10 rounded-lg text-xs" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-10 border-white/10 bg-white/5 rounded-lg px-3 font-bold text-xs">
          <Filter className="w-3.5 h-3.5" />
        </Button>
        <Button variant="outline" className="h-10 border-white/10 bg-white/5 rounded-lg px-3 font-bold text-xs">
          <Calendar className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task, idx) => (
            <GlassCard key={task.id} className={cn("p-3 animate-fade-in-up", `stagger-${(idx % 5) + 1}`)}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <button 
                    onClick={() => toggleComplete(task.id, task.isCompleted)}
                    className={cn(
                      "w-5 h-5 rounded border flex items-center justify-center transition-all",
                      task.isCompleted ? "bg-primary border-primary text-primary-foreground" : "border-white/10"
                    )}
                  >
                    {task.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <div className="space-y-0.5">
                    <h3 className={cn("text-sm font-bold", task.isCompleted && "text-muted-foreground/40 line-through")}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest opacity-40">
                      <span>{format(new Date(task.createdAt), "MMM d, h:mm a")}</span>
                      <span>•</span>
                      <span>{task.isCompleted ? "Archive Ready" : "Priority Active"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="px-2 py-0 text-[8px] font-bold rounded-full">
                    {task.priority}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteTask(task.id)}
                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl">
            <AlertCircle className="w-8 h-8 text-muted-foreground/10 mx-auto mb-2" />
            <p className="text-muted-foreground font-bold text-xs">No active tasks found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
