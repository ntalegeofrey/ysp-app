import { logoUrl } from '@/app/utils/logo';

export const generateVisitationReportHTML = (resident: any, visits: any[]) => {
  const currentDate = new Date().toLocaleDateString();
  const residentName = `${resident.firstName} ${resident.lastName}`;
  const residentId = resident.residentId || 'N/A';
  const room = resident.room || 'N/A';
  
  // Sort visits by date (most recent first)
  const sortedVisits = [...visits].sort((a, b) => 
    new Date(b.scheduledDate || b.createdAt).getTime() - new Date(a.scheduledDate || a.createdAt).getTime()
  );

  // Helper function to format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Helper function to format time
  const formatTime = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Visitation History Report - ${residentName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; background: white; color: #1a1a1a; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #14558f; padding-bottom: 20px; }
    .logo { width: 120px; height: auto; margin-bottom: 15px; }
    .commonwealth { font-size: 20px; color: #14558f; font-weight: 700; margin-bottom: 8px; letter-spacing: 1px; text-transform: uppercase; }
    .org-line { font-size: 16px; color: #14558f; font-weight: 500; margin-bottom: 5px; }
    h1 { font-size: 14px; color: #1a1a1a; font-weight: 700; margin: 10px 0 8px 0; }
    .subtitle { font-size: 12px; color: #666; margin-bottom: 5px; }
    .section { margin-bottom: 25px; page-break-inside: avoid; }
    .section-title { font-size: 18px; font-weight: bold; color: #14558f; margin-bottom: 12px; border-bottom: 2px solid #E8EEF4; padding-bottom: 5px; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 15px; }
    .info-item { padding: 10px; background: #E8EEF4; border-radius: 4px; }
    .info-label { font-size: 12px; color: #666; margin-bottom: 4px; font-weight: 600; }
    .info-value { font-size: 14px; color: #1a1a1a; }
    .full-width { grid-column: 1 / -1; }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px; }
    .stat-card { background: #E8EEF4; padding: 15px; border-radius: 4px; text-align: center; border: 2px solid #14558f; }
    .stat-value { font-size: 28px; font-weight: 700; color: #14558f; }
    .stat-label { font-size: 12px; color: #666; margin-top: 4px; font-weight: 600; }
    .visit-card { background: #f9fafb; border: 2px solid #E8EEF4; border-radius: 6px; padding: 18px; margin-bottom: 15px; page-break-inside: avoid; }
    .visit-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid #E8EEF4; }
    .visit-date { font-size: 16px; font-weight: 700; color: #14558f; }
    .visit-status { display: inline-block; padding: 5px 12px; border-radius: 4px; font-size: 11px; font-weight: 700; color: white; }
    .status-completed { background: #10b981; }
    .status-scheduled { background: #14558f; }
    .status-cancelled { background: #dc2626; }
    .status-in-progress { background: #f59e0b; }
    .visit-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .visit-item { }
    .visit-label { font-size: 11px; color: #666; font-weight: 600; margin-bottom: 3px; }
    .visit-value { font-size: 13px; color: #1a1a1a; }
    .notes-box { margin-top: 12px; padding: 12px; background: white; border-left: 4px solid #14558f; border-radius: 4px; }
    .notes-title { font-size: 12px; font-weight: 700; color: #14558f; margin-bottom: 6px; }
    .notes-content { font-size: 13px; color: #1a1a1a; line-height: 1.5; }
    .incident-box { margin-top: 12px; padding: 12px; background: #fee2e2; border-left: 4px solid #dc2626; border-radius: 4px; }
    .no-visits { text-align: center; padding: 40px; color: #999; font-style: italic; background: #f9fafb; border-radius: 6px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #E8EEF4; text-align: center; font-size: 11px; color: #999; }
    @media print { body { padding: 20px; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <img src="${logoUrl}" alt="DYS Logo" class="logo" />
    <div class="commonwealth">COMMONWEALTH OF MASSACHUSETTS</div>
    <div class="org-line">Executive Office for Health and Human Services</div>
    <div class="org-line">Department of Youth Services</div>
    <h1>Visitation History Report</h1>
    <div class="subtitle">Generated: ${currentDate}</div>
  </div>
  
  <div class="section">
    <div class="section-title">Resident Information</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Resident Name</div>
        <div class="info-value">${residentName}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Resident ID</div>
        <div class="info-value">${residentId}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Room Number</div>
        <div class="info-value">${room}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Total Visits</div>
        <div class="info-value">${visits.length}</div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">Visitation Summary</div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${visits.filter(v => v.status === 'COMPLETED').length}</div>
        <div class="stat-label">Completed</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${visits.filter(v => v.status === 'SCHEDULED').length}</div>
        <div class="stat-label">Scheduled</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${visits.filter(v => v.status === 'CANCELLED').length}</div>
        <div class="stat-label">Cancelled</div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">Visit Records</div>
    ${sortedVisits.length === 0 ? 
      '<div class="no-visits">No visitation records found for this resident.</div>' :
      sortedVisits.map(visit => {
        const statusClass = visit.status ? `status-${visit.status.toLowerCase().replace('_', '-')}` : 'status-scheduled';
        return `
        <div class="visit-card">
          <div class="visit-header">
            <div class="visit-date">${formatDate(visit.scheduledDate || visit.createdAt)}</div>
            <span class="visit-status ${statusClass}">
              ${visit.status || 'SCHEDULED'}
            </span>
          </div>
          
          <div class="visit-grid">
            <div class="visit-item">
              <div class="visit-label">Time</div>
              <div class="visit-value">${formatTime(visit.scheduledStartTime)} - ${formatTime(visit.scheduledEndTime)}</div>
            </div>
            <div class="visit-item">
              <div class="visit-label">Visit Type</div>
              <div class="visit-value">${(visit.visitType || 'IN_PERSON').replace(/_/g, ' ')}</div>
            </div>
            <div class="visit-item">
              <div class="visit-label">Visitor Name</div>
              <div class="visit-value">${visit.visitorInfo?.[0]?.name || 'N/A'}</div>
            </div>
            <div class="visit-item">
              <div class="visit-label">Relationship</div>
              <div class="visit-value">${visit.visitorInfo?.[0]?.relationship?.replace(/_/g, ' ') || 'N/A'}</div>
            </div>
            <div class="visit-item">
              <div class="visit-label">Visitation Room</div>
              <div class="visit-value">${visit.visitationRoom || 'N/A'}</div>
            </div>
            <div class="visit-item">
              <div class="visit-label">Supervising Staff</div>
              <div class="visit-value">${visit.supervisingStaffName || visit.scheduledByStaffName || 'N/A'}</div>
            </div>
          </div>
          
          ${visit.specialInstructions ? `
            <div class="notes-box">
              <div class="notes-title">Special Instructions</div>
              <div class="notes-content">${visit.specialInstructions}</div>
            </div>
          ` : ''}
          
          ${visit.visitNotes ? `
            <div class="notes-box">
              <div class="notes-title">Visit Notes</div>
              <div class="notes-content">${visit.visitNotes}</div>
            </div>
          ` : ''}
          
          ${visit.incidentOccurred ? `
            <div class="incident-box">
              <div class="notes-title" style="color: #dc2626;">Incident Report</div>
              <div class="notes-content">${visit.incidentDetails || 'Incident occurred but no details provided.'}</div>
            </div>
          ` : ''}
        </div>
      `}).join('')
    }
  </div>
  
  <div class="footer">
    <div>Department of Youth Services - Confidential Document</div>
    <div>This report contains sensitive information and should be handled in accordance with privacy regulations.</div>
  </div>
    </body>
    </html>
  `;
};
