"use client";

import { Message } from "@/types";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { CodeBlock } from "./code-block";
import { MessageActions } from "./message-actions";

interface MessageItemProps {
  message: Message;
  isLast: boolean;
}

export default function MessageItem({ message, isLast }: MessageItemProps) {
  const isAssistant = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "group flex gap-4 px-4 py-1 hover:bg-black/5 transition-colors relative"
      )}
    >
      <div className="shrink-0 mt-1">
        <div
            className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center text-[10px] font-bold border",
            isAssistant ? "bg-primary text-white border-transparent" : "bg-zinc-700 text-white border-transparent"
            )}
        >
            {isAssistant ? "AI" : "U"}
        </div>
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
            <span className={cn(
                "text-sm font-semibold hover:underline cursor-pointer",
                isAssistant ? "text-primary" : "text-foreground"
            )}>
                {isAssistant ? "AI Assistant" : "User"}
            </span>
            <span className="text-[10px] text-muted-foreground">
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isAssistant && (
                <span className="bg-primary px-1 rounded-[3px] text-[8px] font-bold text-white uppercase flex items-center h-3">Bot</span>
            )}
        </div>

        <div className="text-sm text-[#DBDEE1] leading-relaxed">
            <div className="prose dark:prose-invert max-w-none break-words prose-p:my-0 prose-pre:my-2 prose-pre:bg-[#1E1F22] prose-pre:p-3 prose-pre:rounded-md">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code({ node, inline, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                                <CodeBlock
                                    language={match[1]}
                                    value={String(children).replace(/\n$/, '')}
                                    {...props}
                                />
                            ) : (
                                <code className={cn("bg-[#1E1F22] px-1 rounded-[3px] font-mono text-[13px]", className)} {...props}>
                                    {children}
                                </code>
                            );
                        },
                    }}
                >
                    {message.content}
                </ReactMarkdown>
            </div>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-[-10px] z-10">
            <MessageActions content={message.content} />
        </div>
      </div>
    </motion.div>
  );
}
