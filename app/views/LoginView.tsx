"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ChatView from "./ChatView";

const StartChatView = () => {
  const [view, setView] = useState<"start" | "chat">("start");
  const [initialPrompt, setInitialPrompt] = useState("");

  // Simplified array since we just need the prompts for the pills
  const suggestedPrompts = [
    "How do I market my SaaS with zero ad spend?",
    "Explain how LLM search works under the hood.",
    "Which AI model is best for my specific project?",
    "How can I integrate AI into my React apps?",
  ];

  const handleStartSession = (prompt = "") => {
    setInitialPrompt(prompt);
    setView("chat");
  };

  if (view === "chat") {
    return (
      <ChatView initialPrompt={initialPrompt} onBack={() => setView("start")} />
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white font-sans relative overflow-hidden text-black">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-multiply pointer-events-none" />

      <div className="w-full max-w-3xl p-6 relative z-10 animate-in fade-in zoom-in-95 duration-700">
        {/* Main Interface */}
        <div className="flex flex-col items-center text-center space-y-10">
          {/* Header Section */}
          <div className="flex flex-col items-center space-y-5">
            {/* Avatar */}
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-zinc-100 rounded-full blur-sm group-hover:bg-zinc-200 transition-colors duration-500"></div>

              <div className="relative w-24 h-24 bg-white border border-zinc-200 rounded-full shadow-sm overflow-hidden">
                <Image
                  src="/avatar.png"
                  alt="Josh"
                  fill
                  sizes="96px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Status Indicator */}
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-black border-2 border-white rounded-full"></div>
            </div>

            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-black mb-3">
                Josh Bot
              </h1>
              <p className="text-zinc-500 font-medium max-w-md mx-auto text-sm md:text-base leading-relaxed">
                Your technical partner for AI implementation and SaaS
                architecture. Ask a question or start a blank session.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 w-full max-w-2xl">
            {suggestedPrompts.map((prompt, index) => (
              <Button
                key={index}
                onClick={() => handleStartSession(prompt)}
                className="px-5 py-2.5 bg-white border border-zinc-200 hover:border-black text-sm font-medium text-zinc-600 hover:text-white hover:bg-black rounded-full transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
              >
                &quot;{prompt}&quot;
              </Button>
            ))}
          </div>

          <div className="pt-4 w-full max-w-sm">
            <Button
              onClick={() => handleStartSession()}
              className="w-full h-14 bg-black text-white hover:bg-zinc-800 transition-all rounded-full group font-medium tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] active:scale-[0.98]"
            >
              Start Blank Session
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-zinc-400 mt-14 font-semibold tracking-[0.2em] uppercase">
          Josh Bot &bull; V 1.0
        </p>
      </div>
    </div>
  );
};

export default StartChatView;
