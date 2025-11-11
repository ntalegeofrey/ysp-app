"use client";

import { useEffect, useRef, useState } from 'react';
import { logoUrl } from '../utils/logo';

export default function TermsPage() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => {
      const isNearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
      setScrolledToBottom(isNearBottom);
    };
    el.addEventListener('scroll', onScroll);
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const canContinue = scrolledToBottom && accepted;

  return (
    <div className="bg-gray-50 min-h-screen hero-pattern">
      <header className="bg-white shadow-sm border-b border-bd">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <img src={logoUrl} alt="DYS Logo" className="w-14 h-14 mr-4" />
              <div>
                <h1 className="text-xl font-bold text-primary">Commonwealth of Massachusetts</h1>
                <p className="text-sm text-font-detail">Department of Youth Services</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="terms-container max-w-4xl w-full bg-white rounded-2xl shadow-xl border border-bd overflow-hidden">
          <div className="bg-primary text-white p-8 text-center relative">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-file-contract text-3xl"></i>
            </div>
            <h2 className="text-3xl font-bold mb-2">Terms of Service & User Agreement</h2>
            <p className="text-primary-lightest">Youth Supervisory Platform (YSP)</p>
          </div>

          <div className="p-8">
            <div
              id="terms-content"
              ref={contentRef}
              className="prose prose-sm max-w-none text-font-base leading-relaxed max-h-[400px] overflow-y-auto border border-bd rounded-md p-4"
            >
              <h3 className="text-lg font-semibold text-font-heading mb-4">1. ACCEPTANCE OF TERMS</h3>
              <p className="mb-4">By accessing and using the Youth Supervisory Platform (YSP), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and all applicable laws and regulations. These terms constitute a legally binding agreement between you and the Commonwealth of Massachusetts Department of Youth Services.</p>

              <h3 className="text-lg font-semibold text-font-heading mb-4">2. AUTHORIZED USE ONLY</h3>
              <p className="mb-4">The YSP is restricted to authorized personnel of the Massachusetts Department of Youth Services and affiliated contractors. Unauthorized access, use, or disclosure of this system is strictly prohibited and may result in criminal prosecution under state and federal law.</p>

              <h3 className="text-lg font-semibold text-font-heading mb-4">3. CONFIDENTIALITY AND PRIVACY</h3>
              <p className="mb-4">All information accessed through the YSP is confidential and protected under various state and federal privacy laws. Users must maintain strict confidentiality, access only information necessary for job functions, and report any suspected security breaches immediately.</p>

              <h3 className="text-lg font-semibold text-font-heading mb-4">4. DATA SECURITY AND MONITORING</h3>
              <p className="mb-4">All system activities are logged and monitored for security and compliance purposes. The Commonwealth reserves the right to monitor, review, and audit all user activities. Users have no expectation of privacy when using this system.</p>

              <h3 className="text-lg font-semibold text-font-heading mb-4">5. ACCEPTABLE USE POLICY</h3>
              <p className="mb-4">Users agree to use the YSP only for legitimate business purposes related to youth supervision and care. Prohibited activities include accessing information beyond job requirements, attempting to circumvent security measures, and sharing confidential information outside authorized channels.</p>

              <h3 className="text-lg font-semibold text-font-heading mb-4">6. MANDATORY REPORTING</h3>
              <p className="mb-4">Users acknowledge their mandatory reporting obligations under Massachusetts law regarding child abuse, neglect, and other incidents. The YSP facilitates but does not replace these legal obligations.</p>

              <h3 className="text-lg font-semibold text-font-heading mb-4">7. SYSTEM AVAILABILITY</h3>
              <p className="mb-4">While the Commonwealth strives to maintain system availability, users acknowledge that the YSP may be subject to scheduled maintenance, unexpected downtime, or emergency shutdowns.</p>

              <h3 className="text-lg font-semibold text-font-heading mb-4">8. TRAINING AND COMPETENCY</h3>
              <p className="mb-4">Users certify that they have received appropriate training on the YSP and understand their responsibilities. Continued access requires maintaining current training certifications and following all established protocols.</p>

              <h3 className="text-lg font-semibold text-font-heading mb-4">9. VIOLATIONS AND CONSEQUENCES</h3>
              <p className="mb-4">Violations of these terms may result in immediate suspension of system access, disciplinary action up to and including termination of employment, and potential criminal prosecution.</p>

              <h3 className="text-lg font-semibold text-font-heading mb-4">10. UPDATES AND MODIFICATIONS</h3>
              <p className="mb-4">These terms may be updated periodically. Users will be notified of significant changes and must re-acknowledge acceptance. Continued use after notification constitutes acceptance of updated terms.</p>

              <div className="bg-primary-lightest p-4 rounded-lg mt-6">
                <p className="text-sm text-font-detail text-center">
                  <strong>Last Updated:</strong> November 2024<br />
                  <strong>Version:</strong> 2.1<br />
                  <strong>Contact:</strong> DYS IT Support - (617) 960-3000
                </p>
              </div>
            </div>

            <div id="scroll-indicator" className={`scroll-indicator text-center py-4 ${scrolledToBottom ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
              <div className="flex items-center justify-center text-primary">
                <i className="fa-solid fa-arrow-down animate-bounce mr-2"></i>
                <span className="text-sm font-medium">Please scroll to read all terms</span>
              </div>
            </div>

            <div className="border-t border-bd pt-6 mt-6">
              <div className="flex items-start space-x-3 mb-6">
                <input type="checkbox" id="accept-terms" className="mt-1 w-5 h-5 text-primary border-bd-input rounded focus:ring-primary focus:ring-2" onChange={(e) => setAccepted(e.target.checked)} />
                <label htmlFor="accept-terms" className="text-font-base leading-relaxed cursor-pointer">
                  I acknowledge that I have read, understood, and agree to comply with all terms and conditions outlined above. I understand that violation of these terms may result in disciplinary action and/or criminal prosecution.
                </label>
              </div>
              <div className="flex justify-center">
                <button
                  id="continue-btn"
                  disabled={!canContinue}
                  className="accept-button bg-primary text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => (window.location.href = '/program-selection')}
                >
                  <i className="fa-solid fa-arrow-right mr-2"></i>
                  Continue to Platform
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-bd">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="text-center">
            <p className="text-xs text-font-detail">© 2024 Commonwealth of Massachusetts Department of Youth Services. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .hero-pattern { background-image: radial-gradient(circle at 20% 50%, rgba(20,85,143,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(56,133,87,0.05) 0%, transparent 50%); }
        .scroll-indicator { opacity: 0; }
      `}</style>
    </div>
  );
}
