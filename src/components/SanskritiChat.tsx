import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import data for context
import clothesData from '../data/clothes.json';
import danceData from '../data/dance.json';
import festivalsData from '../data/festivals.json';
import foodData from '../data/food.json';
import languagesData from '../data/languages.json';
import paintingData from '../data/painting.json';

const ALL_SITE_DATA = JSON.stringify({
  clothes: clothesData,
  dance: danceData,
  festivals: festivalsData,
  food: foodData,
  languages: languagesData,
  painting: paintingData,
});

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'dummy_key');

const SYSTEM_PROMPT = `You are "Sanskriti AI", an expert guide on Indian cultural heritage for our website.
Your goal is to answer user questions accurately, engagingly, and kindly. Keep responses concise but informative.
Here is all the cultural data from our site to base your answers on:
${ALL_SITE_DATA}

Whenever possible, draw from this provided site data to answer questions about clothes, dance, festivals, food, languages, and painting.
Format your responses clearly using markdown if needed, but keep them easy to read in a small chat window.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function SanskritiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Namaste! I am Sanskriti AI. How can I guide you through India's rich cultural heritage today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      console.log("API KEY IS:", import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-3.6-flash',
        systemInstruction: SYSTEM_PROMPT
      });

      const contents = [
        ...messages.filter(m => m.role !== 'assistant' || m.content !== "Namaste! I am Sanskriti AI. How can I guide you through India's rich cultural heritage today?").map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        { role: 'user', parts: [{ text: userMessage }] }
      ];

      const response = await model.generateContent({ contents });
      const text = response.response.text();
      
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Apologies, I encountered an error while trying to respond. Please check API keys or try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const LotusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c-2.5-3-3.5-7-3-10-2.5 1-4.5 4-5 8 2.5-1 5-1.5 8-1.5z" />
      <path d="M12 22c2.5-3 3.5-7 3-10 2.5 1 4.5 4 5 8-2.5-1-5-1.5-8-1.5z" />
      <path d="M12 22c-1.5-5-1-10 0-14 1 4 1.5 9 0 14z" />
    </svg>
  );

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-saffron text-ivory shadow-lg z-50 flex items-center justify-center ${isOpen ? 'hidden' : 'block'}`}
        aria-label="Open Sanskriti AI Chat"
      >
        <LotusIcon />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 md:w-96 bg-ivory rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col border border-saffron/20"
            style={{ maxHeight: '80vh', height: '500px' }}
          >
            <div className="bg-indigo text-ivory p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-saffron"><LotusIcon /></span>
                <h3 className="font-yatra text-xl tracking-wider">Sanskriti AI</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-ivory/80 hover:text-saffron transition-colors"
                aria-label="Close Chat"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                      msg.role === 'user' 
                        ? 'bg-saffron text-ivory rounded-br-none' 
                        : 'bg-white text-indigo shadow-md rounded-bl-none border border-indigo/10'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-indigo shadow-md rounded-2xl rounded-bl-none p-3 border border-indigo/10 flex items-center gap-2">
                    <Loader2 className="animate-spin text-saffron" size={16} />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 bg-white border-t border-indigo/10 shrink-0">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Indian culture..."
                  className="w-full bg-ivory/50 border border-indigo/20 rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron text-indigo placeholder:text-indigo/40"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-saffron text-ivory rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
