'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoUrl } from './utils/logo';

export default function LoginPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin'
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';
      const res = await fetch(`${base}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      if (!res.ok) {
        setError('Invalid credentials.');
        return;
      }
      const data = await res.json();
      if (data?.mfaRequired) {
        localStorage.setItem('user', JSON.stringify({
          email: formData.email,
          role: formData.role,
          name: formData.email.split('@')[0],
          rememberMe
        }));
        router.push('/mfa');
      } else if (data?.accessToken) {
        localStorage.setItem('token', data.accessToken);
        router.push('/terms');
      } else {
        setError('Unexpected response.');
      }
    } catch (err) {
      setError('Unable to contact server.');
    }
  };


  return (
    <div id="login-page-container"
      className="flex items-center justify-center min-h-[900px] p-4">
      <main id="login-main"
        className="w-full max-w-6xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div id="info-panel"
          className="relative bg-mf-primary text-white p-12 hidden md:flex flex-col justify-between h-[800px]">
          <div className="absolute inset-0 z-0"><img
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/c702e0abcd-9bd60ee11c43cb902b16.png"
              alt="A professional, slightly blurred background photograph of the Boston skyline at dusk, with a blue and gold overlay, conveying a sense of hope and officiality, minimalist style."
              className="w-full h-full object-cover opacity-10"/></div>
          <div className="relative z-10">
            <h1 id="platform-title" className="text-3xl font-bold tracking-tight">
              Youth Supervision Platform</h1>
            <p id="platform-subtitle" className="text-mf-primary-lighter mt-2">
              Commonwealth of Massachusetts</p>
          </div>
          <div id="mission-statement" className="relative z-10 max-w-md">
            <h2 className="text-lg font-semibold text-mf-highlight">Our Mission</h2>
            <p className="mt-2 text-mf-primary-lightest leading-relaxed">
              As the Juvenile Justice agency for the Commonwealth of
              Massachusetts, the Department of Youth Services promotes positive
              change in the youth in our care and custody by engaging in
              partnerships with communities, families, and government and
              provider agencies.
            </p>
          </div>
          <div className="relative z-10 text-xs text-mf-primary-lighter">
            © 2025 Commonwealth of Massachusetts. All rights reserved.
          </div>
        </div>
        <div id="login-form-panel"
          className="p-8 sm:p-12 flex flex-col justify-center h-[800px]">
          <div id="login-header" className="text-center mb-8"><img
              src={logoUrl}
              alt="DYS Logo" className="mx-auto h-24 w-24 mb-4" id="ihaaj"/>
            <h2 className="text-2xl font-bold text-mf-font-base">Department of Youth
              Services</h2>
            <p className="text-mf-font-detail mt-2">Sign in with your state-issued
              credentials.</p>
          </div>
          <form id="login-form" action="#" method="POST" onSubmit={handleSubmit} className="space-y-6">
            <div id="email-input-group"><label htmlFor="email"
                className="block text-sm font-medium text-mf-font-detail">State
                Government Email</label>
              <div className="mt-1 relative"><span
                  className="absolute inset-y-0 left-0 flex items-center pl-3"><i
                    className="fa-solid fa-envelope text-gray-400"></i></span><input
                  id="email" name="email" type="email" autoComplete="email"
                  required placeholder="your.email@mass.gov"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="block w-full pl-10 pr-3 py-3 border border-mf-bd-input rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mf-focus focus:border-mf-focus sm:text-sm"/>
              </div>
            </div>
            <div id="password-input-group"><label htmlFor="password"
                className="block text-sm font-medium text-mf-font-detail">Password</label>
              <div className="mt-1 relative"><span
                  className="absolute inset-y-0 left-0 flex items-center pl-3"><i
                    className="fa-solid fa-lock text-gray-400"></i></span><input
                  id="password" name="password" type="password"
                  autoComplete="current-password" required
                  placeholder="••••••••"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="block w-full pl-10 pr-3 py-3 border border-mf-bd-input rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mf-focus focus:border-mf-focus sm:text-sm"/>
              </div>
            </div>
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
            <div id="login-action-group"><button type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mf-primary hover:bg-mf-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mf-primary-light transition-colors duration-300">
                Sign In
              </button></div>
          </form>
          <div id="support-links" className="mt-8 text-center">
            <div className="text-xs text-mf-font-detail">
              <a href="/support" className="font-medium text-mf-font-link hover:text-mf-primary">Contact IT Support</a>
            </div>
          </div>
          <footer id="footer" className="mt-12 text-center text-xs text-gray-400">
            <p>This is an official Commonwealth of Massachusetts application.
            </p>
            <p>Unauthorized access is strictly prohibited.</p>
          </footer>
        </div>
      </main>
    </div>
    
  );
}
