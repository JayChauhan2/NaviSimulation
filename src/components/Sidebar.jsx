import React from 'react';
import { Search, MoreVertical, Edit } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import './Sidebar.css';
import { currentUser } from '../data/fakeData';

export default function Sidebar({ chatList, activeChatId, onSelectChat, messagesMap, morphingChatId, oldMorphInfo, bumpedChatId, oldBumpedSnippet, typingChatId }) {
  const [listRef] = useAutoAnimate();
  return (
    <aside className="sidebar">
      {/* Header */}
      <header className="sidebar-header">
        <div className="user-profile">
          <h2>Chats</h2>
        </div>
        <div className="header-actions">
          <button className="icon-btn"><Edit size={20} /></button>
          <button className="icon-btn"><MoreVertical size={20} /></button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search or start a new chat" />
        </div>
      </div>

      {/* Contacts List */}
      <ul className="contact-list" ref={listRef}>
        {chatList.map((chat) => {
          const thread = messagesMap && messagesMap[chat.id];
          let latestMsg = thread && thread.length > 0 
            ? thread[thread.length - 1].text 
            : chat.status;
            
          if (typeof latestMsg === 'string') {
            latestMsg = latestMsg.replace(/_/g, '').replace(/\n\n/g, ' - ').replace(/\n/g, ' ');
          }
          
          const latestTime = thread && thread.length > 0
            ? thread[thread.length - 1].timestamp
            : '4:45 PM';

          const isFlagged = morphingChatId === chat.id;
          const isBumped = bumpedChatId === chat.id;

          return (
            <li 
              key={chat.id} 
              className={`contact-item ${activeChatId === chat.id ? 'active' : ''} ${isBumped ? 'flash-update' : ''}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className={`contact-item-inner ${chat.isNew ? 'slide-in-left' : ''}`}>
                <div className="avatar-morph-container sidebar-avatar">
                  {!isFlagged && <img src={chat.avatar} alt={chat.name} className="avatar-lg" />}
                  {isFlagged && oldMorphInfo && <img src={oldMorphInfo.avatar} className="avatar-lg morph-out-avatar" />}
                  {isFlagged && <img src={chat.avatar} className="avatar-lg morph-in-avatar" />}
                </div>

                <div className="contact-info">
                  <div className="contact-meta">
                    <div className="name-morph-container">
                      {!isFlagged && <h4>{chat.name}</h4>}
                      {isFlagged && oldMorphInfo && <h4 className="morph-out-text">{oldMorphInfo.name}</h4>}
                      {isFlagged && <h4 className="morph-in-text">{chat.name}</h4>}
                    </div>
                    <span className="time">{latestTime}</span>
                  </div>
                  
                  <div className="status-snippet-container">
                    {typingChatId === chat.id ? (
                      <p className="status-snippet" style={{ color: 'var(--primary-color)', fontStyle: 'italic', fontWeight: '500' }}>typing...</p>
                    ) : (
                      <>
                        {!isFlagged && !isBumped && <p className="status-snippet">{latestMsg}</p>}
                        {isFlagged && <p className="status-snippet status-morph">{latestMsg}</p>}
                        {isBumped && oldBumpedSnippet && <p className="status-snippet morph-out-text">{oldBumpedSnippet}</p>}
                        {isBumped && <p className="status-snippet morph-in-text">{latestMsg}</p>}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
