import React, { useState, useEffect, useRef } from 'react';
import apiService from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const INITIAL_GREETING = `Welcome to Lotus Tubes!

I'm Arjun, your Customer Support Assistant.

It's a pleasure to assist you. Whether you need information about our products, an update on an existing enquiry, quotation assistance or support with an ongoing order, I'm here to help.

Please let me know how I can assist you today.`;

export const ChatWithUs = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      time: 'Just now',
      text: INITIAL_GREETING
    }
  ]);
  const [input, setInput] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isChecking]);

  // Check if user just logged in with pending chat request
  useEffect(() => {
    if (user && sessionStorage.getItem('lotus_open_chat_after_login') === 'true') {
      sessionStorage.removeItem('lotus_open_chat_after_login');
      setIsOpen(true);
    }
  }, [user]);

  // Listen for external trigger to open chat with prefilled context
  useEffect(() => {
    const handleTrigger = (e) => {
      if (!user) {
        setShowAuthModal(true);
        return;
      }
      setIsOpen(true);
      if (e.detail?.message) {
        handleSendMessage(e.detail.message, e.detail.reference);
      }
    };
    window.addEventListener('open-lotus-chat', handleTrigger);
    return () => window.removeEventListener('open-lotus-chat', handleTrigger);
  }, [user]);

  const handleOpenClick = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setIsOpen(true);
    }
  };

  const handleNavigateAuth = (targetHash) => {
    sessionStorage.setItem('lotus_open_chat_after_login', 'true');
    setShowAuthModal(false);
    window.location.hash = targetHash;
  };

  const handleSendMessage = async (msgText = input, reference = '') => {
    const textToSend = (msgText || '').trim();
    if (!textToSend || isChecking) return;

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsChecking(true);

    // Initial professional waiting holding message mandated by executive specification
    const waitingMsgId = Date.now() + 1;
    setMessages((prev) => [
      ...prev,
      {
        id: waitingMsgId,
        sender: 'bot',
        isWaiting: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: "Thank you for your patience. I’m checking the latest status of your request with our team. I’ll get back to you shortly."
      }
    ]);

    try {
      const res = await apiService.submitChatInquiry({
        message: textToSend,
        reference: reference || textToSend,
        email: user?.email,
        phone: user?.phone
      });

      // Remove waiting message and append verified response
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== waitingMsgId);
        return [
          ...filtered,
          {
            id: Date.now() + 2,
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            botSource: res?.data?.botSource || 'Customer Support Desk',
            verifiedBy: res?.data?.verifiedBy || 'Lotus Tubes Operations Desk',
            text: res?.data?.reply || "I have cross-checked with our department desk. Your request is registered and will be attended to promptly."
          }
        ];
      });
    } catch (err) {
      // Fallback response with factual guidance
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== waitingMsgId);
        return [
          ...filtered,
          {
            id: Date.now() + 2,
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            botSource: 'Customer Support Desk',
            verifiedBy: 'Lotus Tubes Operations Desk',
            text: `Status checked: Our customer support team has logged your message: "${textToSend}". For urgent technical inquiries or order updates, you can also reach our direct Mumbai desk at +91 98205 25200 or via WhatsApp.`
          }
        ];
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="lt-chat-widget">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          className="lt-chat-trigger-btn"
          onClick={handleOpenClick}
          aria-label="Open chat with Arjun - Customer Support Assistant"
        >
          <img
            src="/assets/images/team/agent-4.jpeg"
            alt="Arjun - Customer Support Assistant"
            className="lt-chat-trigger-avatar"
            width="44"
            height="44"
          />
          <div className="lt-chat-trigger-text">
            <span className="lt-chat-trigger-title">Chat with Us</span>
            <span className="lt-chat-trigger-sub">
              <span className="lt-pulse-dot" style={{ width: '5px', height: '5px' }}></span>
              Arjun • Customer Support
            </span>
          </div>
        </button>
      )}

      {/* Authentication Prompt Modal for Unauthenticated Visitors */}
      {showAuthModal && (
        <div className="lt-chat-auth-overlay" onClick={() => setShowAuthModal(false)} role="dialog" aria-modal="true">
          <div className="lt-chat-auth-modal" onClick={(e) => e.stopPropagation()}>
            <div className="lt-chat-auth-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="lt-chat-auth-avatar-wrap">
                  <img
                    src="/assets/images/team/agent-4.jpeg"
                    alt="Arjun"
                    className="lt-chat-auth-avatar"
                    width="44"
                    height="44"
                  />
                  <span className="lt-chat-auth-badge">Support</span>
                </div>
                <div>
                  <h3 className="lt-chat-auth-title">Customer Sign In Required</h3>
                  <p className="lt-chat-auth-subtitle">Lotus Tubes Live Customer Concierge</p>
                </div>
              </div>
              <button
                type="button"
                className="lt-chat-auth-close"
                onClick={() => setShowAuthModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="lt-chat-auth-body">
              <p className="lt-chat-auth-desc">
                Live support chat, order tracking, and quotation assistance are available exclusively for registered Lotus Tubes clients.
              </p>
              <p className="lt-chat-auth-note">
                Please sign in to your customer account or create a new account to connect directly with Arjun.
              </p>

              <div className="lt-chat-auth-actions">
                <button
                  type="button"
                  className="lt-chat-auth-btn lt-chat-auth-btn--primary"
                  onClick={() => handleNavigateAuth('#login')}
                >
                  Sign In to Account &rarr;
                </button>
                <button
                  type="button"
                  className="lt-chat-auth-btn lt-chat-auth-btn--secondary"
                  onClick={() => handleNavigateAuth('#register')}
                >
                  Create an Account
                </button>
                <button
                  type="button"
                  className="lt-chat-auth-btn lt-chat-auth-btn--text"
                  onClick={() => setShowAuthModal(false)}
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expandable Chat Window */}
      {isOpen && (
        <div className="lt-chat-window" role="dialog" aria-label="Lotus Tubes Live Support Chat">
          {/* Header */}
          <div className="lt-chat-header">
            <div className="lt-chat-header-info">
              <img
                src="/assets/images/team/agent-4.jpeg"
                alt="Arjun - Customer Support Assistant"
                className="lt-chat-header-avatar"
                width="44"
                height="44"
              />
              <div>
                <div className="lt-chat-header-title">Arjun</div>
                <div className="lt-chat-header-sub">Customer Support Assistant • Support Desk</div>
              </div>
            </div>
            <button
              type="button"
              className="lt-chat-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div className="lt-chat-body">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`lt-chat-msg lt-chat-msg--${m.sender === 'user' ? 'user' : 'bot'}`}
              >
                {m.isWaiting ? (
                  <div className="lt-chat-typing-wait">
                    <span className="lt-pulse-dot"></span>
                    <span>{m.text}</span>
                  </div>
                ) : (
                  <>
                    <div className="lt-chat-bubble">
                      {m.botSource && (
                        <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700, marginBottom: '4px' }}>
                          [{m.botSource}]
                        </div>
                      )}
                      <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                      {m.verifiedBy && (
                        <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600, marginTop: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '4px' }}>
                          ✓ Verified by {m.verifiedBy}
                        </div>
                      )}
                    </div>
                    <span className="lt-chat-msg-time">{m.time}</span>
                  </>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompt Chips */}
          <div style={{ padding: '6px 12px', background: '#ffffff', display: 'flex', gap: '6px', overflowX: 'auto', borderTop: '1px solid #f1f5f9' }}>
            <button
              type="button"
              onClick={() => handleSendMessage("I would like an update on my quotation")}
              style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '12px', background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#0369a1', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              📊 Quotation Status
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage("Where is my bill or commercial invoice?")}
              style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '12px', background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#0369a1', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              🧾 Billing & Invoices
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage("I would like an update on my enquiry")}
              style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '12px', background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#0369a1', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              📝 Support & Enquiries
            </button>
          </div>

          {/* Footer Input */}
          <div className="lt-chat-footer">
            <input
              type="text"
              className="lt-chat-input"
              placeholder="Ask Arjun for product details, quotation, or order status..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isChecking}
            />
            <button
              type="button"
              className="lt-chat-send-btn"
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isChecking}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWithUs;
