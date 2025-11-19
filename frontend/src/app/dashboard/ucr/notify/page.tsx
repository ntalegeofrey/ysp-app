'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UCRNotifyPage() {
  const router = useRouter();
  const search = useSearchParams();

  const [programId, setProgramId] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [priority, setPriority] = useState<string>('critical');
  const [category, setCategory] = useState<string>('HVAC');
  const [categoryOther, setCategoryOther] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('');
  const [senderTitle, setSenderTitle] = useState<string>('');
  const [status, setStatus] = useState<{ tone: 'idle' | 'success' | 'error'; text: string }>({ tone: 'idle', text: '' });

  useEffect(() => {
    try {
      const spRaw = typeof window !== 'undefined' ? localStorage.getItem('selectedProgram') : null;
      const sp = spRaw ? JSON.parse(spRaw) as { id?: number|string } : null;
      setProgramId(sp?.id ? String(sp.id) : '');
    } catch {}

    const run = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const r = await fetch('/api/auth/me', { credentials: 'include', headers: { 'Accept': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
        if (r.ok) {
          const me = await r.json();
          setSenderName(me.fullName || me.email || '');
          setSenderTitle(me.jobTitle || '');
        }
      } catch {}
    };
    run();
  }, []);

  const reportId = search.get('reportId');
  const reportDate = search.get('date');
  const reportShift = search.get('shift');
  const reportStatus = search.get('status');
  const reportSummary = search.get('summary');

  useEffect(() => {
    // Prefill subject and message from linked UCR if present
    if (reportSummary && !subject) {
      const base = reportStatus ? `${reportStatus.toUpperCase()}: ${reportSummary}` : reportSummary;
      const suffix = [reportDate, reportShift].filter(Boolean).join(' ');
      setSubject(suffix ? `${base} - ${suffix}` : base);
    }
    if (reportSummary && !message) {
      const lines = [
        `Issue: ${reportSummary}`,
        reportDate ? `Date: ${reportDate}` : '',
        reportShift ? `Shift: ${reportShift}` : '',
      ].filter(Boolean);
      setMessage(lines.join('\n') + (lines.length ? '\n\n' : '') + 'Please review this Unit Condition Report issue.');
    }
  }, [reportSummary, reportDate, reportShift, reportStatus, subject, message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!programId) {
      setStatus({ tone: 'error', text: 'No program selected.' });
      return;
    }
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const body = {
        subject: subject || undefined,
        priority,
        category,
        categoryOther: category === 'Other' ? categoryOther : undefined,
        message,
        reportId: reportId || undefined,
        reportDate: reportDate || undefined,
        shift: reportShift || undefined,
      };
      const r = await fetch(`/api/programs/${programId}/ucr/notify`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        setStatus({ tone: 'error', text: 'Failed to send notification.' });
        return;
      }
      setStatus({ tone: 'success', text: 'Notification sent to program leadership.' });
      setTimeout(() => router.back(), 1200);
    } catch {
      setStatus({ tone: 'error', text: 'Failed to send notification.' });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Issue Summary */}
      <section className="bg-white rounded-lg border border-bd">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-error p-3 rounded-full">
              <i className="fa-solid fa-triangle-exclamation text-white text-xl"></i>
            </div>
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="bg-error text-white text-xs font-bold px-2 py-1 rounded-full mr-3">CRITICAL</span>
                <h3 className="text-lg font-semibold text-font-base">HVAC System Failure - North Wing</h3>
              </div>
              <p className="text-sm text-font-detail mb-2">Reported 3 times in the last 7 days. Temperature complaints increasing.</p>
              <p className="text-xs text-font-medium">Last reported: Today, 2:30 PM by J. Smith</p>
            </div>
          </div>
        </div>
      </section>

      {/* Notification Form */}
      <section className="bg-white rounded-lg border border-bd">
        <div className="p-6 border-b border-bd">
          <h3 className="text-lg font-semibold text-font-base">Supervisor Notification Form</h3>
          <p className="text-sm text-font-detail mt-1">This notification will be sent via email and push notification</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">
                <i className="fa-solid fa-user-tie mr-2 text-primary"></i>
                Notify Supervisor
              </label>
              <select className="w-full px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                <option>Michael Rodriguez - Facility Manager</option>
                <option>Sarah Thompson - Assistant Director</option>
                <option>David Chen - Maintenance Supervisor</option>
                <option>Lisa Johnson - Program Director</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-font-base mb-2">
                <i className="fa-solid fa-flag mr-2 text-error"></i>
                Priority Level
              </label>
              <select
                className="w-full px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="critical">Critical - Immediate Action Required</option>
                <option value="high">High - Action Required Today</option>
                <option value="medium">Medium - Action Required This Week</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-font-base mb-2">
              <i className="fa-solid fa-tags mr-2 text-primary"></i>
              Issue Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['HVAC','Plumbing','Electrical','Security','Safety','Structural','Equipment','Other'].map((c) => (
                <label key={c} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="category"
                    className="text-primary focus:ring-primary"
                    checked={category === c}
                    onChange={() => setCategory(c)}
                  />
                  <span>{c}</span>
                </label>
              ))}
            </div>
            {category === 'Other' && (
              <div className="mt-3">
                <input
                  type="text"
                  value={categoryOther}
                  onChange={(e) => setCategoryOther(e.target.value)}
                  placeholder="Describe the issue"
                  className="w-full px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-font-base mb-2">
              <i className="fa-solid fa-heading mr-2 text-primary"></i>
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject line for email"
              className="w-full px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-font-base mb-2">
              <i className="fa-solid fa-comment mr-2 text-primary"></i>
              Additional Comments & Details
            </label>
            <textarea
              rows={6}
              className="w-full px-3 py-2 border border-bd rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              placeholder="Provide additional context, urgency details, affected areas, safety concerns, or specific actions needed..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-font-base mb-3">
              <i className="fa-solid fa-bell mr-2 text-primary"></i>
              Notification Preferences
            </label>
            <div className="space-y-3 text-sm">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="text-primary focus:ring-primary rounded" />
                <span className="text-font-detail">Send email notification immediately</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="text-primary focus:ring-primary rounded" />
                <span className="text-font-detail">Send push notification to mobile device</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="text-primary focus:ring-primary rounded" />
                <span className="text-font-detail">Also notify Assistant Director</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="text-primary focus:ring-primary rounded" />
                <span className="text-font-detail">Create follow-up reminder in 2 hours if unacknowledged</span>
              </label>
            </div>
          </div>

          <div className="bg-primary-lightest p-4 rounded-lg text-sm">
            <h4 className="font-medium text-font-base mb-2">
              <i className="fa-solid fa-info-circle mr-2 text-primary"></i>
              Your Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-font-detail">Name:</span>
                <span className="font-medium text-font-base ml-2">{senderName || '—'}</span>
              </div>
              <div>
                <span className="text-font-detail">Position:</span>
                <span className="font-medium text-font-base ml-2">{senderTitle || '—'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-bd">
            <button type="button" onClick={() => router.back()} className="px-6 py-2 text-font-detail border border-bd rounded-lg hover:bg-bg-subtle transition-colors duration-200">
              <i className="fa-solid fa-times mr-2"></i>
              Cancel
            </button>
            <div className="flex gap-3">
              <button type="button" className="px-6 py-2 bg-primary-lighter text-font-base border border-bd rounded-lg hover:bg-primary-lightest transition-colors duration-200">
                <i className="fa-solid fa-eye mr-2"></i>
                Preview
              </button>
              <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors duration-200 font-medium">
                <i className="fa-solid fa-paper-plane mr-2"></i>
                Send Notification
              </button>
            </div>
          </div>
          {status.tone !== 'idle' && (
            <div className={`mt-4 text-sm px-3 py-2 rounded-md border ${status.tone === 'success' ? 'border-success text-success bg-green-50' : 'border-error text-error bg-red-50'}`}>
              {status.text}
            </div>
          )}
        </form>
      </section>
    </div>
  );
}
