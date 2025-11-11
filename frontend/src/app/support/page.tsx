'use client';

import Link from 'next/link';

export default function SupportPage() {
  return (
    <div id="support-page-container" className="flex items-center justify-center min-h-[900px] p-4">
      <main id="support-main" className="w-full max-w-6xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div id="info-panel" className="relative bg-mf-primary text-white p-12 hidden md:flex flex-col justify-between h-[800px]">
          <div className="absolute inset-0 z-0">
            <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/c702e0abcd-09620232848312c53a58.png" alt="Boston skyline background" className="w-full h-full object-cover opacity-10" />
          </div>
          <div className="relative z-10">
            <h1 id="platform-title" className="text-3xl font-bold tracking-tight">Youth Supervision Platform</h1>
            <p id="platform-subtitle" className="text-mf-primary-lighter mt-2">Commonwealth of Massachusetts</p>
          </div>
          <div id="mission-statement" className="relative z-10 max-w-md">
            <h2 className="text-lg font-semibold text-mf-highlight">Our Mission</h2>
            <p className="mt-2 text-mf-primary-lightest leading-relaxed">As the Juvenile Justice agency for the Commonwealth of Massachusetts, the Department of Youth Services promotes positive change in the youth in our care and custody by engaging in partnerships with communities, families, and government and provider agencies.</p>
          </div>
          <div className="relative z-10 text-xs text-mf-primary-lighter">© 2025 Commonwealth of Massachusetts. All rights reserved.</div>
        </div>
        <div id="support-content-panel" className="p-8 sm:p-12 flex flex-col justify-center h-[800px] overflow-y-auto">
          <div id="support-header" className="text-center mb-8">
            <h2 className="text-2xl font-bold text-mf-font-base">Support & Resources</h2>
            <p className="text-mf-font-detail mt-2">We're here to help. Find the resources you need or get in touch with our support team.</p>
          </div>
          <div id="support-sections-container" className="space-y-8">
            <section id="contact-info-section">
              <h3 className="text-lg font-semibold text-mf-font-base border-b border-mf-bd pb-2 mb-4">Contact Support</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div id="it-help-desk-card" className="bg-mf-primary-lightest p-4 rounded-lg border border-mf-bd">
                  <h4 className="font-bold text-mf-primary flex items-center">
                    <i className="fa-solid fa-headset mr-2"></i>
                    IT Help Desk
                  </h4>
                  <p className="text-sm text-mf-font-detail my-2">For technical issues, login problems, or application errors.</p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center">
                      <i className="fa-solid fa-envelope w-4 mr-2 text-mf-primary-light"></i>
                      <a href="mailto:DYS.HelpDesk@mass.gov" className="text-mf-font-link hover:underline">DYS.HelpDesk@mass.gov</a>
                    </p>
                    <p className="flex items-center">
                      <i className="fa-solid fa-phone w-4 mr-2 text-mf-primary-light"></i>
                      (617) 555-0101
                    </p>
                  </div>
                </div>
                <div id="general-inquiries-card" className="bg-mf-primary-lightest p-4 rounded-lg border border-mf-bd">
                  <h4 className="font-bold text-mf-primary flex items-center">
                    <i className="fa-solid fa-circle-info mr-2"></i>
                    General Inquiries
                  </h4>
                  <p className="text-sm text-mf-font-detail my-2">For questions about platform usage, data, or policies.</p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center">
                      <i className="fa-solid fa-envelope w-4 mr-2 text-mf-primary-light"></i>
                      <a href="mailto:DYS.Info@mass.gov" className="text-mf-font-link hover:underline">DYS.Info@mass.gov</a>
                    </p>
                    <p className="flex items-center">
                      <i className="fa-solid fa-phone w-4 mr-2 text-mf-primary-light"></i>
                      (617) 555-0102
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-center text-mf-font-detail mt-4">Support is available Monday - Friday, 8:00 AM - 5:00 PM EST, excluding state holidays.</p>
            </section>
            <section id="self-service-section">
              <h3 className="text-lg font-semibold text-mf-font-base border-b border-mf-bd pb-2 mb-4">Self-Service Resources</h3>
              <div className="space-y-3">
                <Link href="/forgot-password" className="flex items-center justify-between p-4 bg-white border border-mf-bd rounded-lg hover:bg-mf-bg-subtle hover:border-mf-primary-light transition-colors duration-200">
                  <div className="flex items-center">
                    <i className="fa-solid fa-key text-mf-primary text-xl mr-4"></i>
                    <div>
                      <p className="font-semibold text-mf-font-link">Forgot or Reset Password</p>
                      <p className="text-sm text-mf-font-detail">Click here to start the password recovery process.</p>
                    </div>
                  </div>
                  <i className="fa-solid fa-arrow-right text-gray-400"></i>
                </Link>
                <a href="#" className="flex items-center justify-between p-4 bg-white border border-mf-bd rounded-lg hover:bg-mf-bg-subtle hover:border-mf-primary-light transition-colors duration-200">
                  <div className="flex items-center">
                    <i className="fa-solid fa-book-open text-mf-primary text-xl mr-4"></i>
                    <div>
                      <p className="font-semibold text-mf-font-link">User Guides & Documentation</p>
                      <p className="text-sm text-mf-font-detail">Access detailed guides and platform manuals.</p>
                    </div>
                  </div>
                  <i className="fa-solid fa-arrow-right text-gray-400"></i>
                </a>
              </div>
            </section>
          </div>
          <footer id="footer" className="mt-auto pt-8 text-center">
            <Link href="/" className="text-sm font-medium text-mf-font-link hover:text-mf-primary">
              <i className="fa-solid fa-arrow-left mr-1"></i>
              Back to Sign In
            </Link>
            <p className="text-xs text-gray-400 mt-4">This is an official Commonwealth of Massachusetts application.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
