
"use client";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Zap, LayoutDashboard, ListTodo, Bot, Bell, Shield, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/theme-provider";

export default function AboutPage() {
  const { theme, toggleTheme } = useTheme();

  const pagesInfo = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      description: "Your central productivity hub. It provides high-level statistics of your total tasks, pending items, and completion rates with real-time visual progress trackers.",
      action: "Overview & Analytics"
    },
    {
      title: "Task Manager",
      icon: ListTodo,
      description: "A robust space to organize project milestones. Add new tasks, set priorities (Low to Urgent), and filter through your workload with ease.",
      action: "Strategic Planning"
    },
    {
      title: "AI Assistant",
      icon: Bot,
      description: "The heart of TaskFlow. A conversational agent that understands natural language. Ask it questions, or simply tell it to 'create a task for sketching' and it handles the rest.",
      action: "Intelligent Interaction"
    },
    {
      title: "Activity Log",
      icon: Bell,
      description: "A chronological history of every action you take. It logs task creations, status updates, and AI chat sessions so you never lose track of your journey.",
      action: "Secure Auditing"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background py-20 px-4 md:px-6">
      <div className="hero-glow" />
      
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 animate-fade-in-up">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center text-primary font-bold hover:underline gap-2 mb-4">
              <ArrowLeft size={18} /> Back to Home
            </Link>
            <h1 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tight">
              Inside <span className="text-gradient">TaskFlow AI</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl font-medium">
              TaskFlow AI is a premium productivity workspace designed to harmonize human intent with artificial intelligence.
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center teal-glow shrink-0">
            <Zap className="text-white w-8 h-8" />
          </div>
        </div>

        {/* Mission Section */}
        <GlassCard className="p-8 md:p-12 animate-fade-in-up [animation-delay:100ms] border-primary/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-headline font-bold">What is TaskFlow AI?</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                At its core, TaskFlow AI is more than just a task list. It is an <strong>intelligent assistant</strong> that understands how you work. We built this platform to eliminate friction in task management by allowing you to speak naturally to your data.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-foreground font-semibold">
                  <CheckCircle2 className="text-primary w-5 h-5" /> <span>Unified Workspace</span>
                </div>
                <div className="flex items-center gap-3 text-foreground font-semibold">
                  <CheckCircle2 className="text-primary w-5 h-5" /> <span>Conversational Intent Engine</span>
                </div>
                <div className="flex items-center gap-3 text-foreground font-semibold">
                  <CheckCircle2 className="text-primary w-5 h-5" /> <span>Privacy-Centric Segregation</span>
                </div>
              </div>
            </div>
            <div className="relative group flex justify-center">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative p-10 bg-card rounded-3xl border border-border shadow-2xl flex flex-col items-center text-center">
                    <Shield className="text-primary w-16 h-16 mb-4 animate-pulse" />
                    <h3 className="text-xl font-bold">Enterprise Privacy</h3>
                    <p className="text-xs text-muted-foreground mt-2 font-bold uppercase tracking-widest">Structural Isolation Active</p>
                </div>
            </div>
          </div>
        </GlassCard>

        {/* Pages Breakdown */}
        <div className="space-y-8 animate-fade-in-up [animation-delay:200ms]">
          <h2 className="text-3xl font-headline font-bold text-center">Core Modules & Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pagesInfo.map((page, idx) => (
              <GlassCard key={idx} className="group hover:border-primary/30 transition-all duration-500 p-8 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors">
                    <page.icon size={24} />
                  </div>
                  <h3 className="text-2xl font-bold font-headline">{page.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {page.description}
                </p>
                <div className="pt-4 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">{page.action}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Closing CTA */}
        <div className="text-center space-y-8 py-10 animate-fade-in-up [animation-delay:300ms]">
          <h3 className="text-3xl font-headline font-bold">Ready to amplify your output?</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="h-14 px-10 bg-gradient-primary text-white teal-glow font-bold rounded-xl text-lg shadow-2xl">
                Get Started Now
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-14 px-10 border-border bg-background hover:bg-muted font-bold rounded-xl text-lg">
                Member Login
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-32 pt-12 border-t border-border/50 text-center space-y-4 opacity-60">
        <div className="flex items-center justify-center gap-2">
            <Zap className="text-primary w-5 h-5" />
            <span className="font-headline font-bold">TaskFlow AI</span>
        </div>
        <p className="text-sm font-medium">© 2026 The Future of Professional Workflow</p>
      </footer>
    </div>
  );
}
