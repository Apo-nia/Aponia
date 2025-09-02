"use client";

import React, { useState, useEffect, useRef } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

interface AiChatBoxProps {
  mode: 'vent' | 'idea';
  title: string;
  placeholder: string;
  colorTheme: 'blue' | 'purple';
}

// hook for outside clicks
const useOutsideClick = (ref: React.RefObject<HTMLDivElement | null>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

const AiChatBox = ({ mode, title, placeholder, colorTheme }: AiChatBoxProps) => {
  const initialMessage: Message = {
      sender: 'ai',
      text: mode === 'vent' ? `Hello. This is a safe space to vent. I'm here to listen.` : `Hello! I'm ready to brainstorm some great ideas with you.`
  };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const chatBoxRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useOutsideClick(chatBoxRef, () => {
    setIsExpanded(false);
  });

  useEffect(() => {
    if (isExpanded) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isExpanded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, mode }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = { text: data.reply, sender: 'ai' };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorAiMessage: Message = { text: "Sorry, I'm having trouble connecting right now.", sender: 'ai' };
      setMessages(prev => [...prev, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const themeStyles = {
    blue: {
      bubble: 'bg-teal-600',
      ring: 'focus:ring-teal-500/30',
      button: 'bg-teal-600 hover:bg-teal-700',
      accent: 'text-teal-400'
    },
    purple: {
      bubble: 'bg-violet-600',
      ring: 'focus:ring-violet-500/30',
      button: 'bg-violet-600 hover:bg-indigo-700',
      accent: 'text-violet-400'
    },
  };

  const currentTheme = themeStyles[colorTheme];

  return (
    <div
      ref={chatBoxRef}
      className={`
        fixed bottom-8 left-1/2 transform -translate-x-1/2
        w-[90%] max-w-2xl
        bg-white/30 backdrop-blur-lg 
        rounded-lg shadow-2xl border border-gray-200/10
        flex flex-col
        transition-all duration-300 ease-out
        z-[9999]
        ${isExpanded ? 'h-[60vh]' : 'h-14'}
      `}
    >
      {isExpanded && (
        <div className="p-3 text-gray-800 font-semibold text-center border-b border-gray-200/30">
          {title}
        </div>
      )}

      {isExpanded && (
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`
                max-w-[80%] p-3 rounded-lg text-white text-sm
                ${msg.sender === 'user' 
                  ? 'bg-gray-500/90 rounded-br-sm' 
                  : `${currentTheme.bubble} rounded-bl-sm`
                }
              `}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className={`p-3 rounded-lg rounded-bl-sm text-white ${currentTheme.bubble}`}>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className={`p-3 ${isExpanded ? 'border-t border-gray-200/30' : ''}`}>
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder={placeholder}
            className={`
              flex-1 px-3 py-2 bg-white/10 text-gray-800 rounded text-sm
              border border-gray-300/10 focus:outline-none 
              focus:ring-2 ${currentTheme.ring} focus:border-transparent
              placeholder-gray-700 transition-all duration-200 backdrop-blur-sm
            `}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className={`
              px-3 py-2 text-white rounded transition-all duration-200 
              ${currentTheme.button} disabled:opacity-50 disabled:cursor-not-allowed
              text-sm font-medium
            `} 
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.896 28.896 0 003.105 2.289z" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiChatBox;

