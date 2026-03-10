import { useState, useEffect } from 'react';
import './CookieBanner.css';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setVisible(true);
  }, []);

  function handle(choice) {
    localStorage.setItem('cookie-consent', choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-inner">
        <p className="cookie-banner-text">
          We use cookies to enhance your experience and analyze site traffic. By
          clicking "Accept" you consent to our use of cookies.
        </p>
        <div className="cookie-banner-actions">
          <button className="cookie-btn cookie-btn-deny" onClick={() => handle('denied')}>
            Deny
          </button>
          <button className="cookie-btn cookie-btn-accept" onClick={() => handle('accepted')}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
