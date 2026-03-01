"use client";

import { useEffect, useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User, Send, Loader2, ArrowLeft, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChat } from "@ai-sdk/react";
import Image from "next/image";

interface ChatViewProps {
  initialPrompt?: string;
  onBack?: () => void;
}

const ChatView = ({ initialPrompt, onBack }: ChatViewProps) => {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const isLoading = status === "submitted" || status === "streaming";
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Auto-fire initial prompt if it exists
  useEffect(() => {
    if (initialPrompt && !hasInitialized.current && messages.length === 0) {
      hasInitialized.current = true;
      sendMessage({ text: initialPrompt });
    }
  }, [initialPrompt, messages.length, sendMessage]);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const onSubmit = async () => {
    if (!input.trim()) return;
    const messageToSend = input;
    setInput("");
    await sendMessage({ text: messageToSend });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const lastMessage = messages[messages.length - 1];
  const assistantHasText =
    lastMessage?.role === "assistant" &&
    lastMessage.parts?.some((p) => p.type === "text" && p.text?.length > 0);
  const showTyping =
    (status === "submitted" || status === "streaming") && !assistantHasText;

  return (
    <div className="flex flex-col h-screen bg-white font-sans selection:bg-zinc-200">
      {/* Header */}
      <header className="flex-none bg-white/80 backdrop-blur-md border-b border-zinc-100 sticky top-0 z-10 px-4 sm:px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-500 hover:text-black cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5  cursor-pointer" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-white border border-zinc-200 rounded-full overflow-hidden shadow-sm shrink-0">
              <Image
                src="/avatar.png"
                alt="Josh"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="font-bold text-black tracking-tight flex items-center gap-2">
                Josh Bot
                <span className="flex h-1.5 w-1.5 rounded-full bg-black" />
              </h1>
              <p className="text-xs text-zinc-500 font-medium tracking-wide">
                AI & SaaS Help
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Empty State */}
          {messages.length === 0 && !initialPrompt && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center animate-in fade-in zoom-in-95 duration-700">
              <div className="h-16 w-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6 border border-zinc-100 shadow-sm">
                <Bot className="h-8 w-8 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-black mb-2 tracking-tight">
                Josh Bot
              </h2>
              <p className="text-zinc-500 max-w-md text-sm leading-relaxed">
                Ask me about AI, starting a SaaS business, or anything else on your mind.
              </p>
            </div>
          )}

          {/* Messages */}
          {messages
            .filter(
              (msg) =>
                msg.role === "user" ||
                msg.parts?.some((p) => p.type === "text" && p.text?.length)
            )
            .map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in slide-in-from-bottom-2`}
              >
                <div
                  className={`flex max-w-[85%] sm:max-w-[75%] gap-3 ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className="shrink-0 mt-1">
                    {msg.role === "user" ? (
                      <div className="h-8 w-8 bg-zinc-100 border border-zinc-200 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-zinc-500" />
                      </div>
                    ) : (
                      <div className="relative w-8 h-8 bg-white border border-zinc-200 rounded-full overflow-hidden shadow-sm">
                        <Image
                          src="/avatar.png"
                          alt="Josh"
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div
                    className={`px-5 py-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-black text-white rounded-tr-sm"
                        : "bg-white border border-zinc-200 text-zinc-800 rounded-tl-sm"
                    }`}
                  >
                    {msg.parts?.map((part, i) => {
                      if (part.type === "text") {
                        return (
                          <div
                            key={`${msg.id}-${i}`}
                            className="prose prose-sm prose-zinc max-w-none dark:prose-invert"
                          >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {part.text}
                            </ReactMarkdown>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            ))}

          {/* Loading Indicator */}
          {showTyping && (
            <div className="flex w-full justify-start animate-in fade-in">
              <div className="flex gap-3">
                <div className="relative w-8 h-8 bg-white border border-zinc-200 rounded-full overflow-hidden shadow-sm shrink-0">
                  <Image
                    src="/avatar.png"
                    alt="Josh"
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
                <div className="px-5 py-4 bg-white border border-zinc-200 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-sm">
                  <span className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Input Area */}
      <div className="flex-none p-4 bg-linear-to-t from-white via-white to-transparent pt-6">
        <div className="max-w-3xl mx-auto relative group">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Josh Bot..."
            className="w-full min-h-14 max-h-40 resize-none pr-14 pl-6 py-4 bg-zinc-50 border-zinc-200 focus-visible:ring-black focus-visible:bg-white rounded-3xl text-[15px] transition-all"
            rows={1}
          />
          <Button
            onClick={onSubmit}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="absolute right-2 bottom-2 h-10 w-10 bg-black hover:bg-zinc-800 text-white rounded-full shadow-sm transition-all disabled:opacity-30 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <Send className="h-4 w-4 ml-0.5" />
            )}
          </Button>
        </div>
        <p className="text-center text-xs text-zinc-400 mt-3 font-medium">
          Josh Bot can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
};

export default ChatView;
