import { useState, useRef, useEffect, useCallback } from 'react';
import './Chatbot.css';

/* ─── Service options shown as quick replies ─── */
const SERVICE_OPTIONS = [
  'AI Strategy & Consulting',
  'Workflow Automation',
  'AI Integration & Deployment',
  'Data Infrastructure',
  'AI Agent Systems',
  'Not sure yet',
];

const REVENUE_OPTIONS = [
  'Less than $1M',
  '$1M – $5M',
  '$5M – $10M',
  '$10M – $25M',
  '$25M – $50M',
  '$50M – $100M',
  '$100M+',
];

const TIMELINE_OPTIONS = [
  'ASAP — we need help now',
  'Next 1–3 months',
  'Next 3–6 months',
  'Just exploring',
];

const ROLE_OPTIONS = [
  'CEO / Founder',
  'CTO / VP Engineering',
  'COO / Operations',
  'Head of Product',
  'Director / Manager',
  'Other',
];

/* ─── Context-aware responses per service interest ─── */
const INTEREST_RESPONSES = {
  'AI Strategy & Consulting':
    "Smart move. Most companies waste 6–12 months going in the wrong direction before they bring in a strategist. We help you skip that entirely — audit what you have, identify the highest-ROI opportunities, and build a roadmap your team can actually execute on.",
  'Workflow Automation':
    "That's where we see the fastest wins. We've helped companies cut operational costs by 40–60% by automating the workflows that eat up the most human hours. The key is picking the right processes first — not everything should be automated.",
  'AI Integration & Deployment':
    "Integration is where most AI projects fail. It's not about the model — it's about making it work reliably inside your existing systems. We handle the hard part: connecting AI to your actual workflows, data, and team.",
  'Data Infrastructure':
    "Good instinct. Your AI is only as good as the data feeding it. We see a lot of companies try to bolt on AI before their data layer is ready, and it never works. We help you build the foundation that makes everything else possible.",
  'AI Agent Systems':
    "AI agents are the next frontier. We build autonomous systems that don't just answer questions — they take actions, make decisions, and handle entire workflows end-to-end. Most companies aren't ready for this yet, but the ones that are see massive leverage.",
  'Not sure yet':
    "No problem at all — that's actually a great place to start. Most of our best engagements begin with a company that knows AI could help but isn't sure where. That's exactly what our discovery process is for.",
};

/* ─── Challenge follow-ups based on interest ─── */
const CHALLENGE_FOLLOWUPS = {
  'AI Strategy & Consulting':
    "We hear that a lot. The good news is that a focused 2–3 week strategy sprint usually gets companies from 'where do we even start' to a clear, prioritized plan.",
  'Workflow Automation':
    "That's a very common pain point, and usually more solvable than people think. We typically map out the full workflow first, then identify the 2–3 bottlenecks where automation delivers the biggest impact.",
  'AI Integration & Deployment':
    "Totally understandable. Integration challenges are why ~80% of AI projects never make it to production. Our approach is to start small with a single high-value integration, prove it out, then expand.",
  'Data Infrastructure':
    "You're not alone there — messy data is the #1 blocker we see across every industry. The key is not trying to fix everything at once. We identify the critical data pipelines first and build from there.",
  'AI Agent Systems':
    "That's a challenge we enjoy solving. The trick with agents is defining clear guardrails and decision boundaries before you build. We've learned that the hard way so our clients don't have to.",
  'Not sure yet':
    "That makes sense. Honestly, just the fact that you're thinking about this puts you ahead of most companies. Let me ask a few more questions so we can figure out the best path forward together.",
};

/* ─── Urgency qualifiers ─── */
const TIMELINE_RESPONSES = {
  'ASAP — we need help now':
    "Got it — we'll prioritize getting you connected with a senior consultant. We can usually have a discovery call on the books within 48 hours.",
  'Next 1–3 months':
    "Good timeline. That gives us room to be thoughtful about scoping. We'll set up a discovery call to map out the engagement and make sure we're aligned before kickoff.",
  'Next 3–6 months':
    "Perfect — that gives us time to do this right. We can start with a lightweight strategy session to help you plan, so when you're ready to move you're not starting from zero.",
  'Just exploring':
    "Nothing wrong with that. Some of our best client relationships started as 'just exploring.' Let me get your info so we can send over some relevant case studies and stay in touch.",
};

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
    role: '',
    revenue: '',
    timeline: '',
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
      "Hey — welcome to Archos AI. I'm here to help you figure out how AI can move the needle for your business.",
      undefined,
      300
    );
    addBot(
      "We work with companies doing $1M+ in revenue on AI strategy, automation, and deployment. What area are you most interested in?",
      SERVICE_OPTIONS,
      1400
    );
    setStep('interest');
  }, []);

  function handleOpen() {
    setOpen(true);
    startChat();
  }

  async function submitLead(data) {
    if (submitted) return;
    setSubmitted(true);

    // Score the lead based on qualifying data
    let score = 0;
    const revenueIndex = REVENUE_OPTIONS.indexOf(data.revenue);
    if (revenueIndex >= 5) score += 30;       // $50M+
    else if (revenueIndex >= 3) score += 20;  // $10M+
    else if (revenueIndex >= 1) score += 10;  // $1M+

    if (data.timeline === 'ASAP — we need help now') score += 30;
    else if (data.timeline === 'Next 1–3 months') score += 20;
    else if (data.timeline === 'Next 3–6 months') score += 10;

    const seniorRoles = ['CEO / Founder', 'CTO / VP Engineering', 'COO / Operations'];
    if (seniorRoles.includes(data.role)) score += 20;
    else if (data.role === 'Head of Product' || data.role === 'Director / Manager') score += 10;

    if (data.interest !== 'Not sure yet') score += 10;

    const priority = score >= 60 ? 'high' : score >= 30 ? 'medium' : 'low';

    // Build conversation transcript for storage
    const conversationMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
      timestamp: m.timestamp,
    }));

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          company: data.company,
          revenue: data.revenue,
          role: data.role,
          interest: data.interest,
          timeline: data.timeline,
          message: data.challenge,
          source: 'chatbot',
          score,
          priority,
          conversationMessages,
        }),
      });
    } catch {
      // silently fail
    }
  }

  function processInput(text) {
    addUser(text);
    // Clear any active quick replies
    setMessages((prev) => prev.map((m) => ({ ...m, quickReplies: undefined })));

    switch (step) {
      case 'interest': {
        setLeadData((d) => ({ ...d, interest: text }));
        const response = INTEREST_RESPONSES[text] || INTEREST_RESPONSES['Not sure yet'];
        addBot(response);
        addBot(
          "Tell me a bit about what's going on — what's the biggest challenge or opportunity that brought you here today?",
          undefined,
          1400
        );
        setStep('challenge');
        break;
      }

      case 'challenge': {
        setLeadData((d) => ({ ...d, challenge: text }));
        const followup = CHALLENGE_FOLLOWUPS[leadData.interest] || CHALLENGE_FOLLOWUPS['Not sure yet'];
        addBot(followup);
        addBot("What's your company name? I want to make sure our team has the right context.", undefined, 1200);
        setStep('company');
        break;
      }

      case 'company': {
        setLeadData((d) => ({ ...d, company: text }));
        addBot(
          `${text} — got it. And what's your role there? This helps us connect you with the right person on our end.`,
          ROLE_OPTIONS
        );
        setStep('role');
        break;
      }

      case 'role': {
        setLeadData((d) => ({ ...d, role: text }));
        addBot(
          "Helpful, thanks. One more qualifying question — roughly what annual revenue range is the company in? No need to be exact, this just helps us scope the right engagement.",
          REVENUE_OPTIONS
        );
        setStep('revenue');
        break;
      }

      case 'revenue': {
        setLeadData((d) => ({ ...d, revenue: text }));
        addBot(
          "And what does your timeline look like? Are you looking to move on this soon, or still in research mode?",
          TIMELINE_OPTIONS
        );
        setStep('timeline');
        break;
      }

      case 'timeline': {
        setLeadData((d) => ({ ...d, timeline: text }));
        const response = TIMELINE_RESPONSES[text] || TIMELINE_RESPONSES['Just exploring'];
        addBot(response);
        addBot("Almost done — what's your name?", undefined, 1000);
        setStep('name');
        break;
      }

      case 'name': {
        setLeadData((d) => ({ ...d, name: text }));
        const firstName = text.split(' ')[0];
        addBot(
          `Great to meet you, ${firstName}. Last thing — what's the best email for our team to reach you?`
        );
        setStep('email');
        break;
      }

      case 'email': {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim())) {
          addBot("Hmm, that doesn't look quite right. Could you double-check the email format?");
          return;
        }
        const finalData = { ...leadData, email: text.trim() };
        setLeadData(finalData);
        submitLead(finalData);

        const firstName = leadData.name.split(' ')[0];
        const isUrgent = leadData.timeline === 'ASAP — we need help now';

        addBot(
          isUrgent
            ? `Perfect, ${firstName}. Given your timeline, I'm flagging this as priority. One of our senior consultants will reach out within 24 hours to get a discovery call scheduled.`
            : `Perfect, ${firstName}. I've shared everything with our team. You'll hear from someone within 24 hours to set up a discovery call — no pressure, no sales pitch, just a real conversation about what's possible.`,
          undefined,
          600
        );
        addBot(
          "In the meantime, if you have any quick questions about how we work, I'm happy to answer.",
          ['How does pricing work?', 'What does a typical engagement look like?', 'What industries do you work with?'],
          1400
        );
        setStep('complete');
        break;
      }

      case 'complete': {
        const lower = text.toLowerCase();
        if (lower.includes('pricing') || lower.includes('cost') || lower.includes('price') || lower.includes('how much')) {
          addBot(
            "We don't do one-size-fits-all pricing. Every engagement is scoped based on the complexity and timeline. That said, our strategy sprints start around $15K and full implementations range from $50K–$250K+ depending on scope.",
            undefined,
            400
          );
          addBot(
            "Your consultant will walk through options during the discovery call and give you a clear picture — no hidden fees, no surprises.",
            undefined,
            1200
          );
        } else if (lower.includes('engagement') || lower.includes('typical') || lower.includes('process') || lower.includes('how do you work')) {
          addBot(
            "Typically it starts with a 2–3 week discovery and audit phase where we map your operations, identify AI opportunities, and prioritize by ROI. From there, we move into architecture, build, and deployment.",
            undefined,
            400
          );
          addBot(
            "Most engagements run 3–6 months from kickoff to production. We stay involved through deployment and usually transition to an ongoing advisory relationship.",
            undefined,
            1200
          );
        } else if (lower.includes('industr') || lower.includes('sector') || lower.includes('who do you work with') || lower.includes('client')) {
          addBot(
            "We work across financial services, healthcare, e-commerce, logistics, and enterprise SaaS. The common thread is companies with complex operations and enough scale where AI creates measurable impact — usually $1M+ in annual revenue.",
            undefined,
            400
          );
          addBot(
            "We've driven $340M+ in documented client impact across 47 engagements with an average 12x ROI. Our consultants come from backgrounds at FAANG, McKinsey, and top AI research labs.",
            undefined,
            1200
          );
        } else {
          addBot(
            "Good question. Our team will be able to give you a much more detailed answer on the discovery call. Is there anything else I can help with in the meantime?",
            ['How does pricing work?', 'What does a typical engagement look like?', 'What industries do you work with?']
          );
        }
        break;
      }
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
