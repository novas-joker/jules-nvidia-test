"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { MessageSquare, Plus, Settings, Search, Moon, Sun } from "lucide-react";
import { useChatStore } from "@/store/use-chat-store";
import { useUIStore } from "@/store/use-ui-store";
import { v4 as uuidv4 } from "uuid";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { chats, setCurrentChatId, addChat } = useChatStore();
  const { theme, setTheme } = useUIStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

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
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search chats..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={handleNewChat}>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Chat</span>
          </CommandItem>
          <CommandItem onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            <span>Toggle Theme</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        {chats.length > 0 && (
          <CommandGroup heading="Recent Chats">
            {chats.map((chat) => (
              <CommandItem
                key={chat.id}
                onSelect={() => {
                  setCurrentChatId(chat.id);
                  setOpen(false);
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>{chat.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
