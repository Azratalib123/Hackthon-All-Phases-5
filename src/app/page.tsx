"use client";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ArrowRight, Zap, LayoutDashboard, Bot, Shield, Moon, Sun, CheckCircle, Cpu, Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/theme-provider";

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div className="hero-glow animate-pulse" />
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 hover:scale-105 transition-transform cursor-pointer">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-primary flex items-center justify-center teal-glow">
              <Zap className="text-white w-4 h-4 md:w-6 md:h-6" />
            </div>
            <span className="font-headline text-lg md:text-2xl font-bold tracking-tight text-foreground">TaskFlow <span className="text-gradient">AI</span></span>
          </div>
          <div className="flex items-center gap-2 md:gap-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="rounded-full w-9 h-9 md:w-10 md:h-10 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" className="font-semibold px-4 md:px-6 hover:bg-muted text-foreground/80">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-primary text-white border-0 teal-glow hover:opacity-90 hover:scale-105 transition-all px-4 md:px-8 h-9 md:h-11 rounded-md font-bold shadow-lg text-sm md:text-base">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 md:pt-48 pb-16 md:pb-32 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
            {/* Left Column: Text Content */}
            <div className="flex-1 space-y-8 md:space-y-12 animate-fade-in-up text-center lg:text-left max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] animate-fade-in-up [animation-delay:100ms]">
                <CheckCircle className="w-3 md:w-3.5 h-3 md:h-3.5 fill-current" />
                <span>Redefining Workflow Efficiency</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-headline font-extrabold leading-[1.1] text-foreground animate-fade-in-up [animation-delay:200ms]">
                Your Intelligent Task <br /> <span className="text-gradient">Companion.</span>
              </h1>
              
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed font-medium mx-auto lg:mx-0 max-w-2xl animate-fade-in-up [animation-delay:300ms]">
                Manage tasks, schedule reminders, and chat with AI — all in one powerful workspace designed for professional clarity.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-6 pt-4 animate-fade-in-up [animation-delay:400ms]">
                <Link href="/about" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-12 text-base md:text-lg bg-gradient-primary text-white teal-glow hover:scale-105 transition-all font-bold rounded-xl shadow-2xl">
                    Explore Platform <ArrowRight className="ml-2 md:ml-3 w-4 md:w-5 h-4 md:h-5" />
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-12 text-base md:text-lg border-border bg-background hover:bg-muted hover:scale-105 font-bold rounded-xl transition-all">
                    Member Login
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: The AI Box */}
            <div className="w-full max-w-[300px] md:max-w-[340px] lg:max-w-[380px] animate-float lg:shrink-0">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-cyan-500 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                
                <div className="relative flex flex-col items-center text-center p-8 md:p-10 bg-[#0A192F] rounded-[2.5rem] border border-white/10 shadow-2xl h-[320px] md:h-[400px] justify-center overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
                  </div>

                  <div className="relative mb-6 md:mb-8 p-4 md:p-6 rounded-3xl bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors duration-500">
                    <Bot size={40} className="text-primary md:w-16 md:h-16 animate-pulse" />
                  </div>
                  
                  <h3 className="text-lg md:text-2xl font-headline font-bold text-white mb-2 md:mb-4 tracking-tight">TaskFlow Core</h3>
                  
                  <div className="space-y-1 opacity-70 px-4">
                    <p className="text-[10px] md:text-xs text-blue-100 font-bold uppercase tracking-widest">Context-driven</p>
                    <p className="text-[10px] md:text-xs text-blue-100 font-medium italic">workflow intelligence active</p>
                  </div>

                  <div className="mt-8 md:mt-10 flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                    <span className="text-[10px] text-white/60 uppercase font-bold tracking-widest">Neural Syncing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="max-w-7xl mx-auto mt-32 md:mt-56 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <GlassCard className="space-y-4 md:space-y-6 p-8 md:p-12 group hover:translate-y-[-10px] transition-all duration-500 animate-fade-in-up [animation-delay:500ms]">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <LayoutDashboard className="w-7 h-7 md:w-8 md:h-8" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl md:text-3xl font-bold font-headline">Smart Interface</h3>
              <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
                A high-performance command center for professionals who value precision and minimal friction.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="space-y-4 md:space-y-6 p-8 md:p-12 group hover:translate-y-[-10px] transition-all duration-500 animate-fade-in-up [animation-delay:600ms]">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <Cpu className="w-7 h-7 md:w-8 md:h-8" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl md:text-3xl font-bold font-headline">Neural Engines</h3>
              <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
                Advanced models that translate your natural intent into actionable project milestones.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="space-y-4 md:space-y-6 p-8 md:p-12 group hover:translate-y-[-10px] transition-all duration-500 animate-fade-in-up [animation-delay:700ms]">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <Shield className="w-7 h-7 md:w-8 md:h-8" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl md:text-3xl font-bold font-headline">Secure Segregation</h3>
              <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
                Enterprise-level structural privacy ensures your sensitive workspace data remains strictly confidential.
              </p>
            </div>
          </GlassCard>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-16 md:py-24 border-t border-border/50 bg-secondary/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12">
          <div className="flex flex-col items-center md:items-start gap-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Zap className="text-white w-6 h-6" />
              </div>
              <span className="font-headline font-bold text-2xl">TaskFlow <span className="text-gradient">AI</span></span>
            </div>
            <p className="text-muted-foreground text-sm font-medium text-center md:text-left">
              © 2026 TaskFlow AI. Developed by <span className="text-foreground font-bold italic">Azra Talib</span>
            </p>
          </div>
          
          <div className="flex gap-8 items-center">
            <a 
              href="https://x.com/AzraTalib" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
            >
              <Twitter className="w-5 h-5 md:w-6 md:h-6" />
            </a>
            <a 
              href="https://github.com/Azratalib123" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
            >
              <Github className="w-5 h-5 md:w-6 md:h-6" />
            </a>
            <a 
              href="https://www.linkedin.com/in/azra-talib-45a478323/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
            >
              <Linkedin className="w-5 h-5 md:w-6 md:h-6" />
            </a>
          </div>
          
          <div className="flex gap-8 md:gap-12 text-sm font-bold text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}