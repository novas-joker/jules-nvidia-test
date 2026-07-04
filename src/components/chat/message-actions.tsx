"use client";

import {
  Copy,
  RotateCcw,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MessageActionsProps {
  content: string;
  className?: string;
}

export function MessageActions({ content, className }: MessageActionsProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  return (
    <div className={cn(
      "flex items-center bg-[#2B2D31] border border-black/20 rounded-md shadow-lg",
      className
    )}>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={copyToClipboard}>
        <Copy className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
        <Bookmark className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
        <ThumbsUp className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground text-destructive hover:text-destructive">
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
