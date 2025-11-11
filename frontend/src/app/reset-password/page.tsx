'use client';

import { useState } from 'react';
import Link from 'next/link';
import { logoUrl } from '../utils/logo';

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    // In a real app, call reset API, then go back to sign in
    window.location.href = '/';
  };

  return (
    <div id="reset-password-page-container" className="flex items-center justify-center min-h-[900px] p-4">
      <main id="reset-password-main" className="w-full max-w-6xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div id="info-panel" className="relative bg-mf-primary text-white p-12 hidden md:flex flex-col justify-between h-[800px]">
          <div className="absolute inset-0 z-0">
            <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/c702e0abcd-bf50cc5fe7d79e6fe0d5.png" alt="Boston skyline background" className="w-full h-full object-cover opacity-10" />
          </div>
          <div className="relative z-10">
            <h1 id="platform-title" className="text-3xl font-bold tracking-tight">Youth Supervision Platform</h1>
            <p id="platform-subtitle" className="text-mf-primary-lighter mt-2">Commonwealth of Massachusetts</p>
          </div>
          <div id="mission-statement" className="relative z-10 max-w-md">
            <h2 className="text-lg font-semibold text-mf-highlight">Our Mission</h2>
            <p className="mt-2 text-mf-primary-lightest leading-relaxed">
              As the Juvenile Justice agency for the Commonwealth of Massachusetts, the Department of Youth Services promotes positive change in the youth in our care and custody by engaging in partnerships with communities, families, and government and provider agencies.
            </p>
          </div>
          <div className="relative z-10 text-xs text-mf-primary-lighter">© 2025 Commonwealth of Massachusetts. All rights reserved.</div>
        </div>
        <div id="reset-password-form-panel" className="p-8 sm:p-12 flex flex-col justify-center h-[800px]">
          <div id="reset-password-header" className="text-center mb-8">
            <img src={logoUrl} alt="DYS Logo" className="mx-auto h-24 w-24 mb-4" />
            <h2 className="text-2xl font-bold text-mf-font-base">Reset Password</h2>
            <p className="text-mf-font-detail mt-2">Choose a new password for your account.</p>
          </div>
          <form id="reset-password-form" onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-sm text-red-600">{error}</div>}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-mf-font-detail">New Password</label>
              <input id="password" type="password" required placeholder="••••••••" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} className="mt-1 block w-full px-3 py-3 border border-mf-bd-input rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mf-focus focus:border-mf-focus sm:text-sm" />
            </div>
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-mf-font-detail">Confirm Password</label>
              <input id="confirm" type="password" required placeholder="••••••••" value={form.confirm} onChange={(e)=>setForm({...form, confirm: e.target.value})} className="mt-1 block w-full px-3 py-3 border border-mf-bd-input rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mf-focus focus:border-mf-focus sm:text-sm" />
            </div>
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mf-primary hover:bg-mf-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mf-primary-light transition-colors duration-300">
              Save New Password
            </button>
          </form>
          <div className="mt-8 text-center text-sm">
            <Link href="/" className="font-medium text-mf-font-link hover:text-mf-primary">Back to Sign In</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
