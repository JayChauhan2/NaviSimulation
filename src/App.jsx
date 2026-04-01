import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { chatList, initialMessages, groupChatInfo } from './data/fakeData';

function App() {
  const [activeChatId, setActiveChatId] = useState(groupChatInfo.id);
  
  // Store messages by Chat ID
  const [messagesMap, setMessagesMap] = useState({
    [groupChatInfo.id]: initialMessages
  });

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
  };

  const currentChat = chatList.find((chat) => chat.id === activeChatId);
  const currentMessages = messagesMap[activeChatId] || [];

  const handleSendMessage = (message) => {
    setMessagesMap(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), message]
    }));
  };

  return (
    <div className="app-container">
      <Sidebar 
        chatList={chatList}
        activeChatId={activeChatId} 
        onSelectChat={handleSelectChat} 
      />
      {currentChat ? (
        <ChatWindow 
          messages={currentMessages}
          onSendMessage={handleSendMessage}
          currentChat={currentChat}
        />
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
          <p style={{ color: 'var(--text-muted)' }}>Select a chat to start messaging</p>
        </div>
      )}
    </div>
  );
}

export default App;
