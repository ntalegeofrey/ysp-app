'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoUrl } from '../utils/logo';

export default function MFAPage() {
  const router = useRouter();
  const inputsRef = useRef<(HTMLInputElement | null)[]>(new Array(5).fill(null));
  const [code, setCode] = useState<string[]>(['', '', '', '', '']);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleInput = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < 4) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5);
    const arr = text.split('');
    const next = ['','','','',''];
    for (let i=0; i<arr.length; i++) next[i] = arr[i];
    setCode(next);
    const focusIndex = Math.min(arr.length, 4);
    inputsRef.current[focusIndex]?.focus();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const value = code.join('');
    if (value.length !== 5) {
      setError('Please enter the 5-digit code.');
      return;
    }
    try {
      setVerifying(true);
      const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const email = user?.email;
      const res = await fetch(`${base}/auth/mfa/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: value })
      });
      if (!res.ok) {
        setError('Invalid or expired code.');
        return;
      }
      const data = await res.json();
      if (data?.accessToken) {
        localStorage.setItem('token', data.accessToken);
        router.push('/terms');
      } else {
        setError('Unexpected response.');
      }
    } catch (err) {
      setError('Unable to contact server.');
    } finally {
      setVerifying(false);
    }
  };

  const resend = async () => {
    setError('');
    try {
      setSending(true);
      const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const email = user?.email;
      const res = await fetch(`${base}/auth/mfa/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) setError('Unable to resend code.');
    } catch (e) {
      setError('Unable to resend code.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div id="mfa-screen-container" className="flex flex-col items-center justify-center min-h-[900px] p-6">
      <header className="w-full max-w-md mb-8 text-center">
        <img src={logoUrl} alt="Department of Youth Services" className="mx-auto h-24 w-24 object-contain" />
      </header>
      <main className="w-full max-w-md bg-white rounded-lg shadow-md p-8 border border-bd">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-font-base mb-2">Two-Factor Authentication</h1>
          <p className="text-font-detail mb-6">A 5-digit verification code has been sent to your registered email. Enter it below.</p>
          <form onSubmit={submit}>
            <div className="flex justify-center gap-3 mb-6">
              {[0,1,2,3,4].map((i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={code[i]}
                  onChange={(e)=>handleInput(i, e.target.value)}
                  onKeyDown={(e)=>handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  ref={(el: HTMLInputElement | null) => { inputsRef.current[i] = el; }}
                  className="code-input w-12 h-14 text-center text-xl border border-bd-input rounded-md focus:outline-none focus:ring-2 focus:ring-mf-focus focus:border-mf-focus"
                />
              ))}
            </div>
            {error && <div className="text-sm text-red-600 mb-4">{error}</div>}
            <button disabled={verifying} type="submit" className="w-full bg-mf-primary text-white font-bold py-3 px-4 rounded-md hover:bg-mf-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mf-focus transition-colors duration-300 disabled:opacity-60">
              Verify Code
            </button>
            <div className="mt-4">
              <button type="button" disabled={sending} onClick={resend} className="text-sm text-font-link hover:text-mf-primary disabled:opacity-60">
                {sending ? 'Resending…' : 'Resend code'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <footer className="mt-8 text-center text-font-detail text-sm">
        <p>© 2025 Commonwealth of Massachusetts. All rights reserved.</p>
      </footer>
    </div>
  );
}
