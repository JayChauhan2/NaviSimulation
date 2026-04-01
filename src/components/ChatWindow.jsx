import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, Paperclip, Smile, AlertTriangle } from 'lucide-react';
import { currentUser, getSimulatedTimestamp } from '../data/fakeData';
import './ChatWindow.css';
import MessageBubble from './MessageBubble';
import naviUpsetImg from '../assets/Navi Upset.png';
import naviHappyImg from '../assets/Navi Happy.png';
import naviConcernedImg from '../assets/Navi Concerned.png';

export default function ChatWindow({ messages, onSendMessage, currentChat, demoMode }) {
  const [inputText, setInputText] = useState('');
  const [showNavi, setShowNavi] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [naviMood, setNaviMood] = useState('upset');
  const [isError, setIsError] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const [replacingText, setReplacingText] = useState('');
  const [isNaviExiting, setIsNaviExiting] = useState(false);
  const [hasReplaced, setHasReplaced] = useState(false);
  const [isJakeTyping, setIsJakeTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const isGroup = currentChat.isGroup;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Add small delay to let CSS padding transition start before scrolling
    setTimeout(scrollToBottom, 50);
  }, [messages, showNavi, showSuggestions, isJakeTyping]);

  useEffect(() => {
    if (demoMode === '2' && currentChat.id === 'unknown_1') {
      setShowNavi(true);
      setNaviMood('concerned');
    } else if (!demoMode) {
      setShowNavi(false);
      setShowSuggestions(false);
    }
  }, [demoMode, currentChat.id]);

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

      // If in teaching mode, have Jake respond after a short delay
      if (demoMode === '1') {
        setTimeout(() => {
          setIsJakeTyping(true);
          setTimeout(() => {
            setIsJakeTyping(false);
            onSendMessage({
              id: Date.now().toString() + 'jake',
              senderId: 'c2', // Jake's ID
              text: "wait really?? bet thats awesome 🔥 ill bring my textbook and we can grind it out after the project",
              timestamp: getSimulatedTimestamp()
            });
          }, 2000); // Jake types for 1.5 seconds
        }, 1200); // 1.2 second pause before he starts typing
      }
      return;
    }

    if (demoMode === '1') {
      // Temporarily trigger the error state + reset animation instead of actually sending
      setIsError(false);
      setTimeout(() => {
        setIsError(true);
      }, 10);

      setShowNavi(true);
      setShowSuggestions(false);
      setNaviMood('upset');
    } else {
      // Send normally if not in Teaching Mode
      onSendMessage({
        id: Date.now().toString(),
        senderId: currentUser.id,
        text: inputText,
        timestamp: getSimulatedTimestamp()
      });
      setInputText('');
    }
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

          {isJakeTyping && (
            <div className="typing-indicator-wrapper">
              <img src="https://ui-avatars.com/api/?name=J&background=random&color=fff&rounded=true&bold=true" alt="Jake" className="avatar message-avatar" style={{ width: '28px', height: '28px' }} />
              <div className="typing-indicator">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Navi Clippy Upset Assistant */}
      {showNavi && (
        <div className={`navi-clippy-container ${isNaviExiting ? 'navi-exiting' : ''}`}>
          <div className={`navi-dialogue ${naviMood === 'concerned' ? 'navi-danger' : ''}`}>
            {naviMood === 'concerned' ? (
              <>
                <div className="navi-danger-header">
                  <AlertTriangle size={20} className="alert-icon" />
                  <strong>PII Request Detected</strong>
                </div>
                <p>I think this person is asking for private information.<br />This is unsafe. Should I alert your Trusted Adult?</p>
                <div className="navi-options">
                  <div className="navi-options-row">
                    <button className="navi-btn danger" onClick={closeNavi}>Alert Trusted Adult</button>
                    <button className="navi-btn ignore" onClick={closeNavi}>I'll handle it</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p>That message might be hurtful.<br />Want help responding?</p>
                <div className="navi-options">
                  <div className="navi-options-row">
                    <button className="navi-btn" onClick={() => { setShowSuggestions(true); setNaviMood('happy'); }}>Respond Politely</button>
                    <button className="navi-btn ignore" onClick={closeNavi}>Ignore</button>
                  </div>
                  <button className="navi-btn" onClick={closeNavi}>Ask An Adult For Help</button>
                </div>
              </>
            )}
          </div>
          <div className="navi-img-container">
            <img
              src={naviUpsetImg}
              alt="Navi Upset"
              className={`navi-img ${naviMood === 'upset' ? 'visible' : 'hidden'}`}
            />
            <img
              src={naviHappyImg}
              alt="Navi Happy"
              className={`navi-img ${naviMood === 'happy' ? 'visible' : 'hidden'}`}
            />
            <img
              src={naviConcernedImg}
              alt="Navi Concerned"
              className={`navi-img ${naviMood === 'concerned' ? 'visible' : 'hidden'}`}
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
