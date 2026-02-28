"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User, Bell, Shield, Moon, Sun, Globe, LogOut, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/theme-provider";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Logout Error", description: error.message });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-headline font-bold text-gradient mb-1">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <GlassCard className="space-y-6 p-6">
            <div className="flex items-center gap-4 pb-6 border-b border-border">
              <Avatar className="h-16 w-16 border-2 border-primary/20 ring-2 ring-primary/10">
                <AvatarImage src={`https://picsum.photos/seed/${user?.uid || '1'}/200`} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <h3 className="text-xl font-bold font-headline">{user?.displayName || "User"}</h3>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 bg-green-500/10 text-green-500 rounded-full font-medium border border-green-500/20">
                    <Check size={10} /> Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/50 hover:bg-muted/80 transition-all">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    {theme === "dark" ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    Theme Mode
                  </h4>
                  <p className="text-[10px] text-muted-foreground">Dark vs Light experience.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {theme === "dark" ? "Dark" : "Light"}
                  </span>
                  <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/50 hover:bg-muted/80 transition-all">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" /> Notifications
                  </h4>
                  <p className="text-[10px] text-muted-foreground">Receive real-time alerts.</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/50 hover:bg-muted/80 transition-all">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" /> Cloud Sync
                  </h4>
                  <p className="text-[10px] text-muted-foreground">Automatic device syncing.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="space-y-4 p-6">
            <h3 className="text-lg font-bold font-headline flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Security
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button variant="outline" className="h-10 rounded-xl justify-start border-border bg-background hover:bg-muted font-bold text-xs">
                Update Password
              </Button>
              <Button variant="outline" className="h-10 rounded-xl justify-start border-border bg-background hover:bg-muted font-bold text-xs text-destructive hover:text-destructive">
                Deactivate
              </Button>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-4">
          <GlassCard className="bg-gradient-primary border-0 p-6 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-105 transition-transform duration-500">
              <Shield size={100} />
            </div>
            <div className="relative z-10 space-y-3">
              <h3 className="text-lg font-bold font-headline">Go Pro</h3>
              <p className="text-white/90 text-[10px] leading-relaxed">Advanced AI insights and unlimited workflows.</p>
              <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold h-10 rounded-lg text-sm">
                Upgrade
              </Button>
            </div>
          </GlassCard>
          
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full justify-start text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all h-12 rounded-xl px-4 group"
          >
            <LogOut className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
            <span className="font-bold text-sm">Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
}