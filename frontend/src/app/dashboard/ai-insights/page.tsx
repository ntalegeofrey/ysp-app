'use client';

import { useEffect, useRef, useState } from 'react';

type Message = {
  id: number;
  author: 'ai' | 'user';
  content: string;
};

export default function AIInsightsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      author: 'ai',
      content:
        "Hello! I'm your AI assistant for the Youth Supervisory Platform. I can help you with questions about residents, staff schedules, inventory, incidents, and more. What would you like to know?",
    },
    {
      id: 2,
      author: 'user',
      content: 'How many residents are currently on the unit?',
    },
    {
      id: 3,
      author: 'ai',
      content:
        "Currently, there are 15 residents on the unit as of today's shift. Here's the breakdown:\n• 12 residents in regular housing\n• 2 residents in room confinement\n• 1 resident in medical isolation",
    },
    {
      id: 4,
      author: 'user',
      content: 'Which residents are currently on separation?',
    },
    {
      id: 5,
      author: 'ai',
      content:
        'Currently, 3 residents are on active separation:\n- Resident AB — Classroom 1 separation (Started: Nov 17, 2:30 PM | Reason: Conflict with peer)\n- Resident CD — Conference Room separation (Started: Nov 18, 9:15 AM | Reason: Behavioral incident)\n- Resident EF — Classroom 2 separation (Started: Nov 18, 1:45 PM | Reason: Medical precaution)',
    },
  ]);

  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const nextId = (messages[messages.length - 1]?.id || 0) + 1;
    const userMsg: Message = { id: nextId, author: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Demo AI response; replace with real backend/agent when available.
    const aiId = nextId + 1;
    const aiMsg: Message = {
      id: aiId,
      author: 'ai',
      content:
        "Thanks for your question. This is a demo response. Hook this up to your data sources or AI backend to return real insights.",
    };
    // Slight delay to simulate thinking
    setTimeout(() => setMessages((prev) => [...prev, aiMsg]), 400);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        author: 'ai',
        content:
          "Hello! I'm your AI assistant for the Youth Supervisory Platform. I can help you with questions about residents, staff schedules, inventory, incidents, and more. What would you like to know?",
      },
    ]);
  };

  return (
    <div className="flex flex-col space-y-6">
      <section className="flex-1 bg-white rounded-lg border border-bd flex flex-col">
        <div className="p-6 border-b border-bd">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <i className="fa-solid fa-robot text-primary text-2xl mr-3"></i>
              <div>
                <h3 className="text-lg font-semibold text-font-base">AI Assistant</h3>
                <p className="text-sm text-font-detail">Ask questions about unit data, residents, staff, and operations</p>
              </div>
            </div>
            <button onClick={clearChat} className="bg-error text-white px-4 py-2 rounded-lg hover:bg-error-lighter text-sm">
              <i className="fa-solid fa-trash mr-2"></i>
              Clear Chat
            </button>
          </div>
        </div>

        <div id="chat-messages" ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isAI = m.author === 'ai';
            return (
              <div key={m.id} className={`flex items-start ${isAI ? '' : 'justify-end'}`}>
                {isAI && (
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="fa-solid fa-robot text-white text-sm"></i>
                  </div>
                )}
                <div
                  className={`max-w-3xl border rounded-lg p-4 text-sm ${
                    isAI
                      ? 'bg-primary-lightest border-primary text-font-base'
                      : 'bg-gray-100 border-bd text-font-base'
                  }`}
                >
                  {m.content.split('\n').map((line, idx) => (
                    <p key={idx} className="whitespace-pre-line">
                      {line}
                    </p>
                  ))}
                </div>
                {!isAI && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                    <i className="fa-solid fa-user text-white text-sm"></i>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-6 border-t border-bd">
          <div className="flex space-x-3">
            <div className="flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask about residents, staff, inventory, incidents, or any unit data..."
                className="w-full px-4 py-3 border border-bd rounded-lg focus:outline-none focus:ring-2 ring-primary focus:border-primary text-sm"
              />
            </div>
            <button onClick={sendMessage} className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-light">
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
          <p className="text-xs text-font-detail mt-2">
            <i className="fa-solid fa-info-circle mr-1"></i>
            AI responses are based on real-time unit data. Chat sessions are not saved for privacy.
          </p>
        </div>
      </section>
    </div>
  );
}
