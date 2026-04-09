"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";

export default function Chatbot() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleAsk() {
    if (!question.trim()) return;

    const userMessage = { role: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage.text }),
      });

      const data = await res.json();
      const botText = data.answer || data.error || "No response received";
      setMessages((prev) => [...prev, { role: "bot", text: botText }]);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[82vh] w-full max-w-5xl mx-auto rounded-xl border border-[var(--teal)]/30 overflow-hidden shadow-[0_0_30px_rgba(31,207,207,0.1)]" style={{background: 'rgba(8,11,26,0.97)', backdropFilter: 'blur(28px)'}}>
      {/* Header */}
      <div className="bg-neo-cyan/10 border-b border-neo-cyan/20 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-display font-semibold text-white tracking-widest flex items-center gap-3">
          <Bot className="text-neo-cyan w-6 h-6" /> TruthGuard AI Assist
        </h2>
        <span className="text-xs font-mono text-neo-teal px-3 py-1 bg-neo-teal/10 rounded-full border border-neo-teal/30">TruthGuard AI</span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.length === 0 && (
           <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70">
              <Bot className="text-neo-cyan w-16 h-16 opacity-50" />
              <p className="text-text-mid font-body">I am the TruthGuard AI Assistant.<br/>Ask me anything about incident reporting, digital hygiene, or safety.</p>
           </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-3 ${msg.role === "user" ? "max-w-[80%] flex-row-reverse" : "max-w-[92%] flex-row"}`}>
              {/* Avatar */}
              <div className="flex-shrink-0 mt-1">
                {msg.role === "user" ? (
                   <div className="w-8 h-8 rounded-full bg-neo-cyan/20 border border-neo-cyan flex items-center justify-center">
                     <User className="text-neo-cyan w-4 h-4" />
                   </div>
                ) : (
                   <div className="w-8 h-8 rounded-full bg-neo-purple/20 border border-neo-purple flex items-center justify-center">
                     <Bot className="text-neo-purple w-4 h-4" />
                   </div>
                )}
              </div>
              
              {/* Bubble */}
              <div
                className={`px-5 py-4 rounded-2xl whitespace-pre-wrap text-[15px] leading-[1.8] break-words w-full
                  ${msg.role === "user" 
                    ? "bg-[var(--teal-dim)] border border-[var(--teal)]/30 text-[var(--text)] rounded-tr-none font-serif" 
                    : "bg-[var(--bg3)] border border-[var(--border-gold)]/40 text-[var(--text)] rounded-tl-none shadow-md font-sans"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex w-full justify-start">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-neo-purple/20 border border-neo-purple flex items-center justify-center mt-1">
                <Bot className="text-neo-purple w-4 h-4 animate-pulse" />
              </div>
              <div className="px-5 py-3 rounded-2xl rounded-tl-none bg-surface-2 border border-border-gold/30 text-neo-teal animate-pulse font-mono text-sm flex items-center gap-2">
                Processing logic stream...
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-[var(--teal)]/20" style={{background: 'rgba(13,17,48,1)'}}>
        <div className="relative flex items-center w-full group">
          <input
            ref={inputRef}
            type="text"
            id="chat-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            placeholder="Type your query here..."
            style={{background: 'rgba(8,11,26,1)', color: 'var(--text)'}}
            className="flex-1 border border-[var(--border-gold)]/40 rounded-xl py-3 pl-4 pr-16 font-serif text-[15px] focus:outline-none focus:border-[var(--teal)] focus:shadow-[0_0_15px_rgba(31,207,207,0.2)] transition-all placeholder:text-[var(--text-dim)] relative z-50 pointer-events-auto"
          />
          <button
            onClick={handleAsk}
            disabled={loading || !question.trim()}
            className="absolute right-2 px-3 py-1.5 bg-[var(--teal)]/10 hover:bg-[var(--teal)]/20 border border-[var(--teal)]/30 text-[var(--teal)] rounded-lg transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
