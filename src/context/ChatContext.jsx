import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext({
  content: '',
  setContext: () => {},
  onAction: null,
  setOnAction: () => {}
});

export function ChatProvider({ children }) {
  const [content, setContext] = useState('');
  const [onAction, setOnAction] = useState(null);
  return (
    <ChatContext.Provider value={{ content, setContext, onAction, setOnAction }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChatContext = () => useContext(ChatContext);
