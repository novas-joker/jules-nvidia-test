"use client";

import {
  MoreVertical,
  Trash2,
  Edit2,
  Pin,
  FolderPlus,
  Archive,
  ExternalLink
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/use-chat-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ChatActionsProps {
  chatId: string;
}

export function ChatActions({ chatId }: ChatActionsProps) {
  const { deleteChat, updateChat, chats } = useChatStore();
  const chat = chats.find(c => c.id === chatId);

  const handleDelete = () => {
    deleteChat(chatId);
    toast.success("Chat deleted");
  };

  const handleTogglePin = () => {
    if (chat) {
        updateChat(chatId, { isPinned: !chat.isPinned });
        toast.success(chat.isPinned ? "Chat unpinned" : "Chat pinned");
    }
  };

  const handleArchive = () => {
    updateChat(chatId, { isArchived: true });
    toast.success("Chat archived");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem className="gap-2">
          <Edit2 className="h-3.5 w-3.5" />
          <span>Rename</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTogglePin} className="gap-2">
          <Pin className={cn("h-3.5 w-3.5", chat?.isPinned && "fill-current")} />
          <span>{chat?.isPinned ? "Unpin" : "Pin"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <FolderPlus className="h-3.5 w-3.5" />
          <span>Move to folder</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <ExternalLink className="h-3.5 w-3.5" />
          <span>Share</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleArchive} className="gap-2">
          <Archive className="h-3.5 w-3.5" />
          <span>Archive</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="gap-2 text-destructive focus:text-destructive">
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
