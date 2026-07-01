"use client";

import { Message } from "@/types";
import MessageItem from "./message-item";
import { motion } from "framer-motion";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="flex flex-col">
      {messages.map((message, index) => (
        <MessageItem key={message.id} message={message} isLast={index === messages.length - 1} />
      ))}
      {isLoading && messages[messages.length - 1]?.role === 'user' && (
        <div className="flex gap-4 px-4 py-1 animate-pulse">
            <div className="shrink-0 mt-1">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold">AI</div>
            </div>
            <div className="flex flex-col flex-1">
                <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-primary">AI Assistant</span>
                    <span className="bg-primary px-1 rounded-[3px] text-[8px] font-bold text-white uppercase h-3">Bot</span>
                </div>
                <div className="flex space-x-1 mt-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
