import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Salam! Saya asisten AI Maliyyah. Ada apa yang boleh saya bantu tentang zakat hari ini?",
    },
  ]);
  const [loading, setLoading] = useState(false);

  // Ref untuk memastikan scroll sentiasa di bawah
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll setiap kali ada mesej baru
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      // Pastikan backend FastAPI anda sedang berjalan di port 8000
      const res = await fetch("http://localhost:8000/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
      } else {
        throw new Error("Ralat respons server");
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Maaf, buat masa ini saya tidak dapat menghubungi server. Pastikan Backend anda telah dijalankan.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-80 md:w-96 shadow-2xl border-none rounded-2xl overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header Chat */}
          <CardHeader className="bg-emerald-600 text-white p-4 flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bot size={20} /> Asisten Maliyyah AI
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-emerald-700 text-white border-none h-8 w-8"
            >
              <X size={20} />
            </Button>
          </CardHeader>

          {/* Kandungan Chat */}
          <CardContent className="p-0 bg-white">
            <div
              ref={scrollRef}
              className="h-80 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-emerald-600 text-white rounded-tr-none"
                        : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Chat */}
            <div className="p-3 bg-white border-t flex gap-2">
              <Input
                placeholder="Tanya tentang zakat..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="rounded-xl border-slate-200 focus-visible:ring-emerald-500"
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                size="icon"
                disabled={loading || !input.trim()}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 shrink-0"
              >
                <Send size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Butang Terapung Chatbot */
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-2xl bg-emerald-600 hover:bg-emerald-700 transition-all hover:scale-110 border-none group"
        >
          <MessageCircle
            size={28}
            className="group-hover:rotate-12 transition-transform"
          />
        </Button>
      )}
    </div>
  );
}
