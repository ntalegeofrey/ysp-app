import { logoUrl } from '@/app/utils/logo';

export function generateMedicationSheetHTML(data: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Medication Sheet - ${data.residentName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; background: white; color: #1a1a1a; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #14558f; padding-bottom: 20px; }
    .logo { width: 120px; height: auto; margin-bottom: 15px; }
    .commonwealth { font-size: 20px; color: #14558f; font-weight: 700; margin-bottom: 8px; letter-spacing: 1px; text-transform: uppercase; }
    .org-line { font-size: 16px; color: #14558f; font-weight: 500; margin-bottom: 5px; }
    h1 { font-size: 24px; color: #1a1a1a; font-weight: 700; margin: 10px 0 8px 0; }
    .subtitle { font-size: 12px; color: #666; margin-bottom: 5px; }
    .section { margin-bottom: 25px; page-break-inside: avoid; }
    .section-title { font-size: 18px; font-weight: bold; color: #14558f; margin-bottom: 12px; border-bottom: 2px solid #E8EEF4; padding-bottom: 5px; }
    .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 15px; }
    .info-item { padding: 10px; background: #E8EEF4; border-radius: 4px; }
    .info-label { font-size: 12px; color: #666; margin-bottom: 4px; font-weight: 600; }
    .info-value { font-size: 14px; color: #1a1a1a; }
    .full-width { grid-column: 1 / -1; }
    .allergy-box { padding: 15px; background: #fee2e2; border-left: 4px solid #dc2626; margin-bottom: 15px; border-radius: 4px; }
    .allergy-label { font-size: 12px; color: #991b1b; margin-bottom: 8px; font-weight: 600; }
    .allergy-content { font-size: 14px; line-height: 1.6; color: #991b1b; font-weight: 600; }
    .med-card { border: 2px solid #E8EEF4; border-radius: 8px; padding: 15px; margin-bottom: 15px; background: linear-gradient(to bottom right, white, #f0f9ff); }
    .med-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 2px solid #E8EEF4; padding-bottom: 10px; }
    .med-name { font-size: 16px; font-weight: bold; color: #1a1a1a; }
    .med-frequency { background: #14558f; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
    .med-details { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .med-detail-item { padding: 8px; background: #f9fafb; border-radius: 4px; }
    .med-detail-label { font-size: 11px; color: #666; margin-bottom: 4px; font-weight: 600; }
    .med-detail-value { font-size: 13px; color: #1a1a1a; }
    .log-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    .log-table th { background: #E8EEF4; color: #14558f; padding: 10px; text-align: left; font-size: 12px; font-weight: 700; border-bottom: 2px solid #14558f; }
    .log-table td { padding: 10px; border-bottom: 1px solid #E8EEF4; font-size: 12px; color: #1a1a1a; }
    .log-table tr:nth-child(even) { background: #f9fafb; }
    .status-given { background: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 11px; }
    .status-denied { background: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 11px; }
    .status-held { background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 11px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; font-size: 12px; color: #999; }
    @media print { body { padding: 20px; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <img src="${logoUrl}" alt="DYS Logo" class="logo" />
    <div class="commonwealth">COMMONWEALTH OF MASSACHUSETTS</div>
    <div class="org-line">Executive Office for Health and Human Services</div>
    <div class="org-line">Department of Youth Services</div>
    <h1>Medication Administration Record</h1>
    <div class="subtitle">${data.programName || 'Program Name'}</div>
    <div class="subtitle">Resident ID: ${data.residentId} | Generated: ${new Date().toLocaleString()}</div>
  </div>
  
  <div class="section">
    <div class="section-title">Resident Information</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Full Name</div>
        <div class="info-value">${data.residentName}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Date of Birth</div>
        <div class="info-value">${data.dateOfBirth || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Room Number</div>
        <div class="info-value">${data.room || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Primary Physician</div>
        <div class="info-value">${data.primaryPhysician || 'Not assigned'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Last Medical Review</div>
        <div class="info-value">${data.lastMedicalReview || 'Not recorded'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Medical Status</div>
        <div class="info-value">Active Treatment</div>
      </div>
    </div>
    
    ${data.allergies ? `
    <div class="allergy-box">
      <div class="allergy-label">⚠️ KNOWN ALLERGIES</div>
      <div class="allergy-content">${data.allergies}</div>
    </div>
    ` : ''}
  </div>
  
  <div class="section">
    <div class="section-title">Current Medications</div>
    ${data.medications && data.medications.length > 0 ? data.medications.map((med: any) => `
      <div class="med-card">
        <div class="med-header">
          <div>
            <span class="med-name">${med.medicationName} ${med.dosage}</span>
          </div>
          <span class="med-frequency">${med.frequency}</span>
        </div>
        <div class="med-details">
          <div class="med-detail-item">
            <div class="med-detail-label">Current Count</div>
            <div class="med-detail-value" style="font-size: 18px; font-weight: bold; color: #14558f;">${med.currentCount}</div>
          </div>
          <div class="med-detail-item">
            <div class="med-detail-label">Prescribed By</div>
            <div class="med-detail-value">${med.prescribingPhysician || 'Not specified'}</div>
          </div>
          <div class="med-detail-item">
            <div class="med-detail-label">Special Instructions</div>
            <div class="med-detail-value">${med.specialInstructions || 'None'}</div>
          </div>
        </div>
      </div>
    `).join('') : '<p style="color: #999; text-align: center; padding: 20px;">No medications currently prescribed</p>'}
  </div>
  
  ${data.administrationLogs && data.administrationLogs.length > 0 ? `
  <div class="section">
    <div class="section-title">Medication Administration Log</div>
    <table class="log-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Medication</th>
          <th>Action</th>
          <th>Staff</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        ${data.administrationLogs.map((log: any) => `
          <tr>
            <td>${log.date}</td>
            <td>${log.time}</td>
            <td>${log.medication}</td>
            <td>
              <span class="status-${log.action === 'ADMINISTERED' ? 'given' : log.action === 'REFUSED' ? 'denied' : 'held'}">
                ${log.action === 'ADMINISTERED' ? 'Given' : log.action === 'REFUSED' ? 'Denied' : log.action === 'HELD' ? 'Held' : log.action}
              </span>
            </td>
            <td>${log.staff}</td>
            <td>${log.notes}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}
  
  <div class="footer">
    <p>This is an official medication administration record for ${data.residentName}</p>
    <p>Generated on ${new Date().toLocaleString()} | Page 1 of 1</p>
    <p style="margin-top: 10px; font-size: 10px;">CONFIDENTIAL - For authorized personnel only</p>
  </div>
</body>
</html>
  `;
}
