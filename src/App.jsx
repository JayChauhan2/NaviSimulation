import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { chatList as initialChatList, initialMessages, groupChatInfo, getSimulatedTimestamp } from './data/fakeData';

function App() {
  const [activeChatId, setActiveChatId] = useState(groupChatInfo.id);
  const [demoMode, setDemoMode] = useState(null); // '1' or '2'
  const [chats, setChats] = useState(initialChatList);
  
  // Store messages by Chat ID
  const [messagesMap, setMessagesMap] = useState({
    [groupChatInfo.id]: initialMessages
  });

  React.useEffect(() => {
    if (demoMode === '2') {
      const unknownId = 'unknown_1';
      const unknownChat = {
        id: unknownId,
        name: '+1 (415) 555-0198',
        avatar: 'https://ui-avatars.com/api/?name=%3F&background=A0A0A0&color=fff&rounded=true&bold=true',
        status: 'Hey, what school do you go to? I have a gift for you! 🎁',
        isGroup: false,
        isNew: true
      };
      
      setChats(prev => {
        if (!prev.find(c => c.id === unknownId)) {
          return [unknownChat, ...prev];
        }
        return prev;
      });

      setMessagesMap(prev => {
        if (!prev[unknownId]) {
          return {
            ...prev,
            [unknownId]: [{
              id: Date.now().toString(),
              senderId: unknownId,
              text: 'Hey, what school do you go to? I have a gift for you! 🎁',
              timestamp: getSimulatedTimestamp()
            }]
          };
        }
        return prev;
      });
    } else {
      setChats(prev => prev.filter(c => c.id !== 'unknown_1'));
      setActiveChatId(prev => prev === 'unknown_1' ? groupChatInfo.id : prev);
      
      setMessagesMap(prev => {
        const newMap = { ...prev };
        delete newMap['unknown_1'];
        return newMap;
      });
    }
  }, [demoMode]);

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
  };

  const currentChat = chats.find((chat) => chat.id === activeChatId);
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
        chatList={chats}
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
