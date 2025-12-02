import { logoUrl } from '@/app/utils/logo';

export function generateRepairHistoryReportHTML(data: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Repair History Report - ${data.resident.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; background: white; color: #1a1a1a; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #14558f; padding-bottom: 20px; }
    .logo { width: 120px; height: auto; margin-bottom: 15px; }
    .commonwealth { font-size: 14px; color: #14558f; font-weight: 600; margin-bottom: 8px; letter-spacing: 0.5px; }
    h1 { font-size: 28px; color: #14558f; margin-bottom: 10px; }
    .subtitle { font-size: 16px; color: #666; margin-bottom: 5px; }
    .section { margin-bottom: 25px; page-break-inside: avoid; }
    .section-title { font-size: 18px; font-weight: bold; color: #14558f; margin-bottom: 12px; border-bottom: 2px solid #E8EEF4; padding-bottom: 5px; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 15px; }
    .info-item { padding: 10px; background: #E8EEF4; border-radius: 4px; }
    .info-label { font-size: 12px; color: #666; margin-bottom: 4px; font-weight: 600; }
    .info-value { font-size: 14px; color: #1a1a1a; }
    .full-width { grid-column: 1 / -1; }
    .text-block { padding: 15px; background: #f9fafb; border-left: 4px solid #14558f; margin-bottom: 15px; }
    .text-label { font-size: 12px; color: #666; margin-bottom: 8px; font-weight: 600; }
    .text-content { font-size: 14px; line-height: 1.6; color: #1a1a1a; white-space: pre-wrap; }
    .repair-r3 { background: #fee2e2; color: #991b1b; padding: 5px 10px; border-radius: 4px; display: inline-block; font-weight: bold; }
    .repair-r2 { background: #fef3c7; color: #92400e; padding: 5px 10px; border-radius: 4px; display: inline-block; font-weight: bold; }
    .repair-r1 { background: #E8EEF4; color: #14558f; padding: 5px 10px; border-radius: 4px; display: inline-block; font-weight: bold; }
    .status-completed { background: #d1fae5; color: #065f46; padding: 5px 10px; border-radius: 4px; display: inline-block; font-weight: bold; }
    .status-active { background: #fee2e2; color: #991b1b; padding: 5px 10px; border-radius: 4px; display: inline-block; font-weight: bold; }
    .status-pending { background: #fef3c7; color: #92400e; padding: 5px 10px; border-radius: 4px; display: inline-block; font-weight: bold; }
    .repair-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    .repair-table th { background: #14558f; color: white; padding: 10px; text-align: left; font-size: 12px; border: 1px solid #14558f; }
    .repair-table td { padding: 10px; border: 1px solid #ddd; font-size: 13px; }
    .repair-table tr:nth-child(even) { background: #f9fafb; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; font-size: 12px; color: #999; }
    @media print { body { padding: 20px; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <img src="${logoUrl}" alt="DYS Logo" class="logo" />
    <div class="commonwealth">COMMONWEALTH OF MASSACHUSETTS</div>
    <div class="subtitle">Executive Office for Health and Human Services</div>
    <div class="subtitle">Department of Youth Services</div>
    <h1>Behavioral Repair History Report</h1>
    <div class="subtitle">${data.programName || 'Program Name'}</div>
    <div class="subtitle">Phone: (617) 951-2409</div>
    <div class="subtitle">Address: ${data.programAddress || 'Program Address'}</div>
    <div class="subtitle">Report Generated: ${new Date().toLocaleString()}</div>
  </div>
  
  <div class="section">
    <div class="section-title">Resident Information</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Resident Name</div>
        <div class="info-value">${data.resident.name}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Resident ID</div>
        <div class="info-value">${data.resident.id}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Total Repairs</div>
        <div class="info-value">${data.repairs.length}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Report Period</div>
        <div class="info-value">${data.reportPeriod || 'All Time'}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Repair Summary</div>
    <table class="repair-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Violation</th>
          <th>Assigned By</th>
          <th>Duration</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${data.repairs.map((repair: any) => `
          <tr>
            <td>${new Date(repair.repairStartDate || repair.date).toLocaleDateString()}</td>
            <td><span class="repair-${repair.repairLevel?.toLowerCase() || repair.type?.toLowerCase()}">${repair.repairLevel || repair.type}</span></td>
            <td>${repair.infractionBehavior || repair.violation}</td>
            <td>${repair.assignedByName || repair.assignedBy || 'N/A'}</td>
            <td>${repair.duration || calculateDuration(repair.repairStartDate, repair.repairEndDate)}</td>
            <td><span class="status-${repair.status?.toLowerCase()}">${repair.status}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Notes & Observations</div>
    <div class="text-block">
      <div class="text-content">This report contains ${data.repairs.length} repair record(s) for ${data.resident.name}. Each repair intervention is documented according to program behavioral management protocols.</div>
    </div>
  </div>

  <div class="footer">
    <p>This is an official repair history report for ${data.programName || 'the program'}.</p>
    <p>Report generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
    <p>Youth Support Program - Behavioral Management System</p>
  </div>
</body>
</html>`;
}

function calculateDuration(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return 'N/A';
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return days === 1 ? '1 day' : `${days} days`;
}
