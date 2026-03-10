import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Archos AI - Enterprise AI Consulting & Automation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: '#0a0a0a',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #c8a97e, transparent)',
          }}
        />

        {/* Logo triangle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '48px',
          }}
        >
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
            <path d="M16 2L30 28H2L16 2Z" stroke="#c8a97e" strokeWidth="2" fill="none" />
            <circle cx="16" cy="18" r="5" stroke="#c8a97e" strokeWidth="1.5" fill="none" />
          </svg>
          <span
            style={{
              fontSize: '24px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: '#ededed',
            }}
          >
            ARCHOS AI
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: '#ededed',
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span>Enterprise AI</span>
          <span style={{ color: '#c8a97e' }}>Consulting & Automation</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '24px',
            fontWeight: 300,
            color: '#8a8a8a',
            lineHeight: 1.5,
            maxWidth: '700px',
          }}
        >
          Strategy, integration, and deployment for businesses doing $1M+ annually.
        </div>

        {/* Bottom stats */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '80px',
            display: 'flex',
            gap: '64px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '32px', fontWeight: 700, color: '#ededed' }}>$340M+</span>
            <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.15em', color: '#5a5a5a', textTransform: 'uppercase' }}>Client Impact</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '32px', fontWeight: 700, color: '#ededed' }}>47</span>
            <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.15em', color: '#5a5a5a', textTransform: 'uppercase' }}>Engagements</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '32px', fontWeight: 700, color: '#ededed' }}>12x</span>
            <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.15em', color: '#5a5a5a', textTransform: 'uppercase' }}>Average ROI</span>
          </div>
        </div>

        {/* Bottom border */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: '#1e1e1e',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
