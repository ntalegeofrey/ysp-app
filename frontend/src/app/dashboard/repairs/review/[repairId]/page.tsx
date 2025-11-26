'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useToast } from '@/app/hooks/useToast';
import ToastContainer from '@/app/components/Toast';

export default function RepairReviewPage() {
  const router = useRouter();
  const params = useParams();
  const repairId = params.repairId as string;
  const { toasts, addToast, removeToast } = useToast();
  
  const [repair, setRepair] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [programId, setProgramId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [isProgramDirector, setIsProgramDirector] = useState(false);
  const [isClinical, setIsClinical] = useState(false);
  
  // Review comments
  const [pdComments, setPdComments] = useState('');
  const [clinicalComments, setClinicalComments] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const programData = typeof window !== 'undefined' ? localStorage.getItem('selectedProgram') : null;
        if (!programData) return;
        
        const program = JSON.parse(programData);
        setProgramId(program.id);

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;

        // Fetch repair details
        const repairResponse = await fetch(`/api/programs/${program.id}/repairs/interventions/${repairId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (repairResponse.ok) {
          const repairData = await repairResponse.json();
          setRepair(repairData);
          setPdComments(repairData.pdReviewComments || '');
          setClinicalComments(repairData.clinicalReviewComments || '');
        }

        // Check user assignments for role
        const assignResponse = await fetch(`/api/programs/${program.id}/assignments`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (assignResponse.ok) {
          const assignments = await assignResponse.json();
          const userAssignment = assignments.find((a: any) => a.userId.toString() === localStorage.getItem('userId'));
          
          if (userAssignment) {
            const roleType = userAssignment.roleType?.toUpperCase();
            const category = userAssignment.category?.toLowerCase();
            const roleName = userAssignment.roleName?.toLowerCase();
            
            setIsProgramDirector(
              roleType === 'PROGRAM_DIRECTOR' || 
              roleType === 'ASSISTANT_DIRECTOR' ||
              roleType === 'REGIONAL_ADMIN' ||
              roleType === 'ADMINISTRATOR' ||
              roleType === 'ADMIN'
            );
            
            const isClinicalRole = 
              category === 'clinical' ||
              roleType === 'CLINICAL' ||
              roleType === 'THERAPIST' ||
              roleType === 'COUNSELOR' ||
              roleName?.includes('clinical') ||
              roleName?.includes('therapist') ||
              roleName?.includes('counselor');
            
            setIsClinical(isClinicalRole);
            setUserRole(roleType || '');
          }
        }
      } catch (error) {
        console.error('Error loading repair:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [repairId]);

  const handlePDReview = async (approved: boolean) => {
    if (!programId) return;

    setSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return;

      const response = await fetch(`/api/programs/${programId}/repairs/interventions/${repairId}/approve-pd`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          approved,
          comments: pdComments
        })
      });

      if (response.ok) {
        addToast(approved ? 'Repair approved by PD!' : 'Repair disapproved by PD', 'success');
        setTimeout(() => router.push('/dashboard/repairs'), 1500);
      } else {
        const error = await response.text();
        addToast(`Error: ${error}`, 'error');
      }
    } catch (error) {
      console.error('Error submitting PD review:', error);
      addToast('Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClinicalReview = async (approved: boolean) => {
    if (!programId) return;

    setSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return;

      const response = await fetch(`/api/programs/${programId}/repairs/interventions/${repairId}/approve-clinical`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          approved,
          comments: clinicalComments
        })
      });

      if (response.ok) {
        addToast(approved ? 'Repair approved by Clinical!' : 'Repair disapproved by Clinical', 'success');
        setTimeout(() => router.push('/dashboard/repairs'), 1500);
      } else {
        const error = await response.text();
        addToast(`Error: ${error}`, 'error');
      }
    } catch (error) {
      console.error('Error submitting Clinical review:', error);
      addToast('Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <i className="fa-solid fa-spinner fa-spin text-4xl text-primary"></i>
      </div>
    );
  }

  if (!repair) {
    return (
      <div className="p-8 text-center">
        <i className="fa-solid fa-exclamation-triangle text-error text-4xl mb-4"></i>
        <p className="text-lg">Repair not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="text-primary hover:text-primary-light mb-2 flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Back
          </button>
          <h1 className="text-2xl font-bold text-font-base">Review Repair</h1>
          <p className="text-font-detail">Repair ID: {repair.id}</p>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
          repair.status === 'approved' ? 'bg-success text-white' :
          repair.status === 'pending_review' ? 'bg-warning text-white' :
          'bg-error text-white'
        }`}>
          {repair.status?.replace('_', ' ').toUpperCase()}
        </div>
      </div>

      {/* Resident Info */}
      <div className="bg-white rounded-lg border border-bd p-6">
        <h2 className="text-lg font-semibold text-font-base mb-4">Resident Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-font-detail">Name</p>
            <p className="font-medium">{repair.residentName}</p>
          </div>
          <div>
            <p className="text-sm text-font-detail">ID</p>
            <p className="font-medium">{repair.residentNumber}</p>
          </div>
          <div>
            <p className="text-sm text-font-detail">Repair Level</p>
            <p className="font-medium">{repair.repairLevel}</p>
          </div>
          <div>
            <p className="text-sm text-font-detail">Assigned By</p>
            <p className="font-medium">{repair.assigningStaffName}</p>
          </div>
        </div>
      </div>

      {/* Infraction Details */}
      <div className="bg-white rounded-lg border border-bd p-6">
        <h2 className="text-lg font-semibold text-font-base mb-4">Infraction Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-font-detail">Date</p>
            <p className="font-medium">{new Date(repair.infractionDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-font-detail">Shift</p>
            <p className="font-medium">{repair.infractionShift || 'N/A'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-font-detail">Behavior</p>
            <p className="font-medium">{repair.infractionBehavior}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-font-detail">Comments</p>
            <p className="text-sm">{repair.comments || 'No comments provided'}</p>
          </div>
        </div>
      </div>

      {/* Program Director Review */}
      {isProgramDirector && repair.status === 'pending_review' && (
        <div className="bg-white rounded-lg border border-bd p-6">
          <h2 className="text-lg font-semibold text-font-base mb-4">Program Director / AD Review</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-font-detail mb-2">
                Review Comments (Optional)
              </label>
              <textarea
                value={pdComments}
                onChange={(e) => setPdComments(e.target.value)}
                placeholder="Add your review comments..."
                rows={4}
                className="w-full border border-bd rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handlePDReview(true)}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-success text-white rounded-lg font-medium hover:bg-success/90 disabled:opacity-50 transition-colors"
              >
                <i className="fa-solid fa-check mr-2"></i>
                {submitting ? 'Processing...' : 'Approve'}
              </button>
              <button
                onClick={() => handlePDReview(false)}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-error text-white rounded-lg font-medium hover:bg-error/90 disabled:opacity-50 transition-colors"
              >
                <i className="fa-solid fa-times mr-2"></i>
                {submitting ? 'Processing...' : 'Disapprove'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show PD Review Status if already reviewed */}
      {repair.pdReviewDate && (
        <div className="bg-bg-subtle rounded-lg border border-bd p-6">
          <h2 className="text-lg font-semibold text-font-base mb-4">Program Director Review</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                repair.pdApproved ? 'bg-success text-white' : 'bg-error text-white'
              }`}>
                {repair.pdApproved ? 'Approved' : 'Disapproved'}
              </span>
              <span className="text-sm text-font-detail">
                by {repair.pdReviewerName} on {new Date(repair.pdReviewDate).toLocaleDateString()}
              </span>
            </div>
            {repair.pdReviewComments && (
              <p className="text-sm text-font-base mt-2">{repair.pdReviewComments}</p>
            )}
          </div>
        </div>
      )}

      {/* Clinical Review */}
      {isClinical && repair.pdApproved && !repair.clinicalReviewDate && (
        <div className="bg-white rounded-lg border border-bd p-6">
          <h2 className="text-lg font-semibold text-font-base mb-4">Clinical Review</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-font-detail mb-2">
                Review Comments (Optional)
              </label>
              <textarea
                value={clinicalComments}
                onChange={(e) => setClinicalComments(e.target.value)}
                placeholder="Add your review comments..."
                rows={4}
                className="w-full border border-bd rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleClinicalReview(true)}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-success text-white rounded-lg font-medium hover:bg-success/90 disabled:opacity-50 transition-colors"
              >
                <i className="fa-solid fa-check mr-2"></i>
                {submitting ? 'Processing...' : 'Approve'}
              </button>
              <button
                onClick={() => handleClinicalReview(false)}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-error text-white rounded-lg font-medium hover:bg-error/90 disabled:opacity-50 transition-colors"
              >
                <i className="fa-solid fa-times mr-2"></i>
                {submitting ? 'Processing...' : 'Disapprove'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show Clinical Review Status if already reviewed */}
      {repair.clinicalReviewDate && (
        <div className="bg-bg-subtle rounded-lg border border-bd p-6">
          <h2 className="text-lg font-semibold text-font-base mb-4">Clinical Review</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                repair.clinicalApproved ? 'bg-success text-white' : 'bg-error text-white'
              }`}>
                {repair.clinicalApproved ? 'Approved' : 'Disapproved'}
              </span>
              <span className="text-sm text-font-detail">
                by {repair.clinicalReviewerName} on {new Date(repair.clinicalReviewDate).toLocaleDateString()}
              </span>
            </div>
            {repair.clinicalReviewComments && (
              <p className="text-sm text-font-base mt-2">{repair.clinicalReviewComments}</p>
            )}
          </div>
        </div>
      )}

      {/* Pending Clinical Review Message */}
      {!isClinical && repair.pdApproved && !repair.clinicalReviewDate && (
        <div className="bg-warning/10 border border-warning rounded-lg p-6 text-center">
          <i className="fa-solid fa-clock text-warning text-3xl mb-3"></i>
          <p className="text-lg font-medium text-font-base">Waiting for Clinical Review</p>
          <p className="text-sm text-font-detail mt-2">This repair has been approved by the Program Director and is awaiting clinical review.</p>
        </div>
      )}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
