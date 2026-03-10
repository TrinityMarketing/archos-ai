'use client';

import Link from 'next/link';
import Logo from '../../components/Logo/Logo';
import '../../views/BlogPages.css';

export default function TermsOfService() {
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
          <h1 className="article-title">Terms of Service</h1>
          <p className="article-excerpt">Last updated: March 10, 2026</p>
        </div>

        <div className="article-body">
          <h2 className="article-h2">Agreement to Terms</h2>
          <p className="article-p">
            By accessing or using the Archos AI website at archosai.com (the &quot;Site&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not access or use the Site.
          </p>

          <h2 className="article-h2">Services</h2>
          <p className="article-p">
            Archos AI provides enterprise AI consulting, strategy, automation, and deployment services. The information on the Site is provided for general informational purposes and does not constitute a binding offer or commitment. All engagements are subject to a separate written agreement between Archos AI and the client.
          </p>

          <h2 className="article-h2">Use of the Site</h2>
          <p className="article-p">
            You agree to use the Site only for lawful purposes and in a manner that does not infringe the rights of, restrict, or inhibit anyone else&apos;s use and enjoyment of the Site. You may not use the Site to transmit any unlawful, harmful, threatening, abusive, or otherwise objectionable material.
          </p>
          <p className="article-p">
            You agree not to attempt to gain unauthorized access to any part of the Site, its servers, or any systems or networks connected to the Site. You may not use any automated means, including bots, scrapers, or spiders, to access the Site for any purpose without our express written permission.
          </p>

          <h2 className="article-h2">Intellectual Property</h2>
          <p className="article-p">
            All content on the Site, including text, graphics, logos, images, and software, is the property of Archos AI or its content suppliers and is protected by United States and international intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, or otherwise exploit any content from the Site without our prior written consent.
          </p>

          <h2 className="article-h2">User Submissions</h2>
          <p className="article-p">
            When you submit information through our contact forms, chatbot, or other communication channels, you grant Archos AI the right to use that information to respond to your inquiry, provide services, and improve our offerings. We will handle your information in accordance with our Privacy Policy.
          </p>

          <h2 className="article-h2">Disclaimer of Warranties</h2>
          <p className="article-p">
            The Site and its content are provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind, either express or implied. Archos AI does not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components. We make no warranties or representations about the accuracy or completeness of the Site&apos;s content.
          </p>

          <h2 className="article-h2">Limitation of Liability</h2>
          <p className="article-p">
            To the fullest extent permitted by applicable law, Archos AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your access to or use of (or inability to access or use) the Site.
          </p>

          <h2 className="article-h2">Indemnification</h2>
          <p className="article-p">
            You agree to indemnify, defend, and hold harmless Archos AI and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your access to or use of the Site or your violation of these Terms.
          </p>

          <h2 className="article-h2">Governing Law</h2>
          <p className="article-p">
            These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Site shall be resolved in the courts of competent jurisdiction.
          </p>

          <h2 className="article-h2">Changes to These Terms</h2>
          <p className="article-p">
            We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the updated Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the Site after changes are posted constitutes your acceptance of the revised Terms.
          </p>

          <h2 className="article-h2">Contact Us</h2>
          <p className="article-p">
            If you have any questions about these Terms, please contact us at engage@archos.ai.
          </p>
        </div>
      </article>

      <footer className="blog-page-footer">
        <span>&copy; 2026 Archos AI. All rights reserved.</span>
      </footer>
    </div>
  );
}
