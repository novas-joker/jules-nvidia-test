"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  language: string;
  value: string;
}

export function CodeBlock({ language, value }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-md overflow-hidden my-2 border border-black/20">
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#2B2D31] border-b border-black/10">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 gap-2 hover:bg-white/5 text-muted-foreground hover:text-foreground"
          onClick={copyToClipboard}
        >
          {isCopied ? (
            <>
              <Check className="h-3 w-3" />
              <span className="text-[10px]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span className="text-[10px]">Copy</span>
            </>
          )}
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '1rem',
          borderRadius: 0,
          fontSize: '0.85rem',
          backgroundColor: '#1E1F22',
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}
