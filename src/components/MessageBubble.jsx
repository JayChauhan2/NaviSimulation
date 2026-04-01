import React from 'react';
import './MessageBubble.css';
import { chatList } from '../data/fakeData';

export default function MessageBubble({ message, isMine, showSender }) {
  // Find sender name and avatar for group chat logic
  const sender = isMine ? null : chatList.find((c) => c.id === message.senderId);

  return (
    <div className={`message-row ${isMine ? 'mine' : 'theirs'}`}>
      {!isMine && showSender && sender && (
        <img src={sender.avatar} alt={sender.name} className="message-avatar" title={sender.name} />
      )}
      {!isMine && !showSender && <div className="message-avatar-placeholder" />}
      
      <div className={`message-bubble ${isMine ? 'mine' : 'theirs'} ${showSender ? 'show-tail' : ''}`}>
        {!isMine && showSender && sender && (
          <span className="sender-name">{sender.name}</span>
        )}
        <p className="message-text">
          {message.text.split('\n').map((line, i, arr) => (
            <React.Fragment key={i}>
              {line.split(/_(.*?)_/g).map((part, j) => j % 2 === 1 ? <i key={j}>{part}</i> : part)}
              {i < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
        <span className="timestamp">{message.timestamp}</span>
      </div>
    </div>
  );
}
