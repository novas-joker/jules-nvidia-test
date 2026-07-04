"use client";

import { useUIStore } from "@/store/use-ui-store";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/sidebar/sidebar";
import { CommandPalette } from "./command-palette";
import { Hash, Users, Bell, Pin, Search, Inbox, HelpCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[hsl(var(--discord-main))] font-sans text-[#DBDEE1]">
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Discord Header */}
        <header className="flex h-12 items-center justify-between px-4 border-b border-black/10 shadow-sm shrink-0 bg-[hsl(var(--discord-header))]">
            <div className="flex items-center gap-2 overflow-hidden">
                {!isSidebarOpen && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={toggleSidebar}>
                        <Menu className="h-5 w-5" />
                    </Button>
                )}
                <Hash className="h-5 w-5 text-muted-foreground shrink-0" />
                <h2 className="font-bold text-sm truncate text-foreground">assistant-chat</h2>
                <div className="hidden md:block h-4 w-px bg-white/10 mx-2" />
                <p className="hidden md:block text-xs text-muted-foreground truncate">Premium AI experience at your fingertips</p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
                <div className="hidden md:flex items-center gap-4 text-muted-foreground">
                    <Bell className="h-5 w-5 hover:text-foreground cursor-pointer transition-colors" />
                    <Pin className="h-5 w-5 hover:text-foreground cursor-pointer transition-colors" />
                    <p className="flex items-center gap-2 text-xs font-semibold hover:text-foreground cursor-pointer">
                        <Users className="h-5 w-5" />
                    </p>
                </div>
                <div className="relative hidden lg:block">
                    <input
                        className="bg-black/20 rounded px-2 py-0.5 text-xs w-36 outline-none focus:w-60 transition-all placeholder:text-muted-foreground"
                        placeholder="Search"
                    />
                    <Search className="absolute right-2 top-2 h-3 w-3 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                    <Inbox className="h-5 w-5 hover:text-foreground cursor-pointer transition-colors" />
                    <HelpCircle className="h-5 w-5 hover:text-foreground cursor-pointer transition-colors" />
                </div>
            </div>
        </header>

        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
