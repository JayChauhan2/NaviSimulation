import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { currentUser, getSimulatedTimestamp } from '../data/fakeData';
import './ChatWindow.css';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ messages, onSendMessage, currentChat }) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const isGroup = currentChat.isGroup;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    onSendMessage({
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: inputText,
      timestamp: getSimulatedTimestamp()
    });
    
    setInputText('');
  };

  return (
    <main className="chat-window">
      {/* Chat Header */}
      <header className="chat-header">
        <div className="chat-profile">
          <img src={currentChat.avatar} alt={currentChat.name} className="avatar" />
          <div className="chat-meta">
            <h2>{currentChat.name}</h2>
            <span className="status">{currentChat.status}</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="icon-btn"><Video size={20} /></button>
          <button className="icon-btn"><Phone size={20} /></button>
          <div className="divider"></div>
          <button className="icon-btn"><MoreVertical size={20} /></button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="messages-area">
        <div className="messages-container">
          {messages.map((msg, index) => {
            const isMine = msg.senderId === currentUser.id;
            return (
              <MessageBubble 
                key={msg.id} 
                message={msg} 
                isMine={isMine} 
                showSender={!isMine && isGroup && (index === 0 || messages[index - 1].senderId !== msg.senderId)}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <footer className="chat-footer">
        <div className="footer-actions">
          <button className="icon-btn"><Smile size={24} /></button>
          <button className="icon-btn"><Paperclip size={24} /></button>
        </div>
        <form className="input-form" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type a message"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="send-btn" disabled={!inputText.trim()}>
            <Send size={20} />
          </button>
        </form>
      </footer>
    </main>
  );
}
