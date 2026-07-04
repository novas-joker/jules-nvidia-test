"use client";

import { MessageSquare, Zap, Shield, Sparkles, Hash } from "lucide-react";

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
}

const SUGGESTED_PROMPTS = [
  "Explain quantum computing in simple terms",
  "Write a poem about a lonely robot",
  "How do I make a chocolate cake?",
  "Help me plan a trip to Japan"
];

export default function WelcomeScreen({ onSelectPrompt }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-start justify-center min-h-[60vh] text-left space-y-6">
      <div className="h-20 w-20 rounded-full bg-[#41434A] flex items-center justify-center mb-2">
        <Hash className="h-12 w-12 text-muted-foreground" />
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome to #assistant-chat!</h1>
        <p className="text-muted-foreground text-sm">
          This is the start of the #assistant-chat channel. Ask anything to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl pt-4">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelectPrompt(prompt)}
            className="flex flex-col items-start p-4 rounded-md bg-[#2B2D31] hover:bg-[#35373C] transition-colors text-left border-black/10 border"
          >
            <span className="text-sm font-semibold text-foreground">{prompt}</span>
            <span className="text-[11px] text-muted-foreground mt-1">Click to try this prompt</span>
          </button>
        ))}
      </div>

      <div className="pt-8 flex items-center gap-2 text-primary hover:underline cursor-pointer text-xs font-semibold">
        <Sparkles className="h-4 w-4" />
        Customize your experience with Premium
      </div>
    </div>
  );
}
