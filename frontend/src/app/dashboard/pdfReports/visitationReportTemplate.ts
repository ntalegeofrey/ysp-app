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
  
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return '#10b981';
      case 'IN_PROGRESS': return '#f59e0b';
      case 'CANCELLED': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page {
          size: letter;
          margin: 0.5in;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .header {
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          color: white;
          padding: 25px;
          margin-bottom: 25px;
          border-radius: 8px;
        }
        .header h1 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .header .subtitle {
          font-size: 14px;
          opacity: 0.9;
        }
        .info-section {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 25px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .info-item {
          display: flex;
          flex-direction: column;
        }
        .info-label {
          font-size: 11px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .info-value {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }
        .visits-section {
          margin-top: 30px;
        }
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e5e7eb;
        }
        .visit-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 15px;
          page-break-inside: avoid;
        }
        .visit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .visit-date {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }
        .visit-status {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          color: white;
        }
        .visit-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-top: 15px;
        }
        .detail-item {
          display: flex;
          flex-direction: column;
        }
        .detail-label {
          font-size: 11px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }
        .detail-value {
          font-size: 14px;
          color: #374151;
        }
        .notes-section {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e5e7eb;
        }
        .notes-label {
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 5px;
        }
        .notes-content {
          font-size: 13px;
          color: #4b5563;
          line-height: 1.5;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
        }
        .footer-text {
          font-size: 12px;
          color: #6b7280;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 30px;
        }
        .stat-card {
          background: white;
          border: 1px solid #e5e7eb;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #3b82f6;
        }
        .stat-label {
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }
        .no-visits {
          text-align: center;
          padding: 40px;
          color: #6b7280;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Visitation History Report</h1>
        <div class="subtitle">Generated on ${currentDate}</div>
      </div>
      
      <div class="info-section">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Resident Name</span>
            <span class="info-value">${residentName}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Resident ID</span>
            <span class="info-value">${residentId}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Room Number</span>
            <span class="info-value">${room}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Total Visits</span>
            <span class="info-value">${visits.length}</span>
          </div>
        </div>
      </div>
      
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
      
      <div class="visits-section">
        <h2 class="section-title">Visit Records</h2>
        ${sortedVisits.length === 0 ? 
          '<div class="no-visits">No visitation records found for this resident.</div>' :
          sortedVisits.map(visit => `
            <div class="visit-card">
              <div class="visit-header">
                <div class="visit-date">${formatDate(visit.scheduledDate || visit.createdAt)}</div>
                <span class="visit-status" style="background-color: ${getStatusColor(visit.status)}">
                  ${visit.status || 'SCHEDULED'}
                </span>
              </div>
              
              <div class="visit-details">
                <div class="detail-item">
                  <span class="detail-label">Time</span>
                  <span class="detail-value">${formatTime(visit.scheduledStartTime)} - ${formatTime(visit.scheduledEndTime)}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Visit Type</span>
                  <span class="detail-value">${(visit.visitType || 'IN_PERSON').replace(/_/g, ' ')}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Visitor</span>
                  <span class="detail-value">${visit.visitorInfo?.[0]?.name || 'N/A'}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Relationship</span>
                  <span class="detail-value">${visit.visitorInfo?.[0]?.relationship || 'N/A'}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Room</span>
                  <span class="detail-value">${visit.visitationRoom || 'N/A'}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Staff</span>
                  <span class="detail-value">${visit.supervisingStaffName || visit.scheduledByStaffName || 'N/A'}</span>
                </div>
              </div>
              
              ${visit.specialInstructions || visit.visitNotes ? `
                <div class="notes-section">
                  ${visit.specialInstructions ? `
                    <div>
                      <div class="notes-label">Special Instructions</div>
                      <div class="notes-content">${visit.specialInstructions}</div>
                    </div>
                  ` : ''}
                  ${visit.visitNotes ? `
                    <div style="margin-top: 10px;">
                      <div class="notes-label">Visit Notes</div>
                      <div class="notes-content">${visit.visitNotes}</div>
                    </div>
                  ` : ''}
                </div>
              ` : ''}
              
              ${visit.incidentOccurred ? `
                <div class="notes-section" style="background-color: #fef2f2; padding: 10px; border-radius: 4px;">
                  <div class="notes-label" style="color: #dc2626;">Incident Report</div>
                  <div class="notes-content">${visit.incidentDetails || 'Incident occurred but no details provided.'}</div>
                </div>
              ` : ''}
            </div>
          `).join('')
        }
      </div>
      
      <div class="footer">
        <div class="footer-text">Youth Supervision Platform - Confidential Document</div>
        <div class="footer-text">This report contains sensitive information and should be handled accordingly.</div>
      </div>
    </body>
    </html>
  `;
};
