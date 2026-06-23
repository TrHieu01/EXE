import { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState(null);

  const toggleChat = () => setIsChatOpen((prev) => !prev);
  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  const startChat = (user) => {
    setActiveChatUser(user);
    setIsChatOpen(true);
  };

  return (
    <ChatContext.Provider value={{ 
      isChatOpen, toggleChat, openChat, closeChat,
      activeChatUser, setActiveChatUser, startChat 
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
