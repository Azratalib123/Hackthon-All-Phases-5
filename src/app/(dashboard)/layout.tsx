"use client";

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Zap, LayoutDashboard, ListTodo, Bot, Bell, Settings, LogOut, Loader2, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ListTodo, label: "Tasks", href: "/tasks" },
  { icon: Bot, label: "Ask Agent", href: "/assistant" },
  { icon: Bell, label: "Activity Log", href: "/reminders" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

function DashboardSidebarContent() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (isMobile) setOpenMobile(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <>
      <SidebarHeader className="p-6 md:p-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => isMobile && setOpenMobile(false)}>
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-gradient-primary flex items-center justify-center teal-glow">
            <Zap className="text-white w-4 h-4 md:w-5 md:h-5" />
          </div>
          <span className="font-headline text-xl md:text-2xl font-bold tracking-tight text-foreground">TaskFlow</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-4 py-2">
        <SidebarMenu className="gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link
                    href={item.href}
                    onClick={() => isMobile && setOpenMobile(false)}
                    className={cn(
                      "flex items-center gap-4 px-4 py-5 rounded-lg transition-all duration-200 group",
                      isActive 
                        ? "bg-primary text-white shadow-md shadow-primary/20" 
                        : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isActive && "text-white")} />
                    <span className="font-bold text-xs md:text-sm tracking-wide">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 md:p-6 space-y-2">
        <button 
          onClick={() => {
            toggleTheme();
            if (isMobile) setOpenMobile(false);
          }}
          className="flex items-center gap-4 px-4 py-3 w-full rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all font-bold text-xs md:text-sm"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 w-full rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all font-bold text-xs md:text-sm group"
        >
          <LogOut className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Logout</span>
        </button>
      </SidebarFooter>
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="border-r border-border bg-sidebar shadow-sm">
          <DashboardSidebarContent />
        </Sidebar>
        
        <main className="flex-1 overflow-auto bg-background flex flex-col">
          {/* Mobile Header with Sidebar Trigger */}
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 md:hidden bg-background/80 backdrop-blur-md sticky top-0 z-30 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2">
              <Zap className="text-primary w-4 h-4" />
              <span className="font-headline font-bold text-base">TaskFlow</span>
            </div>
          </header>

          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
