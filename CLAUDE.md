Here's the prompt — paste this into Claude Code in Cursor:

---

Create a premium enterprise website for "Archos AI" — an AI consulting firm targeting companies doing $1M+ annually. The site should have 3 files: `index.html`, `styles.css`, and `main.js`.

**Design system:**
- Dark palette: bg `#0a0a0a`, cards `#141414`, borders `#1e1e1e`, text `#ededed`/`#8a8a8a`/`#5a5a5a`
- Warm gold accent: `#c8a97e` (not generic blue/purple)
- Fonts: Space Grotesk (headings, 700/600/500) + Inter (body, 300/400/500) from Google Fonts
- Tight letter-spacing on headlines (-0.03em), generous on labels (0.1-0.2em uppercase)
- 2px border-radius max — sharp, not rounded
- Generous whitespace, max-width 1280px

**Sections in order:**
1. **Nav** — fixed, transparent → blur on scroll. Logo SVG (triangle with inner circle), "ARCHOS AI" wordmark, links: Expertise, Results, Process, About, and "Start a Conversation" CTA button with gold border
2. **Hero** — full viewport. Eyebrow "Enterprise AI Consulting" with gold line. 3-line headline with staggered reveal animation: "We don't predict / the future of AI. / We build it." (last line in gold). Subtitle paragraph. Two buttons: "Schedule a Briefing" (solid gold) + "View Case Studies" (text with underline). Stats bar below: $340M+ impact, 47 engagements, 12x ROI — separated by vertical dividers
3. **Authority bar** — "Trusted by teams at" + sector labels: Fortune 500, Series C+, Global Enterprise, Government, Healthcare, Financial Services
4. **Expertise** — 2-column grid, 4 cards with gold top-line on hover: (01) AI Strategy & Roadmapping, (02) Custom Model Development, (03) MLOps & Infrastructure, (04) AI Agent & Automation Systems. Each has description + capability tags in bordered pills
5. **Results** — 3 case studies. Featured: Financial Services — 73% faster underwriting, $18M savings, 99.2% accuracy. Healthcare — 4x throughput, 96% accuracy. E-Commerce — 34% AOV increase, $52M revenue impact
6. **Process** — 4-step vertical timeline with connecting lines: Discovery & Audit (2-3 weeks), Architecture & Design (3-4 weeks), Build & Validate (6-12 weeks), Deploy & Scale (Ongoing)
7. **About** — 2-column: left has headline "Built by operators, not observers." Right has 3 paragraphs about FAANG/McKinsey background + credentials: 15+ years avg experience, 8 PhDs, 100% client retention
8. **Testimonial** — centered quote from CTO of $2.4B financial services firm
9. **Contact** — 2-column: left has headline + email (engage@archos.ai), right has form with fields: Full Name, Work Email, Company, Annual Revenue (dropdown: $1M-$5M through $500M+), Message, "Request a Briefing" submit button
10. **Footer** — logo, nav links, copyright 2026, Privacy/Terms links

**JavaScript interactions:**
- Cursor-following ambient glow (600px radial gradient, subtle gold, desktop only)
- Scroll reveal with IntersectionObserver (translateY 32px → 0, staggered siblings by 120ms)
- Nav background blur on scroll past 60px
- Active nav link highlighting based on scroll position
- Mobile hamburger menu with full-screen overlay and staggered link animations
- Smooth scroll to anchor sections
- Form submit feedback (button turns green "Sent — We'll be in touch" for 4 seconds)

**Key principles:** No rounded corners, no gradients on buttons, no emoji, no generic startup aesthetic. This should feel like McKinsey meets DeepMind — authoritative, precise, engineered. Every element earns its space.

After creating the files, run `npx vercel deploy --prod` to deploy and give me the live URL.
