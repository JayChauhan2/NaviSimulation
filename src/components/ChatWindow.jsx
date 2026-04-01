import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { currentUser, getSimulatedTimestamp } from '../data/fakeData';
import './ChatWindow.css';
import MessageBubble from './MessageBubble';
import naviUpsetImg from '../assets/Navi Upset.png';
import naviHappyImg from '../assets/Navi Happy.png';

export default function ChatWindow({ messages, onSendMessage, currentChat }) {
  const [inputText, setInputText] = useState('');
  const [showNavi, setShowNavi] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const [replacingText, setReplacingText] = useState('');
  const [isNaviExiting, setIsNaviExiting] = useState(false);
  const [hasReplaced, setHasReplaced] = useState(false);
  const messagesEndRef = useRef(null);

  const isGroup = currentChat.isGroup;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Add small delay to let CSS padding transition start before scrolling
    setTimeout(scrollToBottom, 50);
  }, [messages, showNavi, showSuggestions]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    // If the user has accepted a suggestion, send the message for real
    if (hasReplaced) {
      onSendMessage({
        id: Date.now().toString(),
        senderId: currentUser.id,
        text: inputText,
        timestamp: getSimulatedTimestamp()
      });
      setInputText('');
      setHasReplaced(false); // Reset for their next message
      return;
    }

    // Temporarily trigger the error state + reset animation instead of actually sending
    setIsError(false);
    setTimeout(() => {
      setIsError(true);
    }, 10);
    
    setShowNavi(true);
    setShowSuggestions(false);
  };

  const closeNavi = () => {
    setIsNaviExiting(true);
    setTimeout(() => {
      setShowNavi(false);
      setIsNaviExiting(false);
    }, 400); // Wait for the slideDownNavi animation to finish
  };

  const handleApplySuggestion = (suggestion) => {
    setReplacingText(suggestion);
    setIsReplacing(true);
    setShowSuggestions(false);
    closeNavi();

    setTimeout(() => {
      setInputText(suggestion);
      setIsError(false); // remove error styling since it's nice now
      setIsReplacing(false);
      setReplacingText('');
      setHasReplaced(true); // Unlock sending capability
    }, 800); // 800ms correlates with the text slide-up crossfade time
  };

  let extraSpaceClass = '';
  if (showSuggestions) {
    extraSpaceClass = 'has-suggestions';
  } else if (showNavi || isNaviExiting) {
    extraSpaceClass = 'has-navi';
  }

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
        <div className={`messages-container ${extraSpaceClass}`}>
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

      {/* Navi Clippy Upset Assistant */}
      {showNavi && (
        <div className={`navi-clippy-container ${isNaviExiting ? 'navi-exiting' : ''}`}>
          <div className="navi-dialogue">
            <p>That message might be hurtful.<br />Want help responding?</p>
            <div className="navi-options">
              <div className="navi-options-row">
                <button className="navi-btn" onClick={() => setShowSuggestions(true)}>Respond Politely</button>
                <button className="navi-btn ignore" onClick={closeNavi}>Ignore</button>
              </div>
              <button className="navi-btn" onClick={closeNavi}>Ask An Adult For Help</button>
            </div>
          </div>
          <div className="navi-img-container">
            <img 
              src={naviUpsetImg} 
              alt="Navi Upset" 
              className={`navi-img ${showSuggestions ? 'hidden' : 'visible'}`} 
            />
            <img 
              src={naviHappyImg} 
              alt="Navi Happy" 
              className={`navi-img ${showSuggestions ? 'visible' : 'hidden'}`} 
            />
          </div>
        </div>
      )}

      {/* Input Area */}
      <footer className="chat-footer">
        <div className="footer-actions">
          <button className="icon-btn"><Smile size={24} /></button>
          <button className="icon-btn"><Paperclip size={24} /></button>
        </div>
        <form className={`input-form ${isError ? 'error-shake' : ''} ${isReplacing ? 'morph-replacing' : ''}`} onSubmit={handleSend}>
          {/* Suggestions Popup */}
          {showSuggestions && (
            <div className="suggestions-popup">
              <div className="suggestions-header">Try one of these instead:</div>
              <button onClick={() => handleApplySuggestion("jake maybe we can study science together sometime?")}>
                jake maybe we can study science together sometime?
              </button>
              <button onClick={() => handleApplySuggestion("science is super hard tbh, don't worry jake!")}>
                science is super hard tbh, don't worry jake!
              </button>
              <button onClick={() => handleApplySuggestion("haha science is tough jake, we'll get it next time!")}>
                haha science is tough jake, we'll get it next time!
              </button>
            </div>
          )}
          <input
            type="text"
            placeholder="Type a message"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (isError) setIsError(false);
            }}
          />
          {isReplacing && (
            <div className="replace-overlay">
              {replacingText}
            </div>
          )}
          <button type="submit" className="send-btn" disabled={!inputText.trim()}>
            <Send size={20} />
          </button>
        </form>
      </footer>
    </main>
  );
}
