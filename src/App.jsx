import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { chatList as initialChatList, initialMessages, groupChatInfo, getSimulatedTimestamp, dadContact, dadMessages } from './data/fakeData';
import magnifyingGlass from './assets/MagnifyingGlass.png';
function App() {
  const [activeChatId, setActiveChatId] = useState(groupChatInfo.id);
  const [demoMode, setDemoMode] = useState(null); // '1' or '2'
  const [chats, setChats] = useState(initialChatList);
  
  // Store messages by Chat ID
  const [messagesMap, setMessagesMap] = useState({
    [groupChatInfo.id]: initialMessages,
    [dadContact.id]: dadMessages
  });

  // Global morphing state
  const [morphingChatId, setMorphingChatId] = useState(null);
  const [oldMorphInfo, setOldMorphInfo] = useState(null);
  
  // Bumped contact state (for Dad alerting)
  const [bumpedChatId, setBumpedChatId] = useState(null);
  const [oldBumpedSnippet, setOldBumpedSnippet] = useState(null);
  
  const [typingChatId, setTypingChatId] = useState(null);

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

  const handleAlertTrustedAdult = (suspiciousChatId) => {
    // 1. Flagging contact morph tracking
    const chatToFlag = chats.find(c => c.id === suspiciousChatId);
    if (chatToFlag) {
      setOldMorphInfo({ name: chatToFlag.name, avatar: chatToFlag.avatar });
      setMorphingChatId(suspiciousChatId);
    }
    
    // 2. Bump tracking for Dad's contact update
    const dadMsgs = messagesMap[dadContact.id];
    let oldDadSnippet = dadMsgs && dadMsgs.length > 0 ? dadMsgs[dadMsgs.length - 1].text : '';
    if (oldDadSnippet) {
      oldDadSnippet = oldDadSnippet.replace(/_/g, '').replace(/\n/g, ' - ');
    }
    
    setBumpedChatId(dadContact.id);
    setOldBumpedSnippet(oldDadSnippet);

    setTimeout(() => {
      setMorphingChatId(null);
      setOldMorphInfo(null);
      setBumpedChatId(null);
      setOldBumpedSnippet(null);
    }, 800);

    const suspiciousMsgs = messagesMap[suspiciousChatId];
    const suspiciousMsgText = suspiciousMsgs && suspiciousMsgs.length > 0 
      ? suspiciousMsgs[0].text 
      : 'Hey, what school do you go to? I have a gift for you! 🎁';
    const senderName = chatToFlag ? chatToFlag.name : '+1 (415) 555-0198';

    setChats(prev => {
      const newChats = [...prev];
      const suspiciousIdx = newChats.findIndex(c => c.id === suspiciousChatId);
      const dadIdx = newChats.findIndex(c => c.id === dadContact.id);

      if (suspiciousIdx !== -1) {
        newChats[suspiciousIdx] = {
          ...newChats[suspiciousIdx],
          name: '🚩 Flagged Contact',
          avatar: 'https://ui-avatars.com/api/?name=%E2%9A%A0%EF%B8%8F&background=FF3B30&color=fff&rounded=true&bold=true',
          status: 'Reported to Trusted Adult'
        };
        delete newChats[suspiciousIdx].isNew;
      }

      if (dadIdx !== -1) {
        const dadChat = newChats.splice(dadIdx, 1)[0];
        newChats.unshift(dadChat);
      }

      return newChats;
    });

    setMessagesMap(prev => ({
      ...prev,
      [dadContact.id]: [
        ...(prev[dadContact.id] || []),
        {
          id: Date.now().toString(),
          senderId: 'me',
          text: `🚨 Navi and I just got a sketchy message from an unknown number asking for personal info. We flagged it:\n\n_Contact: ${senderName}_\n_Message: "${suspiciousMsgText}"_`,
          timestamp: getSimulatedTimestamp()
        }
      ]
    }));

    // 4. Dad replies after a delay
    setTimeout(() => {
      setTypingChatId(dadContact.id);
      setTimeout(() => {
        setTypingChatId(null);
        
        // Add Dad's response
        setMessagesMap(prev => ({
          ...prev,
          [dadContact.id]: [
            ...(prev[dadContact.id] || []),
            {
              id: Date.now().toString() + 'reply',
              senderId: dadContact.id,
              text: "good catch kiddo! yup that's definitely a spammer trying to phish for info. I'm really glad you and Navi flagged it. please go ahead and delete that contact right now.",
              timestamp: getSimulatedTimestamp()
            }
          ]
        }));
        
        // Briefly flash Dad's contact again when his message arrives
        const latestMsgText = `🚨 Navi and I just got a sketchy message from an unknown number asking for personal info. We flagged it:\n\n_Contact: ${senderName}_\n_Message: "${suspiciousMsgText}"_`;
        setOldBumpedSnippet(latestMsgText.replace(/_/g, '').replace(/\n\n/g, ' - ').replace(/\n/g, ' '));
        setBumpedChatId(dadContact.id);
        setTimeout(() => {
          setBumpedChatId(null);
          setOldBumpedSnippet(null);
        }, 800);
        
      }, 3000); // Dad types for 3 seconds
    }, 2000); // Dad "reads" it for 2 seconds
  };

  return (
    <>
      <div className="app-container">
        <Sidebar 
          chatList={chats}
          activeChatId={activeChatId} 
          onSelectChat={handleSelectChat} 
          messagesMap={messagesMap}
          morphingChatId={morphingChatId}
          oldMorphInfo={oldMorphInfo}
          bumpedChatId={bumpedChatId}
          oldBumpedSnippet={oldBumpedSnippet}
          typingChatId={typingChatId}
      />
      {currentChat ? (
          <ChatWindow 
            messages={currentMessages}
            onSendMessage={handleSendMessage}
            currentChat={currentChat}
            demoMode={demoMode}
            onAlertTrustedAdult={handleAlertTrustedAdult}
            morphingChatId={morphingChatId}
            oldMorphInfo={oldMorphInfo}
            typingChatId={typingChatId}
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
        <button 
          className={`mode-btn ${demoMode === '3' ? 'selected' : ''}`} 
          onClick={() => setDemoMode(demoMode === '3' ? null : '3')}
        >
          <span className="mode-num">3</span> Scenario 1 SEES
        </button>
      </div>
      
      {demoMode === '3' && (
        <div className="scenario-3-overlay">
          <div className="scenario-3-bubble-container">
            <div className="scenario-3-bubble">
              lol jake you SUCK at science!
            </div>
            <img src={magnifyingGlass} alt="magnifier" className="scenario-3-magnify" />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
