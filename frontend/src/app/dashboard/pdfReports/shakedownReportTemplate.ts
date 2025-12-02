import { logoUrl } from '@/app/utils/logo';

export function generateShakedownReportHTML(data: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Shakedown Report - ${data.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; background: white; color: #1a1a1a; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #14558f; padding-bottom: 20px; }
    .logo { width: 120px; height: auto; margin-bottom: 15px; }
    .commonwealth { font-size: 20px; color: #14558f; font-weight: 700; margin-bottom: 8px; letter-spacing: 1px; text-transform: uppercase; }
    .org-line { font-size: 14px; color: #14558f; font-weight: 500; margin-bottom: 5px; }
    h1 { font-size: 24px; color: #1a1a1a; font-weight: 700; margin: 15px 0 10px 0; }
    .subtitle { font-size: 16px; color: #666; margin-bottom: 5px; }
    .section { margin-bottom: 25px; page-break-inside: avoid; }
    .section-title { font-size: 18px; font-weight: bold; color: #14558f; margin-bottom: 12px; border-bottom: 2px solid #E8EEF4; padding-bottom: 5px; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 15px; }
    .info-item { padding: 10px; background: #E8EEF4; border-radius: 4px; }
    .info-label { font-size: 12px; color: #666; margin-bottom: 4px; font-weight: 600; }
    .info-value { font-size: 14px; color: #1a1a1a; }
    .full-width { grid-column: 1 / -1; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    table th, table td { border: 1px solid #E8EEF4; padding: 8px; text-align: left; font-size: 13px; }
    table th { background: #E8EEF4; font-weight: bold; color: #14558f; }
    table tr:nth-child(even) { background: #f9fafb; }
    .text-block { padding: 15px; background: #f9fafb; border-left: 4px solid #14558f; margin-bottom: 15px; }
    .text-label { font-size: 12px; color: #666; margin-bottom: 8px; font-weight: 600; }
    .text-content { font-size: 14px; line-height: 1.6; color: #1a1a1a; white-space: pre-wrap; }
    .signature-box { border: 2px solid #14558f; padding: 20px; margin-top: 30px; background: #E8EEF4; }
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
    <h1>Shakedown Report</h1>
    <div class="subtitle">${data.programName || 'Program Name'}</div>
    <div class="subtitle">Phone: (617) 951-2409</div>
    <div class="subtitle">Address: ${data.programAddress || 'Program Address'}</div>
    <div class="subtitle">Report ID: ${data.id} | Generated: ${new Date().toLocaleString()}</div>
  </div>
  
  <div class="section">
    <div class="section-title">Report Details</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Shakedown Date</div>
        <div class="info-value">${new Date(data.shakedownDate).toLocaleDateString()}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Shift</div>
        <div class="info-value">${data.shift || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Contraband Found</div>
        <div class="info-value" style="font-weight: bold; color: ${data.contrabandFound ? '#c00' : '#060'};">${data.contrabandFound ? 'YES' : 'NO'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Status</div>
        <div class="info-value">${data.status}</div>
      </div>
    </div>
  </div>
  
  ${data.commonAreaSearches ? `
  <div class="section">
    <div class="section-title">Common Area Searches</div>
    <table>
      <thead>
        <tr>
          <th>Area</th>
          <th>Staff Searching</th>
          <th>Contraband Found</th>
          <th>Comments</th>
        </tr>
      </thead>
      <tbody>
        ${JSON.parse(data.commonAreaSearches).map((s: any) => `
          <tr>
            <td>${s.area}</td>
            <td>${s.staff || 'N/A'}</td>
            <td>${s.contrabandFound}</td>
            <td>${s.comments || ''}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}
  
  ${data.schoolAreaSearches ? `
  <div class="section">
    <div class="section-title">School Area Searches</div>
    <table>
      <thead>
        <tr>
          <th>Area</th>
          <th>Staff Searching</th>
          <th>Contraband Found</th>
          <th>Comments</th>
        </tr>
      </thead>
      <tbody>
        ${JSON.parse(data.schoolAreaSearches).map((s: any) => `
          <tr>
            <td>${s.area}</td>
            <td>${s.staff || 'N/A'}</td>
            <td>${s.contrabandFound}</td>
            <td>${s.comments || ''}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}
  
  ${data.residentRoomSearches ? `
  <div class="section">
    <div class="section-title">Resident Room Searches</div>
    <table>
      <thead>
        <tr>
          <th>Unit</th>
          <th>Room</th>
          <th>Staff</th>
          <th>Result</th>
          <th>Comments</th>
        </tr>
      </thead>
      <tbody>
        ${JSON.parse(data.residentRoomSearches).map((s: any) => `
          <tr>
            <td>${s.unit}</td>
            <td>${s.room}</td>
            <td>${s.staff || 'N/A'}</td>
            <td>${s.result}</td>
            <td>${s.comments || ''}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}
  
  ${data.additionalComments ? `
  <div class="section">
    <div class="section-title">Additional Comments</div>
    <div class="info-item full-width">
      <div class="info-value" style="white-space: pre-wrap;">${data.additionalComments}</div>
    </div>
  </div>
  ` : ''}
  
  <div class="signature-box">
    <div class="section-title">Certification & Signature</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Report Completed By</div>
        <div class="info-value">${data.reportCompletedBy}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Email</div>
        <div class="info-value">${data.reportCompletedByEmail || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Signature Date & Time</div>
        <div class="info-value">${new Date(data.signatureDatetime).toLocaleString()}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Status</div>
        <div class="info-value">${data.status}</div>
      </div>
    </div>
  </div>

  <div class="footer">
    <p>This is an official shakedown report for ${data.programName || 'the program'}.</p>
    <p>Report generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
  </div>
</body>
</html>`;
}
