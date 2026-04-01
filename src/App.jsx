import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { chatList, initialMessages, groupChatInfo } from './data/fakeData';

function App() {
  const [activeChatId, setActiveChatId] = useState(groupChatInfo.id);
  const [demoMode, setDemoMode] = useState(null); // '1' or '2'
  
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
    <>
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
            demoMode={demoMode}
          />
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
            <p style={{ color: 'var(--text-muted)' }}>Select a chat to start messaging</p>
          </div>
        )}
      </div>

      <div className="mode-selection-container">
        <button 
          className={`mode-btn ${demoMode === '1' ? 'selected' : ''}`} 
          onClick={() => setDemoMode(demoMode === '1' ? null : '1')}
        >
          <span className="mode-num">1</span> Teaching
        </button>
        <button 
          className={`mode-btn ${demoMode === '2' ? 'selected' : ''}`} 
          onClick={() => setDemoMode(demoMode === '2' ? null : '2')}
        >
          <span className="mode-num">2</span> Safety
        </button>
      </div>
    </>
  );
}

export default App;
