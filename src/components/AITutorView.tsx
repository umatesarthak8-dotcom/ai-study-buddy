import React, { useState } from 'react';
import {
  MessageSquareText,
  Send,
  Sparkles,
  Loader2,
  Bot,
  User,
  Lightbulb,
  Copy,
  Check,
  BookOpen,
} from 'lucide-react';

interface AITutorViewProps {
  notes: string;
  hasNotes: boolean;
  onNavigateToNotes: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AITutorView: React.FC<AITutorViewProps> = ({
  notes,
  hasNotes,
  onNavigateToNotes,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello Scholar! I am your AI Engineering Study Tutor. Ask me any conceptual doubt, equation derivation, or physical intuition regarding your active lecture notes.',
      timestamp: 'Just now',
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sampleQuestions = [
    'Explain the physical intuition behind the key formula.',
    'What are the top 3 exam traps examiners test on this topic?',
    'Give a real-world engineering system example of this concept.',
    'Break down the derivation step-by-step for a beginner.',
  ];

  const handleSend = async (questionText?: string) => {
    const q = (questionText || inputQuestion).trim();
    if (!q || isLoading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/tutor-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes, question: q }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get answer');
      }

      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: data.answer || 'No answer generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: `⚠️ Error: ${err.message || 'Could not reach tutor. Please try again.'}`,
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-[#121A2D] rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden">
      {/* Tutor Top Banner */}
      <div className="p-5 border-b border-slate-800 bg-[#0B1020]/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 text-violet-400 flex items-center justify-center shadow-inner">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              AI Engineering Study Tutor
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Instant explanations grounded directly in your active coursework notes
            </p>
          </div>
        </div>

        {!hasNotes && (
          <button
            onClick={onNavigateToNotes}
            className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 font-mono"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Paste notes for custom answers
          </button>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-5 py-3 bg-[#0B1020]/40 border-b border-slate-800/60 overflow-x-auto flex items-center gap-2">
        <span className="text-[11px] font-bold text-violet-300 shrink-0 flex items-center gap-1 font-mono">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Quick Prompts:
        </span>
        {sampleQuestions.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq)}
            className="text-xs bg-[#0B1020] border border-slate-800 hover:border-violet-500/50 text-slate-300 hover:text-white px-3 py-1 rounded-full whitespace-nowrap transition-colors"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
                  isUser
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-none'
                    : 'bg-[#0B1020] border border-slate-800 text-slate-200 rounded-tl-none font-normal'
                }`}
              >
                <div className="whitespace-pre-line">{m.content}</div>

                <div
                  className={`mt-2 pt-2 flex items-center justify-between text-[10px] font-mono ${
                    isUser
                      ? 'text-violet-200 border-t border-violet-400/40'
                      : 'text-slate-500 border-t border-slate-800'
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(m.id, m.content)}
                      className="hover:text-violet-300 flex items-center gap-1 transition-colors"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#0B1020] border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2 font-mono">
              <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
              <span>Grounded reasoning in your notes via Gemini...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input box */}
      <div className="p-4 border-t border-slate-800 bg-[#0B1020]/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2.5"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Ask a technical doubt, explain an equation, or clarify an engineering concept..."
            className="flex-1 px-4 py-3 text-xs sm:text-sm bg-[#121A2D] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || isLoading}
            className="px-5 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI Tutor</span>
          </button>
        </form>
      </div>
    </div>
  );
};
