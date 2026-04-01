import React from 'react';
import { Search, MoreVertical, Edit } from 'lucide-react';
import './Sidebar.css';
import { contacts, currentUser } from '../data/fakeData';

export default function Sidebar({ activeContact, onSelectContact }) {
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
        {contacts.map((contact) => (
          <li 
            key={contact.id} 
            className={`contact-item ${activeContact?.id === contact.id ? 'active' : ''}`}
            onClick={() => onSelectContact(contact)}
          >
            <img src={contact.avatar} alt={contact.name} className="avatar-lg" />
            <div className="contact-info">
              <div className="contact-meta">
                <h4>{contact.name}</h4>
                <span className="time">12:34 PM</span>
              </div>
              <p className="status-snippet">{contact.status}</p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
