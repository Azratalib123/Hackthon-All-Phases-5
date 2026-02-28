
'use client';

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User, Loader2, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { aiConversationalReply } from "@/ai/flows/ai-conversational-reply-flow";
import { useFirestore, useUser, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, setDoc, query, orderBy, limit, writeBatch } from "firebase/firestore";
import { errorEmitter, FirestorePermissionError } from "@/firebase";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function AssistantPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, "users", user.uid, "aiAssistantMessages"),
      orderBy("timestamp", "asc"),
      limit(50)
    );
  }, [firestore, user]);

  const { data: messages, isLoading: isHistoryLoading } = useCollection(messagesQuery);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const saveMessage = (role: "user" | "AI", content: string) => {
    if (!user || !firestore) return;
    const msgId = doc(collection(firestore, "temp")).id;
    const msgRef = doc(firestore, "users", user.uid, "aiAssistantMessages", msgId);
    const data = {
      id: msgId,
      userId: user.uid,
      content,
      sender: role,
      timestamp: new Date().toISOString(),
    };
    setDoc(msgRef, data).catch(e => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: msgRef.path, operation: 'create', requestResourceData: data }));
    });
  };

  const saveTask = (task: any) => {
    if (!user || !firestore) return;
    const taskId = doc(collection(firestore, "temp")).id;
    const taskRef = doc(firestore, "users", user.uid, "tasks", taskId);
    const data = {
      id: taskId,
      userId: user.uid,
      title: task.title,
      description: task.description || "",
      priority: task.priority || "medium",
      dueDate: task.dueDate || null,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDoc(taskRef, data).catch(e => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ path: taskRef.path, operation: 'create', requestResourceData: data }));
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !user) return;
    const userMsg = input;
    setInput("");
    setIsLoading(true);
    saveMessage("user", userMsg);

    try {
      const result = await aiConversationalReply({
        message: userMsg,
        history: (messages || []).slice(-10).map(m => ({ role: m.sender === "AI" ? "assistant" : "user", content: m.content })),
        currentDate: new Date().toISOString().split('T')[0]
      });

      if (result.error) {
        toast({ variant: "destructive", title: "AI Busy", description: "Rate limit reached. Please wait a moment." });
      } else {
        if (result.reply) saveMessage("AI", result.reply);
        if (result.taskData) saveTask(result.taskData);
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Connection issue. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const resetHistory = async () => {
    if (!user || !firestore || !messages) return;
    const batch = writeBatch(firestore);
    messages.forEach(m => {
      batch.delete(doc(firestore, "users", user.uid, "aiAssistantMessages", m.id));
    });
    await batch.commit();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto w-full animate-fade-in-up">
      <div className="flex items-center justify-between px-2 mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Bot className="text-white w-4 h-4" />
          </div>
          <h1 className="text-lg font-headline font-bold">Assistant</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={resetHistory} className="text-muted-foreground h-8 px-2 font-bold text-[10px]">
          <Trash2 size={12} className="mr-1" /> Reset
        </Button>
      </div>

      <GlassCard className="flex-1 overflow-hidden p-0 flex flex-col bg-card/10 rounded-xl border-white/5">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
          {isHistoryLoading ? (
            <div className="flex items-center justify-center h-full"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : (messages || []).map((msg) => (
            <div key={msg.id} className={cn("flex gap-2 max-w-[90%]", msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto")}>
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-primary")}>
                {msg.sender === "user" ? <User size={14} /> : <Bot size={16} />}
              </div>
              <div className={cn("p-3 rounded-xl text-xs font-medium leading-relaxed", msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-white/5")}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2 mr-auto animate-pulse">
              <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center"><Bot size={16} className="text-primary" /></div>
              <div className="p-3 bg-card rounded-xl border border-white/5"><Loader2 size={12} className="animate-spin" /></div>
            </div>
          )}
        </div>

        <div className="p-4 bg-background/50 border-t border-white/5">
          <div className="relative flex gap-2 items-center max-w-2xl mx-auto w-full">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="How can I help you today?"
              className="h-10 bg-background/80 border-white/10 px-4 text-xs rounded-lg"
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon" className="h-10 w-10 bg-gradient-primary rounded-lg shrink-0">
              <Send size={16} />
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
