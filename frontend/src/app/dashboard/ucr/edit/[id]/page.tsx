'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditUCRPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any>(null);
  const [programId, setProgramId] = useState<string | null>(null);

  useEffect(() => {
    // Get program ID from localStorage
    const storedProgramId = typeof window !== 'undefined' ? localStorage.getItem('selectedProgramId') : null;
    setProgramId(storedProgramId);

    if (!storedProgramId || !reportId) {
      router.push('/dashboard/ucr');
      return;
    }

    // Fetch the report
    const fetchReport = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const response = await fetch(`/api/programs/${storedProgramId}/ucr/reports/${reportId}`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch report');
        }

        const data = await response.json();
        setReport(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching report:', error);
        router.push('/dashboard/ucr');
      }
    };

    fetchReport();
  }, [reportId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-font-detail">Loading report...</p>
        </div>
      </div>
    );
  }

  const reportDate = report?.reportDate ? new Date(report.reportDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : '';

  return (
    <div className="min-h-screen bg-bg-base">
      {/* App Bar with Breadcrumbs */}
      <div className="bg-white border-b border-bd sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard/ucr')}
                className="text-font-detail hover:text-font-base transition-colors"
                title="Back to UCR"
              >
                <i className="fa-solid fa-arrow-left text-xl"></i>
              </button>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-font-detail hover:text-primary cursor-pointer" onClick={() => router.push('/dashboard/ucr')}>
                  UCR Reports
                </span>
                <i className="fa-solid fa-chevron-right text-xs text-font-detail"></i>
                <span className="text-font-base font-medium">Edit UCR</span>
                <i className="fa-solid fa-chevron-right text-xs text-font-detail"></i>
                <span className="text-font-detail">{reportDate}</span>
              </div>
            </div>
            <div className="text-sm text-font-detail">
              Report ID: #{reportId}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-bd p-6">
          <h1 className="text-2xl font-bold text-font-base mb-6">
            Edit UCR Report - {reportDate}
          </h1>
          
          {/* TODO: Implement the full edit form here */}
          <div className="text-center py-12 text-font-detail">
            <i className="fa-solid fa-pen-to-square text-4xl mb-4 text-primary"></i>
            <p className="text-lg">Edit form will be implemented here</p>
            <p className="mt-2">This will contain the same form as the "New Report" tab</p>
            <p className="mt-4 text-sm">Report Data:</p>
            <pre className="mt-2 text-left bg-bg-subtle p-4 rounded text-xs overflow-auto max-h-96">
              {JSON.stringify(report, null, 2)}
            </pre>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => router.push('/dashboard/ucr')}
              className="px-4 py-2 border border-bd rounded-lg text-font-base hover:bg-bg-subtle transition-colors"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
