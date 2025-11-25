export function generateIncidentReportHTML(data: any): string {
  const logoUrl = 'https://storage.googleapis.com/uxpilot-auth.appspot.com/5ea061d02c-eff4b0701f06055f1bc2.png';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Incident Report - ${data.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; background: white; color: #1a1a1a; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1e40af; padding-bottom: 20px; }
    .logo { width: 120px; height: auto; margin-bottom: 15px; }
    .commonwealth { font-size: 14px; color: #1e40af; font-weight: 600; margin-bottom: 8px; letter-spacing: 0.5px; }
    h1 { font-size: 28px; color: #1e40af; margin-bottom: 10px; }
    .subtitle { font-size: 16px; color: #666; margin-bottom: 5px; }
    .section { margin-bottom: 25px; page-break-inside: avoid; }
    .section-title { font-size: 18px; font-weight: bold; color: #1e40af; margin-bottom: 12px; border-bottom: 2px solid #dbeafe; padding-bottom: 5px; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 15px; }
    .info-item { padding: 10px; background: #eff6ff; border-radius: 4px; }
    .info-label { font-size: 12px; color: #666; margin-bottom: 4px; font-weight: 600; }
    .info-value { font-size: 14px; color: #1a1a1a; }
    .full-width { grid-column: 1 / -1; }
    .text-block { padding: 15px; background: #f9fafb; border-left: 4px solid #1e40af; margin-bottom: 15px; }
    .text-label { font-size: 12px; color: #666; margin-bottom: 8px; font-weight: 600; }
    .text-content { font-size: 14px; line-height: 1.6; color: #1a1a1a; white-space: pre-wrap; }
    .priority-critical { background: #fee2e2; color: #991b1b; padding: 5px 10px; border-radius: 4px; display: inline-block; font-weight: bold; }
    .priority-high { background: #fef3c7; color: #92400e; padding: 5px 10px; border-radius: 4px; display: inline-block; font-weight: bold; }
    .priority-medium { background: #dbeafe; color: #1e40af; padding: 5px 10px; border-radius: 4px; display: inline-block; font-weight: bold; }
    .priority-low { background: #d1fae5; color: #065f46; padding: 5px 10px; border-radius: 4px; display: inline-block; font-weight: bold; }
    .signature-box { border: 2px solid #1e40af; padding: 20px; margin-top: 30px; background: #f0f9ff; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; font-size: 12px; color: #999; }
    @media print { body { padding: 20px; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <img src="${logoUrl}" alt="DYS Logo" class="logo" />
    <div class="commonwealth">COMMONWEALTH OF MASSACHUSETTS</div>
    <h1>Incident Report</h1>
    <div class="subtitle">${data.programName || 'Program Name'}</div>
    <div class="subtitle">Report ID: ${data.id} | Generated: ${new Date().toLocaleString()}</div>
  </div>
  
  <div class="section">
    <div class="section-title">Incident Details</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Date of Incident</div>
        <div class="info-value">${new Date(data.incidentDate).toLocaleDateString()}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Time of Incident</div>
        <div class="info-value">${data.incidentTime}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Shift</div>
        <div class="info-value">${data.shift || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Priority Level</div>
        <div class="info-value"><span class="priority-${data.priority.toLowerCase()}">${data.priority}</span></div>
      </div>
      <div class="info-item full-width">
        <div class="info-label">Area of Incident</div>
        <div class="info-value">${data.areaOfIncident || 'Not specified'}</div>
      </div>
      <div class="info-item full-width">
        <div class="info-label">Nature of Incident</div>
        <div class="info-value" style="font-weight: bold;">${data.natureOfIncident}</div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">People Involved</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Residents Involved</div>
        <div class="info-value">${data.residentsInvolved || 'None'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Staff Involved</div>
        <div class="info-value">${data.staffInvolved || 'None'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Resident Witnesses</div>
        <div class="info-value">${data.residentWitnesses || 'None'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Primary Staff (Restraint)</div>
        <div class="info-value">${data.primaryStaffRestraint || 'N/A'}</div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">Population & Timing</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Staff on Shift</div>
        <div class="info-value">${data.staffPopulation || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Youth on Shift</div>
        <div class="info-value">${data.youthPopulation || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Mechanicals Start - Finish</div>
        <div class="info-value">${data.mechanicalsStartTime || 'N/A'} - ${data.mechanicalsFinishTime || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Room Confinement Start - Finish</div>
        <div class="info-value">${data.roomConfinementStartTime || 'N/A'} - ${data.roomConfinementFinishTime || 'N/A'}</div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">Detailed Description</div>
    <div class="text-block">
      <div class="text-content">${data.detailedDescription || 'No description provided'}</div>
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">Certification & Signature</div>
    <div class="signature-box">
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Report Completed By</div>
          <div class="info-value">${data.reportCompletedBy || 'Unknown'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Date & Time</div>
          <div class="info-value">${new Date(data.signatureDatetime).toLocaleString()}</div>
        </div>
        <div class="info-item full-width">
          <div class="info-label">Certification Status</div>
          <div class="info-value">${data.certificationComplete ? '✓ Certified' : 'Not Certified'}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    <p>This is an official incident report for ${data.programName || 'the program'}.</p>
    <p>Report generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
  </div>
</body>
</html>`;
}
