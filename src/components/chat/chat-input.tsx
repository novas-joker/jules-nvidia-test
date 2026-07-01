"use client";

import { useState, useRef, useEffect } from "react";
import { PlusCircle, Gift, Sticker, Smile, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (content: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative group">
        <div className={cn(
            "flex flex-col bg-[#383A40] rounded-lg transition-all",
            isLoading && "opacity-50 pointer-events-none"
        )}>
            <div className="flex items-start p-1 min-h-[44px]">
                <button className="p-2.5 text-muted-foreground hover:text-foreground transition-colors shrink-0">
                    <PlusCircle className="h-6 w-6" />
                </button>
                <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message #assistant-chat"
                    className="flex-1 resize-none bg-transparent py-3 px-2 text-[15px] outline-none max-h-[50vh] text-[#DBDEE1] placeholder:text-muted-foreground/60"
                />
                <div className="flex items-center gap-1.5 p-2 shrink-0">
                    <button className="hidden sm:block p-1 text-muted-foreground hover:text-foreground transition-colors">
                        <Gift className="h-6 w-6" />
                    </button>
                    <button className="hidden sm:block p-1 text-muted-foreground hover:text-foreground transition-colors">
                        <Sticker className="h-6 w-6" />
                    </button>
                    <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                        <Smile className="h-6 w-6" />
                    </button>
                    {input.trim() && (
                         <button
                            onClick={() => handleSubmit()}
                            className="p-1 text-primary hover:text-primary/80 transition-colors"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
        <div className="mt-1 flex justify-between px-1">
             <p className="text-[10px] text-muted-foreground">
                AI Assistant <span className="text-primary hover:underline cursor-pointer">Learn More</span>
            </p>
             <p className={cn(
                 "text-[10px] text-muted-foreground transition-opacity",
                 input.length > 1500 ? "opacity-100" : "opacity-0"
             )}>
                {input.length} / 2000
            </p>
        </div>
    </div>
  );
}
