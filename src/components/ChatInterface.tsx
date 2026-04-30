import React, { useState } from 'react';
import { Send, Sparkles, User, BrainCircuit, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ title: string; type: string }>;
  thoughtProcess?: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your Multi-Modal Education Tutor. Upload your lecture materials, and I can help you understand complex concepts with hybrid vector and graph-based retrieval.",
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate RAG response
    setTimeout(() => {
      const assistantMsg: Message = {
        role: 'assistant',
        content: `Neural networks are computing systems inspired by the biological neural networks that constitute animal brains. \n\nBased on your **"Deep Learning Basics.pdf"** and the **Knowledge Graph**, the key relationship is between **Backpropagation** and **Gradient Descent**.`,
        thoughtProcess: "Performing hybrid retrieval... Found 3 vector chunks in 'History of AI' and 1 sub-graph relating 'Activation Functions'. Reranking with Cross-Encoder (Score: 0.98)...",
        sources: [
          { title: "Deep Learning Basics.pdf", type: "vector" },
          { title: "Neo4j: Optimization Hierarchy", type: "graph" }
        ]
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-dash-bg">
      <div className="p-3 border-b border-dash-line bg-dash-panel flex items-center justify-between">
        <h2 className="mono-label flex items-center gap-2">
          <BrainCircuit className="w-3.5 h-3.5 text-dash-accent" />
          Multi-Modal Context
        </h2>
        <span className="text-[9px] bg-dash-surface px-1.5 py-0.5 rounded border border-dash-line text-dash-muted">RAG PIPELINE</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={cn(
            "flex flex-col gap-1.5 max-w-[95%]",
            msg.role === 'user' ? "ml-auto" : "mr-auto"
          )}>
            <div className={cn(
              "p-3 rounded-lg text-xs leading-relaxed border relative",
              msg.role === 'user' 
                ? "bg-dash-surface border-dash-accent/30 text-dash-text ml-8" 
                : "bg-dash-panel border-dash-line text-dash-text mr-8"
            )}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
            
            {msg.thoughtProcess && (
              <div className="p-2 bg-[#0A0C10] border border-dash-line rounded ml-2">
                <p className="text-[9px] font-mono text-dash-muted leading-tight">
                  <span className="text-dash-accent font-bold mr-1">REASONING:</span>
                  {msg.thoughtProcess}
                </p>
              </div>
            )}

            {msg.sources && (
              <div className="flex flex-wrap gap-1.5 mt-1 px-1">
                {msg.sources.map((source, si) => (
                  <div key={si} className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-dash-surface border border-dash-line text-[9px] text-dash-muted hover:border-dash-accent transition-colors cursor-default">
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      source.type === 'vector' ? "bg-blue-500" : "bg-orange-500"
                    )} />
                    {source.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2 p-2 border border-dash-line bg-dash-panel w-fit rounded-lg animate-pulse ml-2 text-[10px] text-dash-muted">
            <Sparkles className="w-3.5 h-3.5 text-dash-accent" />
            Generating grounded response...
          </div>
        )}
      </div>

      <div className="p-3 bg-dash-panel border-t border-dash-line">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Query multi-modal knowledge..."
            className="w-full bg-dash-bg border border-dash-line rounded-md py-2.5 pl-4 pr-12 text-[11px] focus:outline-none focus:border-dash-accent transition-colors placeholder:text-dash-muted/40"
          />
          <div className="absolute right-3 top-2.5 flex items-center gap-2">
             <span className="text-[8px] text-dash-muted font-mono bg-dash-surface p-0.5 rounded border border-dash-line">ALT + K</span>
             <button 
               onClick={handleSend}
               className="p-1 bg-dash-accent rounded hover:opacity-90 transition-opacity"
             >
               <Send className="w-3 h-3 text-white" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
