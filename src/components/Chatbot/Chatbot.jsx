import { useState, useRef, useEffect, useCallback } from 'react';
import './Chatbot.css';

const SERVICE_OPTIONS = [
  'AI Strategy & Consulting',
  'Workflow Automation',
  'Custom Model Development',
  'Data Infrastructure',
  'AI Agent Systems',
  'Something else',
];

const REVENUE_OPTIONS = [
  '$1M – $5M',
  '$5M – $10M',
  '$10M – $50M',
  '$50M+',
  'Prefer not to say',
];

function now() {
  return new Date().toISOString();
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState('greeting');
  const [leadData, setLeadData] = useState({
    interest: '',
    challenge: '',
    company: '',
    revenue: '',
    name: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [pulse, setPulse] = useState(true);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const hasGreeted = useRef(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open, step]);

  function addBot(content, quickReplies, delay = 600) {
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content, timestamp: now(), quickReplies },
      ]);
    }, delay);
  }

  function addUser(content) {
    setMessages((prev) => [...prev, { role: 'user', content, timestamp: now() }]);
  }

  const startChat = useCallback(() => {
    if (hasGreeted.current) return;
    hasGreeted.current = true;
    setPulse(false);
    addBot(
      "Hey there! I'm the Archos AI assistant. I can help you figure out if AI is a fit for your business.",
      undefined,
      300
    );
    addBot('What are you most interested in?', SERVICE_OPTIONS, 1200);
    setStep('interest');
  }, []);

  function handleOpen() {
    setOpen(true);
    startChat();
  }

  async function submitLead(data) {
    if (submitted) return;
    setSubmitted(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          company: data.company,
          revenue: data.revenue,
          phone: '',
          message: `Interest: ${data.interest}. Challenge: ${data.challenge}`,
          source: 'chatbot',
        }),
      });
    } catch {
      // silently fail
    }
  }

  function processInput(text) {
    addUser(text);
    setMessages((prev) => prev.map((m) => ({ ...m, quickReplies: undefined })));

    switch (step) {
      case 'interest':
        setLeadData((d) => ({ ...d, interest: text }));
        addBot(
          `Great choice — ${text.toLowerCase()} is one of the highest-ROI areas we work in. What's the biggest challenge you're facing right now that made you explore AI?`
        );
        setStep('challenge');
        break;
      case 'challenge':
        setLeadData((d) => ({ ...d, challenge: text }));
        addBot(
          "That's a challenge we've helped other companies solve. So I can point you in the right direction — what's your company name?"
        );
        setStep('company');
        break;
      case 'company':
        setLeadData((d) => ({ ...d, company: text }));
        addBot(
          "And roughly what's your annual revenue? This helps us recommend the right engagement scope.",
          REVENUE_OPTIONS
        );
        setStep('revenue');
        break;
      case 'revenue':
        setLeadData((d) => ({ ...d, revenue: text }));
        addBot("Perfect. Last couple of things so our team can follow up — what's your name?");
        setStep('name');
        break;
      case 'name':
        setLeadData((d) => ({ ...d, name: text }));
        addBot(`Nice to meet you, ${text.split(' ')[0]}! What's the best email to reach you at?`);
        setStep('email');
        break;
      case 'email': {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim())) {
          addBot("That doesn't look like a valid email. Could you double-check?");
          return;
        }
        const finalData = { ...leadData, email: text.trim() };
        setLeadData(finalData);
        submitLead(finalData);
        addBot(
          `Thank you, ${leadData.name.split(' ')[0]}! I've passed your info along to our team. You'll hear from us within 24 hours to schedule a discovery call.`,
          undefined,
          600
        );
        addBot(
          'In the meantime, feel free to explore our services or ask me anything else about what we do.',
          undefined,
          1400
        );
        setStep('complete');
        break;
      }
      case 'complete':
        addBot(
          "If you have more questions, feel free to ask! Otherwise, our team will be in touch soon."
        );
        break;
    }
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput('');
    processInput(text);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const lastMsg = messages[messages.length - 1];
  const showInput = !lastMsg?.quickReplies || step === 'complete';

  return (
    <>
      {open && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">A</div>
              <div>
                <span className="chatbot-header-name">Archos AI</span>
                <span className="chatbot-header-status">
                  <span className="chatbot-status-dot" />
                  Online
                </span>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close chat">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div key={idx}>
                <div className={`chatbot-msg chatbot-msg-${msg.role}`}>
                  {msg.role === 'bot' && <div className="chatbot-msg-avatar">A</div>}
                  <div className={`chatbot-bubble chatbot-bubble-${msg.role}`}>
                    {msg.content}
                  </div>
                </div>
                {msg.quickReplies && (
                  <div className="chatbot-quick-replies">
                    {msg.quickReplies.map((r) => (
                      <button key={r} className="chatbot-qr-btn" onClick={() => processInput(r)}>
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          {showInput && (
            <div className="chatbot-input-area">
              <input
                ref={inputRef}
                type={step === 'email' ? 'email' : 'text'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  step === 'email'
                    ? 'your@email.com'
                    : step === 'complete'
                      ? 'Ask a question...'
                      : 'Type your answer...'
                }
                className="chatbot-input"
              />
              <button className="chatbot-send" onClick={handleSend} disabled={!input.trim()} aria-label="Send">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* FAB */}
      <button
        className={`chatbot-fab${pulse ? ' pulse' : ''}`}
        onClick={open ? () => setOpen(false) : handleOpen}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </>
  );
}
