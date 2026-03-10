'use client';

import Link from 'next/link';
import Logo from '../../components/Logo/Logo';
import '../../views/BlogPages.css';

export default function PrivacyPolicy() {
  return (
    <div className="blog-page">
      <header className="blog-page-nav">
        <div className="blog-page-nav-inner">
          <Link href="/" className="blog-page-logo">
            <Logo />
            <span className="logo-wordmark">ARCHOS AI</span>
          </Link>
          <Link href="/" className="blog-page-back">Back to Home</Link>
        </div>
      </header>

      <article className="article">
        <div className="article-header">
          <h1 className="article-title">Privacy Policy</h1>
          <p className="article-excerpt">Last updated: March 10, 2026</p>
        </div>

        <div className="article-body">
          <h2 className="article-h2">Introduction</h2>
          <p className="article-p">
            Archos AI (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website archosai.com (the &quot;Site&quot;) or engage with our services.
          </p>
          <p className="article-p">
            By accessing the Site or using our services, you agree to the collection and use of information in accordance with this policy.
          </p>

          <h2 className="article-h2">Information We Collect</h2>
          <p className="article-p">
            <strong>Information you provide directly:</strong> When you fill out a contact form, use our chatbot, or otherwise communicate with us, we may collect your name, email address, company name, job title, annual revenue range, and any other information you choose to provide.
          </p>
          <p className="article-p">
            <strong>Information collected automatically:</strong> When you visit the Site, we may automatically collect certain information about your device and usage, including your IP address, browser type, operating system, referring URLs, pages viewed, time spent on pages, and other diagnostic data.
          </p>
          <p className="article-p">
            <strong>Cookies and tracking technologies:</strong> We use cookies and similar technologies to track activity on the Site and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. If you do not accept cookies, some portions of the Site may not function properly.
          </p>

          <h2 className="article-h2">How We Use Your Information</h2>
          <p className="article-p">We use the information we collect to:</p>
          <p className="article-p">
            Provide and maintain our services; respond to your inquiries and fulfill your requests; send you relevant information about our services, including follow-up communications; analyze usage patterns to improve our Site and services; comply with legal obligations; and protect against fraudulent, unauthorized, or illegal activity.
          </p>

          <h2 className="article-h2">How We Share Your Information</h2>
          <p className="article-p">
            We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating the Site and conducting our business, subject to confidentiality agreements. We may also disclose your information if required by law, regulation, legal process, or governmental request.
          </p>

          <h2 className="article-h2">Data Retention</h2>
          <p className="article-p">
            We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including to satisfy any legal, accounting, or reporting requirements. When your data is no longer needed, we will securely delete or anonymize it.
          </p>

          <h2 className="article-h2">Data Security</h2>
          <p className="article-p">
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or method of electronic storage is 100% secure.
          </p>

          <h2 className="article-h2">Your Rights</h2>
          <p className="article-p">
            Depending on your jurisdiction, you may have the right to access, correct, update, or delete your personal information. You may also have the right to object to or restrict certain processing of your data. To exercise any of these rights, please contact us at engage@archos.ai.
          </p>

          <h2 className="article-h2">Third-Party Links</h2>
          <p className="article-p">
            The Site may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policy of every site you visit.
          </p>

          <h2 className="article-h2">Changes to This Policy</h2>
          <p className="article-p">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. Your continued use of the Site after any changes constitutes your acceptance of the updated policy.
          </p>

          <h2 className="article-h2">Contact Us</h2>
          <p className="article-p">
            If you have any questions about this Privacy Policy, please contact us at engage@archos.ai.
          </p>
        </div>
      </article>

      <footer className="blog-page-footer">
        <span>&copy; 2026 Archos AI. All rights reserved.</span>
      </footer>
    </div>
  );
}
