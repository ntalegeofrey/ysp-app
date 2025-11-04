'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin'
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify({
      email: formData.email,
      role: formData.role,
      name: formData.email.split('@')[0],
      rememberMe
    }));
    router.push('/dashboard');
  };


  return (
    <div className="min-h-screen bg-bg-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-4">
            <i className="fa-solid fa-shield text-white text-4xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Mass. DYS</h1>
          <p className="text-font-detail">Youth Supervisory Platform</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-font-heading mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-bd-input rounded-lg focus:ring-2 focus:ring-focus focus:border-transparent outline-none transition"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your.email@mass.gov"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-font-base mb-2">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-bd-input rounded-lg focus:ring-2 focus:ring-focus focus:border-transparent outline-none transition"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-font-base mb-2">
                Role
              </label>
              <select
                className="w-full px-4 py-3 border border-bd-input rounded-lg focus:ring-2 focus:ring-focus focus:border-transparent outline-none transition"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="admin">Administrator</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
                <option value="supervisor">Supervisor</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary border-bd-input rounded focus:ring-focus"
                />
                <span className="ml-2 text-sm text-font-detail">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-sm text-font-link hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-light transition duration-200 font-medium"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-font-detail">
              Need help? <a href="/contact-support" className="text-font-link hover:underline">Contact Support</a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-font-detail">
          <p>© 2024 Massachusetts Department of Youth Services</p>
          <p className="mt-1">
            <a href="/terms" className="hover:underline">Terms of Use</a>
            {' • '}
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
