import { logoUrl } from '@/app/utils/logo';

export function generateWatchReportHTML(watch: any): string {
  const isActive = !watch.endDateTime;
  const duration = watch.duration || (isActive ? 'Ongoing' : '-');
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Watch Report - ${watch.residentName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; background: white; color: #1a1a1a; line-height: 1.6; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #14558f; padding-bottom: 20px; }
    .logo { width: 120px; height: auto; margin-bottom: 15px; }
    .commonwealth { font-size: 20px; color: #14558f; font-weight: 700; margin-bottom: 8px; letter-spacing: 1px; text-transform: uppercase; }
    .org-line { font-size: 16px; color: #14558f; font-weight: 500; margin-bottom: 5px; }
    h1 { font-size: 14px; color: #1a1a1a; font-weight: 700; margin: 10px 0 8px 0; }
    .subtitle { font-size: 12px; color: #666; margin-bottom: 5px; }
    .section { margin-bottom: 25px; page-break-inside: avoid; }
    .section-title { background: linear-gradient(135deg, #14558f 0%, #4377A5 100%); color: white; padding: 10px 15px; font-size: 16px; font-weight: 600; margin-bottom: 15px; border-radius: 6px; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
    .info-item { padding: 12px; background: #F9FAFB; border-left: 4px solid #14558f; border-radius: 4px; }
    .info-label { font-weight: 600; color: #374151; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .info-value { color: #1F2937; font-size: 15px; }
    .badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; color: white; }
    .badge-elevated { background: #DC2626; }
    .badge-alert { background: #F59E0B; }
    .badge-general { background: #10B981; }
    .badge-active { background: #10B981; }
    .badge-ended { background: #6B7280; }
    .risk-flags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    .risk-flag { background: #FEF3C7; color: #92400E; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .full-width { grid-column: 1 / -1; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #E5E7EB; text-align: center; font-size: 12px; color: #999; }
    @media print { body { padding: 20px; } .header { page-break-after: avoid; } .section { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="header">
    <img src="${logoUrl}" alt="DYS Logo" class="logo" />
    <div class="commonwealth">COMMONWEALTH OF MASSACHUSETTS</div>
    <div class="org-line">Executive Office for Health and Human Services</div>
    <div class="org-line">Department of Youth Services</div>
    <h1>Watch Assignment Report</h1>
    <div class="subtitle">Complete Watch Documentation</div>
    <div class="subtitle">Phone: (617) 951-2409</div>
    <div class="subtitle">Address: ${watch.programAddress || 'Program Address'}</div>
    <div class="subtitle">Report ID: ${watch.id} | Generated: ${new Date().toLocaleString()}</div>
  </div>

  <div class="section">
    <div class="section-title">Resident Information</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Resident Name</div>
        <div class="info-value">${watch.residentName}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Resident ID</div>
        <div class="info-value">${watch.residentNumber || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Room Number</div>
        <div class="info-value">${watch.room || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Watch Status</div>
        <div class="info-value">
          <span class="badge ${isActive ? 'badge-active' : 'badge-ended'}">
            ${isActive ? 'ACTIVE' : 'ENDED'}
          </span>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Watch Details</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Watch Type</div>
        <div class="info-value">
          <span class="badge badge-${watch.watchType.toLowerCase()}">
            ${watch.watchType}
          </span>
        </div>
      </div>
      <div class="info-item">
        <div class="info-label">Authorized By</div>
        <div class="info-value">${watch.authorizedByClinician || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Start Date & Time</div>
        <div class="info-value">${new Date(watch.startDateTime).toLocaleString()}</div>
      </div>
      <div class="info-item">
        <div class="info-label">End Date & Time</div>
        <div class="info-value">${watch.endDateTime ? new Date(watch.endDateTime).toLocaleString() : 'Ongoing'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Duration</div>
        <div class="info-value">${duration}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Total Log Entries</div>
        <div class="info-value">${watch.totalLogEntries || 0}</div>
      </div>
      ${watch.outcome ? `
      <div class="info-item">
        <div class="info-label">Outcome</div>
        <div class="info-value"><span class="badge" style="background: #14558f;">${watch.outcome}</span></div>
      </div>
      ` : ''}
      ${watch.endedByStaffName ? `
      <div class="info-item">
        <div class="info-label">Ended By</div>
        <div class="info-value">${watch.endedByStaffName}</div>
      </div>
      ` : ''}
      <div class="info-item full-width">
        <div class="info-label">Clinical Reason</div>
        <div class="info-value">${watch.clinicalReason || 'N/A'}</div>
      </div>
      ${watch.endNotes ? `
      <div class="info-item full-width">
        <div class="info-label">End Notes</div>
        <div class="info-value">${watch.endNotes}</div>
      </div>
      ` : ''}
    </div>
  </div>

  ${watch.selfHarmRisk || watch.suicidalIdeation || watch.aggressiveBehavior || watch.sleepDisturbance || watch.medicalConcern ? `
  <div class="section">
    <div class="section-title">Risk Assessment</div>
    <div class="info-item">
      <div class="risk-flags">
        ${watch.selfHarmRisk ? '<span class="risk-flag">Self-Harm Risk</span>' : ''}
        ${watch.suicidalIdeation ? '<span class="risk-flag">Suicidal Ideation</span>' : ''}
        ${watch.aggressiveBehavior ? '<span class="risk-flag">Aggressive Behavior</span>' : ''}
        ${watch.sleepDisturbance ? '<span class="risk-flag">Sleep Disturbance</span>' : ''}
        ${watch.medicalConcern ? '<span class="risk-flag">Medical Concern</span>' : ''}
      </div>
    </div>
  </div>
  ` : ''}

  <div class="footer">
    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    <p>Youth Services Program - Sleep Log & Watch Management System</p>
  </div>
</body>
</html>
`;
}
