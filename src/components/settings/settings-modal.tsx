"use client";

import { useUIStore } from "@/store/use-ui-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Monitor, Shield, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { theme, setTheme } = useUIStore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#313338] border-none text-[#DBDEE1]">
        <DialogHeader>
          <DialogTitle className="text-white">Settings</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Manage your account settings and preferences.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="appearance" className="flex flex-col md:flex-row gap-6 mt-4 min-h-[400px]">
          <TabsList className="flex flex-col h-auto bg-transparent border-r border-white/5 rounded-none items-start gap-1 p-0 md:w-48">
            <TabsTrigger value="appearance" className="w-full justify-start gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white px-3 py-2 text-muted-foreground">
              <Sun className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="w-full justify-start gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white px-3 py-2 text-muted-foreground">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="w-full justify-start gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white px-3 py-2 text-muted-foreground">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="account" className="w-full justify-start gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white px-3 py-2 text-muted-foreground">
              <User className="h-4 w-4" />
              Account
            </TabsTrigger>
          </TabsList>

          <div className="flex-1">
            <TabsContent value="appearance" className="mt-0 space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white uppercase tracking-wider text-[11px]">Theme</h4>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 border border-white/5 rounded-md hover:bg-white/5 transition-all",
                      theme === 'light' && "bg-white/10 border-primary"
                    )}
                  >
                    <Sun className="h-5 w-5" />
                    <span className="text-xs">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 border border-white/5 rounded-md hover:bg-white/5 transition-all",
                      theme === 'dark' && "bg-white/10 border-primary"
                    )}
                  >
                    <Moon className="h-5 w-5" />
                    <span className="text-xs">Dark</span>
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 border border-white/5 rounded-md hover:bg-white/5 transition-all",
                      theme === 'system' && "bg-white/10 border-primary"
                    )}
                  >
                    <Monitor className="h-5 w-5" />
                    <span className="text-xs">System</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-6">
                <div className="space-y-0.5">
                  <Label className="text-white">Animations</Label>
                  <p className="text-[10px] text-muted-foreground">Reduce UI motion for better accessibility.</p>
                </div>
                <Switch />
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
               <div className="text-sm text-muted-foreground italic">Notification settings are coming soon.</div>
            </TabsContent>

             <TabsContent value="privacy" className="mt-0">
               <div className="text-sm text-muted-foreground italic">Privacy settings are coming soon.</div>
            </TabsContent>

             <TabsContent value="account" className="mt-0">
               <div className="text-sm text-muted-foreground italic">Account settings are managed via Clerk.</div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
