"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, Clock, ListTodo, TrendingUp, Bot, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCollection, useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { useMemo } from "react";

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const allTasksQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, "users", user.uid, "tasks"));
  }, [firestore, user]);

  const recentTasksQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, "users", user.uid, "tasks"),
      orderBy("updatedAt", "desc"),
      limit(5)
    );
  }, [firestore, user]);

  const { data: allTasks, isLoading: isStatsLoading } = useCollection(allTasksQuery);
  const { data: recentTasks, isLoading: isRecentLoading } = useCollection(recentTasksQuery);

  const stats = useMemo(() => {
    const total = allTasks?.length || 0;
    const completed = allTasks?.filter(t => t.isCompleted).length || 0;
    const pending = total - completed;
    const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;

    return [
      { label: "Total Tasks", value: total.toString(), icon: ListTodo, color: "text-blue-400" },
      { label: "Pending", value: pending.toString(), icon: Clock, color: "text-amber-400" },
      { label: "Completed", value: completed.toString(), icon: CheckCircle2, color: "text-green-400" },
      { label: "Productivity", value: `${productivity}%`, icon: TrendingUp, color: "text-primary" },
    ];
  }, [allTasks]);

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-xl font-headline font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-[10px] md:text-[11px]">Welcome back, <span className="text-foreground font-bold">{user?.displayName || 'User'}</span>.</p>
        </div>
        <Link href="/tasks">
          <Button size="sm" className="bg-gradient-primary text-white h-9 px-4 rounded-lg font-bold text-xs hover:scale-105 transition-all">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> New Task
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, idx) => (
          <GlassCard 
            key={stat.label} 
            className={cn(
              "flex-row items-center gap-3 p-3 md:p-4 opacity-0 animate-fade-in-up",
              idx === 0 ? "stagger-1" : idx === 1 ? "stagger-2" : idx === 2 ? "stagger-3" : "stagger-4"
            )}
          >
            <div className={cn("p-1.5 md:p-2 rounded-lg bg-white/5", stat.color)}>
              <stat.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
            <div>
              <p className="text-[8px] md:text-[9px] text-muted-foreground font-bold uppercase tracking-wider">{stat.label}</p>
              {isStatsLoading ? (
                <Loader2 className="w-3 h-3 animate-spin text-muted-foreground mt-0.5" />
              ) : (
                <h3 className="text-base md:text-lg font-bold font-headline mt-0.5">{stat.value}</h3>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2 p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm md:text-base font-bold font-headline">Recent Activity</h3>
            <Link href="/tasks">
              <Button variant="link" className="text-primary p-0 hover:no-underline font-bold text-[10px] md:text-[11px]">View all</Button>
            </Link>
          </div>
          
          <div className="space-y-2">
            {isRecentLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
            ) : recentTasks && recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-center justify-between p-2.5 md:p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-3.5 h-3.5 md:w-4 md:h-4 rounded border flex items-center justify-center transition-all",
                      task.isCompleted ? "bg-green-500 border-green-500 text-white" : "border-white/20"
                    )}>
                      {task.isCompleted && <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3" />}
                    </div>
                    <div>
                      <p className={cn("font-bold text-xs md:text-sm", task.isCompleted && "text-muted-foreground/50 line-through")}>
                        {task.title}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="px-1.5 py-0 text-[7px] md:text-[8px] font-bold rounded-full">
                    {task.priority}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-xl">
                <p className="text-muted-foreground font-bold text-[10px] md:text-[11px]">No recent tasks.</p>
              </div>
            )}
          </div>
        </GlassCard>

        <GlassCard className="bg-gradient-primary border-0 p-5 md:p-6 text-white relative overflow-hidden min-h-[180px] md:min-h-[220px]">
          <Bot size={80} className="absolute top-0 right-0 p-4 opacity-10" />
          <div className="relative z-10 space-y-3 md:space-y-4 flex flex-col h-full">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xl border border-white/30">
              <Bot className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold font-headline leading-tight">AI Agent</h3>
              <p className="text-white/80 text-[10px] md:text-[11px] font-medium mt-1">
                Ask anything or create tasks with natural language.
              </p>
            </div>
            <div className="mt-auto">
              <Link href="/assistant" className="block w-full">
                <Button className="w-full bg-white text-primary hover:bg-white/90 transition-all font-bold h-9 md:h-10 rounded-lg text-[10px] md:text-xs">
                  Launch Assistant
                </Button>
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
