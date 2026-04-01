import React from 'react';
import { Search, MoreVertical, Edit } from 'lucide-react';
import './Sidebar.css';
import { currentUser } from '../data/fakeData';

export default function Sidebar({ chatList, activeChatId, onSelectChat }) {
  return (
    <aside className="sidebar">
      {/* Header */}
      <header className="sidebar-header">
        <div className="user-profile">
          <img src={currentUser.avatar} alt="Me" className="avatar" />
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
      <ul className="contact-list">
        {chatList.map((chat) => (
          <li 
            key={chat.id} 
            className={`contact-item ${activeChatId === chat.id ? 'active' : ''}`}
            onClick={() => onSelectChat(chat.id)}
          >
            <img src={chat.avatar} alt={chat.name} className="avatar-lg" />
            <div className="contact-info">
              <div className="contact-meta">
                <h4>{chat.name}</h4>
                <span className="time">4:45 PM</span>
              </div>
              <p className="status-snippet">{chat.status}</p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
