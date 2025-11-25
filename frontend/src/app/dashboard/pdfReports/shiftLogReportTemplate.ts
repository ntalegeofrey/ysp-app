import { logoUrl } from '@/app/utils/logo';

export function generateShiftLogReportHTML(data: any): string {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return 'N/A';
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const staffAssignments = data.staffAssignments || [];
  const equipmentCounts = data.equipmentCounts || {};

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shift Log Report - ${data.programName || 'Program'}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Arial', sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #1a1a1a;
      padding: 30px;
      background: white;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 3px solid #1e40af;
    }
    
    .logo {
      max-width: 180px;
      height: auto;
    }
    
    .title-section {
      text-align: right;
    }
    
    .report-title {
      font-size: 22pt;
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 5px;
    }
    
    .report-subtitle {
      font-size: 11pt;
      color: #666;
    }
    
    .info-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 20px;
    }
    
    .info-row {
      display: flex;
      margin-bottom: 8px;
    }
    
    .info-row:last-child {
      margin-bottom: 0;
    }
    
    .info-label {
      font-weight: bold;
      min-width: 150px;
      color: #475569;
    }
    
    .info-value {
      color: #1a1a1a;
      flex: 1;
    }
    
    .section {
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 14pt;
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 12px;
      padding-bottom: 5px;
      border-bottom: 2px solid #e2e8f0;
    }
    
    .subsection-title {
      font-size: 12pt;
      font-weight: bold;
      color: #334155;
      margin-bottom: 8px;
      margin-top: 15px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
    }
    
    th {
      background: #1e40af;
      color: white;
      padding: 10px;
      text-align: left;
      font-weight: bold;
      font-size: 10pt;
    }
    
    td {
      padding: 8px 10px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 10pt;
    }
    
    tr:nth-child(even) {
      background: #f8fafc;
    }
    
    .equipment-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 15px;
    }
    
    .equipment-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 10px;
      text-align: center;
    }
    
    .equipment-label {
      font-size: 9pt;
      color: #64748b;
      margin-bottom: 4px;
    }
    
    .equipment-value {
      font-size: 16pt;
      font-weight: bold;
      color: #1e40af;
    }
    
    .text-content {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 12px;
      min-height: 60px;
      white-space: pre-wrap;
      line-height: 1.6;
    }
    
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 9pt;
      font-weight: bold;
    }
    
    .status-routine {
      background: #d1fae5;
      color: #065f46;
    }
    
    .status-warning {
      background: #fef3c7;
      color: #92400e;
    }
    
    .status-high {
      background: #fed7aa;
      color: #9a3412;
    }
    
    .status-critical {
      background: #fecaca;
      color: #991b1b;
    }
    
    .certification-section {
      background: #f1f5f9;
      border: 2px solid #1e40af;
      border-radius: 6px;
      padding: 15px;
      margin-top: 20px;
    }
    
    .cert-item {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }
    
    .cert-checkbox {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid #1e40af;
      border-radius: 3px;
      margin-right: 10px;
      position: relative;
      background: white;
    }
    
    .cert-checkbox.checked::after {
      content: '✓';
      position: absolute;
      top: -3px;
      left: 2px;
      font-size: 14pt;
      color: #1e40af;
      font-weight: bold;
    }
    
    .signature-box {
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 12px;
      margin-top: 10px;
      background: white;
    }
    
    .signature-line {
      border-bottom: 1px solid #000;
      margin: 10px 0 5px 0;
      min-height: 20px;
    }
    
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 9pt;
      color: #64748b;
    }
    
    @media print {
      body {
        padding: 15px;
      }
      
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="${logoUrl}" alt="DYS Logo" class="logo" />
    <div class="title-section">
      <div class="report-title">Shift Log Report</div>
      <div class="report-subtitle">Department of Youth Services</div>
    </div>
  </div>

  <!-- Program & Shift Information -->
  <div class="info-box">
    <div class="info-row">
      <span class="info-label">Program:</span>
      <span class="info-value">${data.programName || 'N/A'}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Shift Date:</span>
      <span class="info-value">${formatDate(data.shiftDate)}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Shift Type:</span>
      <span class="info-value">${data.shiftType || 'N/A'}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Unit Supervisor:</span>
      <span class="info-value">${data.unitSupervisor || 'N/A'}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Overall Status:</span>
      <span class="info-value">
        <span class="status-badge status-${(data.overallStatus || 'routine').toLowerCase()}">
          ${data.overallStatus || 'N/A'}
        </span>
      </span>
    </div>
  </div>

  <!-- On-Duty Staff Assignments -->
  <div class="section">
    <div class="section-title">On-Duty Staff Assignments</div>
    ${staffAssignments.length > 0 ? `
      <table>
        <thead>
          <tr>
            <th>Staff Member</th>
            <th>Position</th>
            <th>Duties</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${staffAssignments.map((staff: any) => `
            <tr>
              <td>${staff.name || 'N/A'}</td>
              <td>${staff.position || 'N/A'}</td>
              <td>${staff.duties || 'N/A'}</td>
              <td>${staff.status || 'N/A'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : '<p class="text-content">No staff assignments recorded.</p>'}
  </div>

  <!-- Equipment Count -->
  <div class="section">
    <div class="section-title">Equipment Count</div>
    ${Object.keys(equipmentCounts).length > 0 ? `
      <div class="equipment-grid">
        ${Object.entries(equipmentCounts).map(([key, value]) => `
          <div class="equipment-item">
            <div class="equipment-label">${key.replace(/([A-Z])/g, ' $1').trim()}</div>
            <div class="equipment-value">${value}</div>
          </div>
        `).join('')}
      </div>
    ` : '<p class="text-content">No equipment counts recorded.</p>'}
  </div>

  <!-- Residents on Unit -->
  <div class="section">
    <div class="section-title">Residents on Unit</div>
    <div class="info-row">
      <span class="info-label">Total Count:</span>
      <span class="info-value">${data.residentCount || 0}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Resident Initials:</span>
      <span class="info-value">${data.residentInitials || 'N/A'}</span>
    </div>
    
    <div class="subsection-title">General Comments</div>
    <div class="text-content">${data.residentComments || 'No comments provided.'}</div>
  </div>

  <!-- Incidents & Events -->
  <div class="section">
    <div class="section-title">Incidents & Events</div>
    <div class="text-content">${data.incidentsEvents || 'No incidents or events reported.'}</div>
  </div>

  <!-- Shift Summary -->
  <div class="section">
    <div class="section-title">Shift Summary</div>
    <div class="info-row">
      <span class="info-label">Follow-up Required:</span>
      <span class="info-value">${data.followUpRequired || 'No'}</span>
    </div>
    
    <div class="subsection-title">Summary</div>
    <div class="text-content">${data.shiftSummary || 'No summary provided.'}</div>
  </div>

  <!-- Certification & Signature -->
  <div class="certification-section">
    <div class="section-title" style="border-bottom: none; margin-bottom: 15px;">Certification & Signature</div>
    
    <div class="cert-item">
      <span class="cert-checkbox ${data.certificationComplete ? 'checked' : ''}"></span>
      <span>I certify that all information in this shift log is accurate and complete to the best of my knowledge.</span>
    </div>
    
    <div class="cert-item">
      <span class="cert-checkbox ${data.certEquipmentVerified ? 'checked' : ''}"></span>
      <span>I confirm all equipment counts have been verified and documented correctly.</span>
    </div>
    
    <div class="cert-item">
      <span class="cert-checkbox ${data.certShiftEventsAccurate ? 'checked' : ''}"></span>
      <span>I attest that this log reflects all actual shift events and resident interactions.</span>
    </div>
    
    <div class="signature-box">
      <div class="info-row">
        <span class="info-label">Report Completed By:</span>
        <span class="info-value">${data.reportCompletedBy || 'N/A'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email:</span>
        <span class="info-value">${data.reportCompletedByEmail || 'N/A'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Certification Date & Time:</span>
        <span class="info-value">${formatDateTime(data.certificationDatetime)}</span>
      </div>
      
      <div style="margin-top: 20px;">
        <div style="font-size: 9pt; color: #64748b; margin-bottom: 5px;">Signature:</div>
        <div class="signature-line"></div>
      </div>
    </div>
  </div>

  <div class="footer">
    <p>Generated on ${new Date().toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</p>
    <p>Shift Log ID: ${data.id || 'N/A'} | Program ID: ${data.programId || 'N/A'}</p>
    <p style="margin-top: 5px; font-style: italic;">This is an official document of the Massachusetts Department of Youth Services</p>
  </div>
</body>
</html>
  `;
}
