"use client";

import { Hash, Plus, Settings, MessageSquare, MoreVertical, Search, Menu } from "lucide-react";
import { useUIStore } from "@/store/use-ui-store";
import { useChatStore } from "@/store/use-chat-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import UserProfile from "./user-profile";
import { ChatActions } from "./chat-actions";
import { SettingsModal } from "../settings/settings-modal";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const { chats, currentChatId, setCurrentChatId, addChat } = useChatStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleNewChat = () => {
    const id = uuidv4();
    addChat({
      id,
      title: "new-chat",
      model: "google/diffusiongemma-26b-a4b-it",
      messages: [],
      isPinned: false,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setCurrentChatId(id);
  };

  const filteredChats = chats.filter(c =>
    !c.isArchived && c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
        <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 240 : 0 }}
        className={cn(
            "relative flex h-full flex-col bg-[hsl(var(--discord-sidebar))] transition-all duration-200 ease-in-out z-20 overflow-hidden",
            !isSidebarOpen && "border-none"
        )}
        >
        <div className="flex h-12 items-center px-4 border-b border-black/10 shadow-sm shrink-0">
            <h1 className="font-bold text-sm truncate flex-1">AI Assistant</h1>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleSidebar}>
                <Menu className="h-4 w-4" />
            </Button>
        </div>

        <div className="p-3">
            <Button onClick={handleNewChat} className="w-full justify-start gap-2 h-9 bg-primary hover:bg-primary/90 text-white font-medium text-xs">
                <Plus className="h-4 w-4" />
                New Chat
            </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 px-2 scrollbar-thin scrollbar-thumb-black/20">
            <div className="space-y-0.5">
                <div className="px-2 py-2 flex items-center justify-between group">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Direct Messages</span>
                    <Plus className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={handleNewChat} />
                </div>
                {filteredChats.length === 0 ? (
                    <div className="px-2 py-2 text-[10px] text-muted-foreground italic">No conversations</div>
                ) : (
                    filteredChats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setCurrentChatId(chat.id)}
                            className={cn(
                                "group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors",
                                currentChatId === chat.id
                                    ? "bg-[hsl(var(--accent))] text-white"
                                    : "text-muted-foreground hover:bg-[hsl(var(--accent))/50] hover:text-foreground"
                            )}
                        >
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                <Hash className="h-4 w-4" />
                            </div>
                            <span className="flex-1 truncate text-sm font-medium">
                                {chat.title.toLowerCase().replace(/\s+/g, '-')}
                            </span>
                            <ChatActions chatId={chat.id} />
                        </div>
                    ))
                )}
            </div>
        </div>

        <div className="mt-auto bg-black/10 p-2 flex items-center gap-2 shrink-0">
            <div className="flex-1 overflow-hidden text-white">
                <UserProfile />
            </div>
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsSettingsOpen(true)}
                >
                    <Settings className="h-4 w-4" />
                </Button>
            </div>
        </div>
        </motion.aside>
        <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
}
