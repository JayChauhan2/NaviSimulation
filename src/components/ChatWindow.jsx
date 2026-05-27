import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, Paperclip, Smile, AlertTriangle, Heart } from 'lucide-react';
import { currentUser, getSimulatedTimestamp } from '../data/fakeData';
import './ChatWindow.css';
import MessageBubble from './MessageBubble';
import naviUpsetImg from '../assets/Navi Upset.png';
import naviHappyImg from '../assets/Navi Happy.png';
import naviConcernedImg from '../assets/Navi Concerned.png';
import magnifyingGlassImg from '../assets/MagnifyingGlass.png';

const ANALYZER_TOKENS = [
  { text: 'Adya', role: 'target', keep: true, score: 92, y: 84 },
  { text: ',', role: 'stop', keep: false, score: 8, y: 132 },
  { text: 'you', role: 'target', keep: true, score: 89, y: 92 },
  { text: 'suck', role: 'hurtful', keep: true, score: 97, y: 52 },
  { text: 'at', role: 'stop', keep: false, score: 14, y: 128 },
  { text: 'science', role: 'topic', keep: true, score: 35, y: 150 },
  { text: '.', role: 'stop', keep: false, score: 6, y: 136 },
];

const VOCABULARY_MATCHES = [
  { token: 'Adya', value: 'person being targeted' },
  { token: 'you', value: 'direct address' },
  { token: 'suck', value: 'hurtful phrase' },
  { token: 'science', value: 'school topic' },
];

export default function ChatWindow({ messages, onSendMessage, currentChat, demoMode, onAlertTrustedAdult, morphingChatId, oldMorphInfo, typingChatId }) {
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
  const [analyzerPhase, setAnalyzerPhase] = useState('idle');
  
  const isFlagging = morphingChatId === currentChat.id;
  const messagesEndRef = useRef(null);

  const isGroup = currentChat.isGroup;
  const showAnalyzerDemo = demoMode === '1' && currentChat.id === 'g1';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (showAnalyzerDemo) return;
    // Add small delay to let CSS padding transition start before scrolling
    setTimeout(scrollToBottom, 50);
  }, [messages, showNavi, showSuggestions, isJakeTyping, analyzerPhase, showAnalyzerDemo]);

  useEffect(() => {
    if (demoMode === '2' && currentChat.id === 'unknown_1') {
      setShowNavi(true);
      setNaviMood('concerned');
    } else if (demoMode === '1') {
      setShowNavi(false);
      setShowSuggestions(false);
    } else if (!demoMode) {
      setShowNavi(false);
      setShowSuggestions(false);
    }
  }, [demoMode, currentChat.id]);

  useEffect(() => {
    if (!showAnalyzerDemo) {
      setAnalyzerPhase('idle');
      return undefined;
    }

    setAnalyzerPhase('waiting');
    const timers = [
      setTimeout(() => setAnalyzerPhase('message'), 550),
      setTimeout(() => setAnalyzerPhase('scanning'), 1550),
      setTimeout(() => setAnalyzerPhase('focus'), 3300),
      setTimeout(() => setAnalyzerPhase('tokens'), 4500),
      setTimeout(() => setAnalyzerPhase('stopwords'), 7000),
      setTimeout(() => setAnalyzerPhase('vocabulary'), 9300),
      setTimeout(() => setAnalyzerPhase('classifier'), 11600),
      setTimeout(() => setAnalyzerPhase('graph'), 14800),
    ];

    return () => timers.forEach(clearTimeout);
  }, [showAnalyzerDemo]);

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
          <div className="avatar-morph-container">
            {!isFlagging && <img src={currentChat.avatar} alt={currentChat.name} className="avatar" />}
            {isFlagging && oldMorphInfo && <img src={oldMorphInfo.avatar} alt="Old" className="avatar morph-out-avatar" />}
            {isFlagging && <img src={currentChat.avatar} alt="New" className="avatar morph-in-avatar" />}
          </div>
          
          <div className="chat-meta">
            <div className="name-morph-container">
              {!isFlagging && <h2>{currentChat.name}</h2>}
              {isFlagging && oldMorphInfo && <h2 className="morph-out-text">{oldMorphInfo.name}</h2>}
              {isFlagging && <h2 className="morph-in-text">{currentChat.name}</h2>}
            </div>
            <span className={`status ${isFlagging ? 'status-morph' : ''}`}>{currentChat.status}</span>
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
      <div className={`messages-area ${showAnalyzerDemo ? 'analyzer-active' : ''}`}>
        <div className={`messages-container ${extraSpaceClass}`}>
          {showAnalyzerDemo ? (
            <AnalyzerDemo phase={analyzerPhase} />
          ) : (
            messages.map((msg, index) => {
              const isMine = msg.senderId === currentUser.id;
              return (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isMine={isMine}
                  showSender={!isMine && isGroup && (index === 0 || messages[index - 1].senderId !== msg.senderId)}
                />
              );
            })
          )}

          {!showAnalyzerDemo && (isJakeTyping || typingChatId === currentChat.id) && (
            <div className="typing-indicator-wrapper">
              <img src={isJakeTyping ? "https://ui-avatars.com/api/?name=J&background=random&color=fff&rounded=true&bold=true" : currentChat.avatar} alt="Typing" className="avatar message-avatar" style={{ width: '28px', height: '28px' }} />
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
                    <button className="navi-btn danger" onClick={() => {
                      if (onAlertTrustedAdult) onAlertTrustedAdult(currentChat.id);
                      closeNavi();
                    }}>Alert Trusted Adult</button>
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

function AnalyzerDemo({ phase }) {
  const showMessage = ['message', 'scanning', 'focus', 'tokens', 'stopwords', 'vocabulary', 'classifier', 'graph'].includes(phase);
  const showScanning = ['scanning'].includes(phase);
  const showCinema = ['focus', 'tokens', 'stopwords', 'vocabulary', 'classifier', 'graph'].includes(phase);
  const showTokens = ['tokens', 'stopwords', 'vocabulary', 'classifier', 'graph'].includes(phase);
  const showStopWords = ['stopwords', 'vocabulary', 'classifier', 'graph'].includes(phase);
  const showVocabulary = ['vocabulary', 'classifier', 'graph'].includes(phase);
  const showClassifier = ['classifier', 'graph'].includes(phase);
  const showGraph = phase === 'graph';

  return (
    <div className="analyzer-demo">
      {!showMessage && (
        <div className="empty-thread">
          <span className="empty-thread-dot"></span>
          Waiting for a new Science Project message...
        </div>
      )}

      {showMessage && (
        <div className="analyzer-message-zone">
          <div className="message-row theirs analyzer-message-row">
            <img
              src="https://ui-avatars.com/api/?name=J&background=7B61FF&color=fff&rounded=true&bold=true"
              alt="Jake"
              className="message-avatar"
              title="Jake"
            />
            <div className={`message-bubble theirs show-tail analyzer-message ${showScanning ? 'is-scanning' : ''}`}>
              <span className="sender-name">Jake</span>
              <p className="message-text">Adya, you suck at science.</p>
              <span className="timestamp">4:47 PM</span>
              {showScanning && <span className="scan-line" />}
            </div>
          </div>

          {showScanning && (
            <div className="navi-scanner">
              <img src={magnifyingGlassImg} alt="Navi scanner" className="scanner-lens" />
              <div className="scanner-copy">
                <strong>Navi is reading the message</strong>
                <span>Computer vision finds the text, then NLP starts.</span>
              </div>
            </div>
          )}
        </div>
      )}

      {showCinema && (
        <div className="analysis-cinema">
          <div className="cinema-card">
            <div className="cinema-message">
              <span className="cinema-sender">Jake</span>
              <span>Adya, you suck at science.</span>
            </div>

            <StageLabel phase={phase} />

            {showTokens && (
              <div className={`cinema-token-row ${showStopWords ? 'removing-stopwords' : ''} ${showClassifier ? 'classified' : ''}`}>
                {ANALYZER_TOKENS.map((token, index) => (
                  <span
                    className={`cinema-token ${token.role} ${!token.keep && showStopWords ? 'removed' : ''}`}
                    style={{ '--token-delay': `${index * 95}ms` }}
                    key={`${token.text}-${index}`}
                  >
                    {token.text}
                  </span>
                ))}
              </div>
            )}

            {showStopWords && (
              <div className="discard-tray">
                <span>Removed filler tokens</span>
                <strong>,</strong>
                <strong>at</strong>
                <strong>.</strong>
              </div>
            )}

            {showVocabulary && (
              <div className="vocabulary-map">
                {VOCABULARY_MATCHES.map((match, index) => (
                  <div className="vocabulary-link" style={{ '--vocab-delay': `${index * 120}ms` }} key={match.token}>
                    <span>{match.token}</span>
                    <strong>{match.value}</strong>
                  </div>
                ))}
              </div>
            )}

            {showClassifier && (
              <div className="classifier-band">
                <div className="classifier-heart">
                  <Heart size={30} fill="currentColor" />
                </div>
                <div>
                  <span>Sentiment classifier</span>
                  <strong>Targeted negative language detected</strong>
                </div>
              </div>
            )}

            {showGraph && <SentimentGraph />}
          </div>
        </div>
      )}
    </div>
  );
}

function StageLabel({ phase }) {
  const copy = {
    focus: {
      title: 'Navi is reading the message',
      text: 'Computer vision finds the chat bubble and extracts the text.',
    },
    tokens: {
      title: 'Tokenization',
      text: 'The sentence breaks into small pieces called tokens.',
    },
    stopwords: {
      title: 'Stop-word removal',
      text: 'Filler tokens are moved aside so the important words stand out.',
    },
    vocabulary: {
      title: 'Vocabulary indexing',
      text: 'Navi checks each important token against its meaning list.',
    },
    classifier: {
      title: 'Sentiment classifier',
      text: 'The heart model looks for who is targeted and how negative the words are.',
    },
    graph: {
      title: 'Sentiment classifier',
      text: 'The word scores land above the safety threshold with high confidence.',
    },
  };
  const active = copy[phase] || copy.focus;

  return (
    <div className={`stage-label phase-${phase}`}>
      <strong>{active.title}</strong>
      <span>{active.text}</span>
    </div>
  );
}

function SentimentGraph() {
  const keptTokens = ANALYZER_TOKENS.filter((token) => token.keep);

  return (
    <div className="sentiment-graph-card">
      <div className="graph-header">
        <span>Confidence Score</span>
        <strong>94%</strong>
      </div>
      <div className="graph-plot" aria-label="Sentiment classifier graph">
        <svg viewBox="0 0 520 240" role="img">
          <defs>
            <linearGradient id="sentimentLine" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2F80ED" />
              <stop offset="100%" stopColor="#D7263D" />
            </linearGradient>
          </defs>
          <line className="axis" x1="46" y1="198" x2="486" y2="198" />
          <line className="axis" x1="46" y1="28" x2="46" y2="198" />
          <line className="threshold" x1="46" y1="72" x2="486" y2="72" />
          <text className="axis-label" x="52" y="62">90% threshold</text>
          <path className="best-fit" d="M72 172 C175 144, 255 95, 462 52" />
          {keptTokens.map((token, index) => {
            const x = 92 + index * 112;
            return (
              <g className={`graph-word ${token.role}`} style={{ '--graph-delay': `${index * 140}ms` }} key={token.text}>
                <circle cx={x} cy={token.y} r="9" />
                <text x={x} y={token.y - 18}>{token.text}</text>
              </g>
            );
          })}
          <text className="x-label" x="265" y="228">Message tokens</text>
          <text className="y-label" x="18" y="132" transform="rotate(-90 18 132)">Negative signal</text>
        </svg>
      </div>
    </div>
  );
}
