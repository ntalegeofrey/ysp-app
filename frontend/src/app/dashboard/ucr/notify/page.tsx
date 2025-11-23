'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UCRNotifyPage() {
  const router = useRouter();
  const search = useSearchParams();

  const [programId, setProgramId] = useState<string>('');
  const [subjectLine, setSubjectLine] = useState<string>('');
  const [priorityLevel, setPriorityLevel] = useState<string>('');
  const [issueCategory, setIssueCategory] = useState<string>('');
  const [issueTitle, setIssueTitle] = useState<string>('');
  const [issueSummary, setIssueSummary] = useState<string>('');
  const [additionalComments, setAdditionalComments] = useState<string>('');
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
    if (!reportSummary) return;

    // Derive category and title from "Label: Comment" style summary
    const parts = reportSummary.split(':');
    const label = parts[0]?.trim() || '';
    const comment = parts.slice(1).join(':').trim();

    const derivedCategory = label || issueCategory;
    const derivedTitle = comment || reportSummary;

    // Derive priority level from status (e.g. "Critical", "High Priority")
    let derivedPriority = '';
    if (reportStatus) {
      const s = reportStatus.toLowerCase();
      if (s.includes('critical')) derivedPriority = 'Critical';
      else if (s.includes('high')) derivedPriority = 'High';
      else if (s.includes('medium')) derivedPriority = 'Medium';
      else derivedPriority = 'Normal';
    }

    const datePart = reportDate || '';
    const shiftPart = reportShift || '';
    const suffix = [datePart, shiftPart].filter(Boolean).join(' ');
    const priorityPrefix = derivedPriority ? `${derivedPriority.toUpperCase()}: ` : '';
    const subjectBase = derivedCategory && derivedTitle
      ? `${priorityPrefix}${derivedCategory}: ${derivedTitle}`
      : `${priorityPrefix}${reportSummary}`;
    const fullSubject = suffix ? `${subjectBase} - ${suffix}` : subjectBase;

    if (!subjectLine) setSubjectLine(fullSubject);
    if (!priorityLevel && derivedPriority) setPriorityLevel(derivedPriority);
    if (!issueCategory && derivedCategory) setIssueCategory(derivedCategory);
    if (!issueTitle && derivedTitle) setIssueTitle(derivedTitle);
    if (!issueSummary) setIssueSummary(reportSummary);
  }, [reportSummary, reportDate, reportShift, reportStatus, subjectLine, priorityLevel, issueCategory, issueTitle, issueSummary]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!programId) {
      setStatus({ tone: 'error', text: 'No program selected.' });
      return;
    }
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const body = {
        subjectLine: subjectLine || undefined,
        priorityLevel: priorityLevel || undefined,
        issueCategory: issueCategory || undefined,
        issueTitle: issueTitle || undefined,
        issueSummary: issueSummary || undefined,
        additionalComments: additionalComments || undefined,
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
      setStatus({ tone: 'success', text: 'Supervisors notified.' });
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('global-toast', JSON.stringify({ title: 'Supervisors notified.', tone: 'success' }));
        }
      } catch {}
      setTimeout(() => router.back(), 800);
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
                <span className="bg-error text-white text-xs font-bold px-2 py-1 rounded-full mr-3">
                  {(priorityLevel || 'Critical').toUpperCase()}
                </span>
                <h3 className="text-lg font-semibold text-font-base">{issueTitle || 'Unit issue'}</h3>
              </div>
              {issueSummary && (
                <p className="text-sm text-font-detail mb-2">{issueSummary}</p>
              )}
              {reportDate && (
                <p className="text-xs text-font-medium">
                  Last reported: {reportDate}{reportShift ? `, ${reportShift}` : ''}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Notification Form */}
      <section className="bg-white rounded-lg border border-bd">
        <div className="p-6 border-b border-bd">
          <h3 className="text-lg font-semibold text-font-base">Supervisor Notification Form</h3>
          <p className="text-sm text-font-detail mt-1">This notification will be sent to the Program Director and Assistant Program Director via email.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-font-base mb-2">
                <i className="fa-solid fa-user-tie mr-2 text-primary"></i>
                Notify Supervisor
              </label>
              <div className="w-full px-3 py-2 border border-bd rounded-md bg-bg-subtle text-sm text-font-detail">
                Program Director &amp; Assistant Program Director for this program will be notified automatically.
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-font-base mb-2">
                <i className="fa-solid fa-flag mr-2 text-error"></i>
                Priority Level
              </label>
              <div className="w-full px-3 py-2 border border-bd rounded-md bg-bg-subtle text-sm text-font-base">
                {priorityLevel || 'Normal'}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-font-base mb-2">
              <i className="fa-solid fa-tags mr-2 text-primary"></i>
              Issue Category
            </label>
            <div className="w-full px-3 py-2 border border-bd rounded-md bg-bg-subtle text-sm text-font-base">
              {issueCategory || 'Facility Issue'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-font-base mb-2">
              <i className="fa-solid fa-heading mr-2 text-primary"></i>
              Subject Line
            </label>
            <input
              type="text"
              value={subjectLine}
              onChange={(e) => setSubjectLine(e.target.value)}
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
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
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
