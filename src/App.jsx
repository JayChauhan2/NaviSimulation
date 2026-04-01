import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { initialMessages } from './data/fakeData';

function App() {
  const [activeContact, setActiveContact] = useState(null);
  
  // Manage separate states for group chat and individual chats
  const [groupMessages, setGroupMessages] = useState(initialMessages);
  const [directMessages, setDirectMessages] = useState({});

  const handleSelectContact = (contact) => {
    setActiveContact(contact);
  };

  const currentMessages = activeContact 
    ? (directMessages[activeContact.id] || [])
    : groupMessages;

  const handleSendMessage = (message) => {
    if (activeContact) {
      setDirectMessages(prev => ({
        ...prev,
        [activeContact.id]: [...(prev[activeContact.id] || []), message]
      }));
    } else {
      setGroupMessages(prev => [...prev, message]);
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        activeContact={activeContact} 
        onSelectContact={handleSelectContact} 
      />
      <ChatWindow 
        messages={currentMessages}
        onSendMessage={handleSendMessage}
        activeContact={activeContact}
      />
    </div>
  );
}

export default App;
