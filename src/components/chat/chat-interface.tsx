"use client";

import { useChat } from "@/hooks/use-chat";
import MessageList from "./message-list";
import ChatInput from "./chat-input";
import WelcomeScreen from "./welcome-screen";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatInterface() {
  const { currentChat, sendMessage, isLoading } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  return (
    <div className="flex h-full flex-col relative overflow-hidden bg-[hsl(var(--discord-main))]">
      <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-black/20">
        <div className="py-8">
          <AnimatePresence mode="wait">
            {!currentChat || currentChat.messages.length === 0 ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mx-auto max-w-3xl px-4"
              >
                <WelcomeScreen onSelectPrompt={sendMessage} />
              </motion.div>
            ) : (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pb-32"
              >
                <MessageList messages={currentChat.messages} isLoading={isLoading} />
                <div ref={bottomRef} className="h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[hsl(var(--discord-main))] via-[hsl(var(--discord-main))] to-transparent">
        <div className="mx-auto max-w-3xl">
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
