'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Howdy! I\'m Bernie, your friendly Boerne AI mascot! 👋\n\nI know everything about our beautiful Hill Country town (and yes, it\'s "BURN-ee" like Bernie Sanders, not "BURN" like a fire! 😄). Ask me about our parks, restaurants, trails, events, local businesses, or anything else Boerne-related!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again!' 
        }]);
      }
    } catch {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I couldn\'t connect to my brain right now. Please try again!' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-boerne-gold max-w-2xl mx-auto">
      <div className="p-4 border-b border-boerne-gold bg-gradient-to-r from-boerne-navy to-boerne-light-blue">
        <h3 className="text-lg font-semibold text-boerne-white">Chat with Bernie 🤠</h3>
        <p className="text-sm text-boerne-light-gray">Your friendly Boerne AI mascot!</p>
      </div>
      
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-boerne-navy text-boerne-white'
                  : 'bg-boerne-light-gray text-boerne-dark-gray'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-boerne-light-gray text-boerne-dark-gray max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-boerne-gold rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-boerne-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-boerne-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-boerne-gold">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Bernie about Boerne..."
            className="flex-1 px-3 py-2 border border-boerne-light-blue rounded-md focus:outline-none focus:ring-2 focus:ring-boerne-gold focus:border-boerne-gold"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-boerne-gold text-boerne-navy font-semibold rounded-md hover:bg-boerne-gold-alt focus:outline-none focus:ring-2 focus:ring-boerne-gold focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-boerne-dark-gray mt-2">
          Bernie only knows about Boerne, Texas. Ask about local parks, restaurants, events, and more!
        </p>
      </div>
    </div>
  );
}