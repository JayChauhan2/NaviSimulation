import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, Paperclip, Smile, AlertTriangle } from 'lucide-react';
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

const VOCABULARY_INDEX = [
  { word: 'Adya', id: 1042 },
  { word: 'you', id: 203 },
  { word: 'suck', id: 8801 },
  { word: 'science', id: 4519 },
];

const SENTIMENT_POINTS = [
  { word: 'Adya', id: 1042, x: 0, y: 0 },
  { word: 'you', id: 203, x: -0.26, y: 0.01 },
  { word: 'suck', id: 8801, x: -0.78, y: -0.7 },
  { word: 'science', id: 4519, x: 0.34, y: 0.05 },
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
  const showTeachingAnalyzer = demoMode === '1' && currentChat.id === 'g1';
  const showSentimentAnalyzer = demoMode === '2' && currentChat.id === 'g1';
  const showAnalyzerDemo = showTeachingAnalyzer || showSentimentAnalyzer;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (showAnalyzerDemo) return;
    // Add small delay to let CSS padding transition start before scrolling
    setTimeout(scrollToBottom, 50);
  }, [messages, showNavi, showSuggestions, isJakeTyping, analyzerPhase, showAnalyzerDemo]);

  useEffect(() => {
    if (demoMode === 'safety-disabled' && currentChat.id === 'unknown_1') {
      setShowNavi(true);
      setNaviMood('concerned');
    } else if (demoMode === '1' || demoMode === '2') {
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

    if (showSentimentAnalyzer) {
      setAnalyzerPhase('sentiment-vocabulary');
      const timers = [
        setTimeout(() => setAnalyzerPhase('context-window'), 3000),
        setTimeout(() => setAnalyzerPhase('confidence-score'), 7250),
      ];

      return () => timers.forEach(clearTimeout);
    }

    setAnalyzerPhase('typing');
    const timers = [
      setTimeout(() => setAnalyzerPhase('message'), 2000),
      setTimeout(() => setAnalyzerPhase('focus'), 4000),
      setTimeout(() => setAnalyzerPhase('tokens'), 7350),
      setTimeout(() => setAnalyzerPhase('stopwords'), 10250),
      setTimeout(() => setAnalyzerPhase('highlight'), 13250),
      setTimeout(() => setAnalyzerPhase('vocabulary'), 16250),
    ];

    return () => timers.forEach(clearTimeout);
  }, [showAnalyzerDemo, showSentimentAnalyzer]);

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
  const showTyping = phase === 'typing';
  const showMessage = ['message', 'focus', 'tokens', 'stopwords', 'highlight', 'vocabulary'].includes(phase);
  const showCinema = ['focus', 'tokens', 'stopwords', 'highlight', 'vocabulary', 'sentiment-vocabulary', 'context-window', 'confidence-score'].includes(phase);
  const showTokens = ['tokens', 'stopwords', 'highlight', 'vocabulary'].includes(phase);
  const showStopWords = ['stopwords', 'highlight', 'vocabulary'].includes(phase);
  const showHighlight = ['highlight', 'vocabulary'].includes(phase);
  const showVocabulary = phase === 'vocabulary' || phase === 'sentiment-vocabulary';
  const showContextWindow = phase === 'context-window' || phase === 'confidence-score';
  const showConfidenceScore = phase === 'confidence-score';
  const phaseLabel = {
    focus: 'NLP',
    tokens: 'Tokenization',
    stopwords: 'Stop-Word Removal',
    highlight: 'Sentiment Classifier',
    vocabulary: 'Vocabulary Indexing',
    'sentiment-vocabulary': 'Vocabulary Indexing',
    'context-window': 'Sentiment Classifier',
  }[phase];

  return (
    <div className="analyzer-demo">
      {!showMessage && !showTyping && !showCinema && (
        <div className="empty-thread">
          <span className="empty-thread-dot"></span>
          Waiting for a new Science Project message...
        </div>
      )}

      {showTyping && (
        <div className="analyzer-message-zone">
          <div className="typing-indicator-wrapper analyzer-typing">
            <img
              src="https://ui-avatars.com/api/?name=J&background=7B61FF&color=fff&rounded=true&bold=true"
              alt="Jake"
              className="avatar message-avatar"
              title="Jake"
            />
            <div className="typing-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
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
            <div className="message-bubble theirs show-tail analyzer-message">
              <span className="sender-name">Jake</span>
              <p className="message-text">Adya, you suck at science.</p>
              <span className="timestamp">4:47 PM</span>
            </div>
          </div>
        </div>
      )}

      {showCinema && (
        <div className="analysis-cinema">
          <div className="cinema-card">
            {!showVocabulary && !showContextWindow && (
              <div className="cinema-message">
                <span className="cinema-sender">Jake</span>
                <div className={`message-token-surface ${showTokens ? 'tokenized' : ''} ${showStopWords ? 'stopwords-removed' : ''} ${showHighlight ? 'classified' : ''}`}>
                  {!showTokens ? (
                    <span className="raw-focused-message">Adya, you suck at science.</span>
                  ) : (
                    ANALYZER_TOKENS.map((token, index) => (
                      <span
                        className={`cinema-token ${token.role} ${!token.keep && showStopWords ? 'removed' : ''}`}
                        style={{ '--token-delay': `${index * 95}ms`, '--compact-index': token.keep ? index : 0 }}
                        key={`${token.text}-${index}`}
                      >
                        {token.text}
                      </span>
                    ))
                  )}
                </div>
                {phase === 'focus' && (
                  <img src={magnifyingGlassImg} alt="Navi scanner" className="cinema-magnifier" />
                )}
                {phaseLabel && (
                  <div className="scan-tooltip-tag" key={phaseLabel}>{phaseLabel}</div>
                )}
              </div>
            )}

            {showVocabulary && (
              <div className="vocabulary-index-panel">
                <div className="scan-tooltip-tag vocabulary-tag" key={phaseLabel}>{phaseLabel}</div>
                <div className="vocab-index-header">
                  <span>Word</span>
                  <span>ID</span>
                </div>
                {VOCABULARY_INDEX.map((item, index) => (
                  <div className="vocab-index-row" style={{ '--vocab-row-delay': `${index * 140}ms` }} key={item.word}>
                    <span className="vocab-word-cell">
                      <span className="vocab-word" style={{ '--vocab-word-delay': `${index * 140 + 440}ms` }}>{item.word}</span>
                      <span className="vocab-arrow" aria-hidden="true"></span>
                    </span>
                    <span className="vocab-id">{item.id}</span>
                  </div>
                ))}
              </div>
            )}

            {showContextWindow && (
              <div className={`sentiment-plot-panel ${showConfidenceScore ? 'plot-exiting' : ''}`}>
                {phaseLabel && (
                  <div className="scan-tooltip-tag vocabulary-tag" key={phaseLabel}>{phaseLabel}</div>
                )}
                <svg className="context-plot" viewBox="0 0 520 360" role="img" aria-label="Context window sentiment plot">
                  <defs>
                    <filter id="contextShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#0d47a1" floodOpacity="0.18" />
                    </filter>
                  </defs>
                  <line className="context-axis" x1="70" y1="180" x2="470" y2="180" />
                  <line className="context-axis" x1="260" y1="46" x2="260" y2="314" />
                  <text className="context-axis-label y-top" x="260" y="34">Kind</text>
                  <text className="context-axis-label y-bottom" x="260" y="338">Mean</text>
                  <text className="context-axis-label x-left" x="70" y="170">Unsafe</text>
                  <text className="context-axis-label x-right" x="470" y="170">Safe</text>
                  <path
                    className="context-blob"
                    d="M 114 268 C 92 216, 126 144, 212 124 C 314 100, 374 128, 386 188 C 400 260, 310 304, 198 300 C 154 298, 128 286, 114 268 Z"
                  />
                  <text className="context-window-label" x="326" y="112">Context Window</text>
                  {SENTIMENT_POINTS.map((point, index) => (
                    <g
                      transform={`translate(${260 + point.x * 170} ${180 - point.y * 116})`}
                      key={point.word}
                    >
                      <g
                        className={`context-point point-${point.word.toLowerCase()}`}
                        style={{ '--plot-delay': `${index * 250}ms` }}
                      >
                        <circle r="8" />
                        <text className="context-word" x="0" y="-15">{point.word}</text>
                        <text className="context-id" x="0" y="27">{point.id}</text>
                      </g>
                    </g>
                  ))}
                </svg>
              </div>
            )}

            {showConfidenceScore && (
              <ConfidenceScoreCard />
            )}

          </div>
        </div>
      )}
    </div>
  );
}

function ConfidenceScoreCard() {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const startedAt = performance.now();
    let animationFrame;

    const animate = (now) => {
      const progress = Math.min((now - startedAt) / 1500, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setScore(Math.round(eased * 96));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="confidence-score-panel">
      <div className="confidence-score-main">
        <h3>Confidence Score</h3>
        <div className="confidence-number" aria-label={`Confidence score ${score} percent`}>
          {score}%
        </div>
      </div>
      <div className="bullying-warning-card">
        <img src={naviConcernedImg} alt="Worried Navi" className="warning-navi" />
        <div className="warning-sign">
          <AlertTriangle size={28} />
          <span>Bullying Detected</span>
        </div>
      </div>
    </div>
  );
}
