
"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Bell, Clock, Calendar, AlertCircle, Trash2, Loader2, Zap } from "lucide-react";
import { useCollection, useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, doc, writeBatch } from "firebase/firestore";
import { format } from "date-fns";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function RemindersPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const remindersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, "users", user.uid, "reminders"), orderBy("reminderTime", "desc"));
  }, [firestore, user]);

  const { data: reminders, isLoading } = useCollection(remindersQuery);

  const clearHistory = async () => {
    if (!user || !firestore || !reminders) return;
    const batch = writeBatch(firestore);
    reminders.forEach((r) => batch.delete(doc(firestore, "users", user.uid, "reminders", r.id)));
    await batch.commit();
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-headline font-bold">Activity Log</h1>
          <p className="text-muted-foreground text-[11px]">Audit trail of your productivity.</p>
        </div>
        {reminders && reminders.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearHistory} className="h-8 text-[10px] font-bold">
            <Trash2 size={12} className="mr-1" /> Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : reminders && reminders.length > 0 ? (
          reminders.map((reminder) => (
            <GlassCard key={reminder.id} className="p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Zap size={14} />
                  </div>
                  <div>
                    <p className="font-bold text-sm tracking-tight">{reminder.title}</p>
                    <p className="text-[9px] font-medium opacity-40 uppercase tracking-widest mt-0.5">
                      {format(new Date(reminder.reminderTime), "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteDocumentNonBlocking(doc(firestore, "users", user!.uid, "reminders", reminder.id))}
                  className="h-8 w-8 hover:bg-destructive/10"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </GlassCard>
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl">
            <AlertCircle className="w-8 h-8 text-muted-foreground/10 mx-auto mb-2" />
            <p className="text-muted-foreground font-bold text-xs">No activity yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
