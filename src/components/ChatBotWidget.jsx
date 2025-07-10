import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { chatCompletion } from '../utils/groqNews';

export default function ChatBotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Bonjour! Comment puis-je vous aider ?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const newMsgs = [...messages, { role: 'user', content: text }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);
    try {
      const reply = await chatCompletion(newMsgs);
      setMessages([...newMsgs, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMsgs, { role: 'assistant', content: "D\u00e9sol\u00e9, une erreur s'est produite." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 p-3 rounded-full bg-brand text-white shadow-lg hover:bg-brand-600"
        aria-label="Chatbot"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-md mx-auto rounded-lg shadow-lg flex flex-col overflow-hidden">
            <header className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-gray-100">SmartBot</h3>
              <button
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-100" />
              </button>
            </header>
            <div className="flex-1 p-3 space-y-2 overflow-y-auto">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={[
                    'p-2 rounded text-sm whitespace-pre-wrap',
                    m.role === 'user'
                      ? 'bg-brand/10 self-end text-right'
                      : 'bg-gray-100 dark:bg-gray-800'
                  ].join(' ')}
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-500">
                  ...
                </div>
              )}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
              className="flex border-t border-gray-200 dark:border-gray-700"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                className="flex-1 p-2 resize-none bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100"
                placeholder="\u00c9crivez votre message..."
              />
              <button type="submit" disabled={loading} className="p-2 text-brand disabled:opacity-40" aria-label="Envoyer">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
