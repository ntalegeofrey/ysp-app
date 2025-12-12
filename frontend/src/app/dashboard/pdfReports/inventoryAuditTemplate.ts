import { logoUrl } from '@/app/utils/logo';

export function generateInventoryAuditHTML(data: any): string {
  const totalItems = data.items?.length || 0;
  const discrepancies = data.items?.filter((i: any) => i.physicalCount !== i.currentQuantity).length || 0;
  const totalSystemCount = data.items?.reduce((sum: number, i: any) => sum + (i.currentQuantity || 0), 0) || 0;
  const totalPhysicalCount = data.items?.reduce((sum: number, i: any) => sum + (i.physicalCount || 0), 0) || 0;
  const totalDifference = totalPhysicalCount - totalSystemCount;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Inventory Audit Report - ${data.auditDate}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; background: white; color: #1a1a1a; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #14558f; padding-bottom: 20px; }
    .logo { width: 120px; height: auto; margin-bottom: 15px; }
    .commonwealth { font-size: 20px; color: #14558f; font-weight: 700; margin-bottom: 8px; letter-spacing: 1px; text-transform: uppercase; }
    .org-line { font-size: 16px; color: #14558f; font-weight: 500; margin-bottom: 5px; }
    h1 { font-size: 28px; color: #1a1a1a; font-weight: 700; margin: 10px 0 8px 0; }
    .subtitle { font-size: 12px; color: #666; margin-bottom: 5px; }
    .section { margin-bottom: 25px; page-break-inside: avoid; }
    .section-title { font-size: 18px; font-weight: bold; color: #14558f; margin-bottom: 12px; border-bottom: 2px solid #E8EEF4; padding-bottom: 5px; }
    .info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 15px; }
    .info-item { padding: 12px; background: #E8EEF4; border-radius: 4px; text-align: center; }
    .info-label { font-size: 11px; color: #666; margin-bottom: 6px; font-weight: 600; text-transform: uppercase; }
    .info-value { font-size: 20px; color: #14558f; font-weight: bold; }
    .info-value.positive { color: #059669; }
    .info-value.negative { color: #dc2626; }
    .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px; }
    .summary-item { padding: 15px; background: #f0f9ff; border-left: 4px solid #14558f; }
    .summary-label { font-size: 12px; color: #666; margin-bottom: 4px; font-weight: 600; }
    .summary-value { font-size: 16px; color: #1a1a1a; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    thead { background: #14558f; color: white; }
    thead th { padding: 10px 8px; text-align: left; font-size: 12px; font-weight: 600; }
    tbody tr { border-bottom: 1px solid #E8EEF4; }
    tbody tr:nth-child(even) { background: #f9fafb; }
    tbody td { padding: 10px 8px; font-size: 13px; color: #1a1a1a; }
    .diff-positive { color: #059669; font-weight: 600; }
    .diff-negative { color: #dc2626; font-weight: 600; }
    .diff-zero { color: #999; }
    .signature-section { margin-top: 40px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; }
    .signature-box { border: 2px solid #14558f; padding: 20px; background: #f0f9ff; min-height: 100px; }
    .signature-label { font-size: 12px; color: #666; font-weight: 600; margin-bottom: 50px; }
    .signature-line { border-top: 2px solid #14558f; padding-top: 5px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; font-size: 12px; color: #999; }
    @media print { 
      body { padding: 20px; } 
      .no-print { display: none; }
      thead { display: table-header-group; }
      tr { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="${logoUrl}" alt="DYS Logo" class="logo" />
    <div class="commonwealth">COMMONWEALTH OF MASSACHUSETTS</div>
    <div class="org-line">Executive Office for Health and Human Services</div>
    <div class="org-line">Department of Youth Services</div>
    <h1>Inventory Audit Report</h1>
    <div class="subtitle">${data.programName || 'Program Name'}</div>
    <div class="subtitle">Audit Date: ${new Date(data.auditDate).toLocaleDateString()}</div>
    <div class="subtitle">Generated: ${new Date().toLocaleString()}</div>
    <div class="subtitle">Audited By: ${data.auditedBy || 'Staff Member'}</div>
  </div>
  
  <div class="section">
    <div class="section-title">Audit Summary</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Total Items</div>
        <div class="info-value">${totalItems}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Discrepancies</div>
        <div class="info-value ${discrepancies > 0 ? 'negative' : 'positive'}">${discrepancies}</div>
      </div>
      <div class="info-item">
        <div class="info-label">System Total</div>
        <div class="info-value">${totalSystemCount}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Physical Total</div>
        <div class="info-value ${totalDifference > 0 ? 'positive' : totalDifference < 0 ? 'negative' : ''}">${totalPhysicalCount}</div>
      </div>
    </div>
    
    <div class="summary-grid">
      <div class="summary-item">
        <div class="summary-label">Overall Variance</div>
        <div class="summary-value" style="color: ${totalDifference > 0 ? '#059669' : totalDifference < 0 ? '#dc2626' : '#666'};">
          ${totalDifference > 0 ? '+' : ''}${totalDifference} units
        </div>
      </div>
      <div class="summary-item">
        <div class="summary-label">Audit Status</div>
        <div class="summary-value" style="color: ${discrepancies === 0 ? '#059669' : '#dc2626'};">
          ${discrepancies === 0 ? '✓ All Counts Match' : '⚠ Discrepancies Found'}
        </div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">Detailed Inventory Audit</div>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Item Name</th>
          <th style="width: 15%;">Category</th>
          <th style="width: 15%;">Location</th>
          <th style="width: 10%; text-align: center;">System</th>
          <th style="width: 10%; text-align: center;">Physical</th>
          <th style="width: 10%; text-align: center;">Diff</th>
          <th style="width: 15%;">Notes</th>
        </tr>
      </thead>
      <tbody>
        ${data.items?.map((item: any) => {
          const diff = item.physicalCount - item.currentQuantity;
          const diffClass = diff > 0 ? 'diff-positive' : diff < 0 ? 'diff-negative' : 'diff-zero';
          return `
            <tr>
              <td><strong>${item.itemName}</strong></td>
              <td>${item.category}</td>
              <td>${item.location || 'N/A'}</td>
              <td style="text-align: center; font-weight: 600;">${item.currentQuantity}</td>
              <td style="text-align: center; font-weight: 600;">${item.physicalCount}</td>
              <td style="text-align: center;" class="${diffClass}">${diff > 0 ? '+' : ''}${diff}</td>
              <td style="font-size: 11px; color: #666;">${item.notes || '-'}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  </div>
  
  <div class="signature-section">
    <div class="signature-box">
      <div class="signature-label">Audited By</div>
      <div class="signature-line">
        <strong>${data.auditedBy || '_______________________'}</strong><br>
        <span style="font-size: 11px; color: #666;">Signature & Date</span>
      </div>
    </div>
    <div class="signature-box">
      <div class="signature-label">Reviewed By</div>
      <div class="signature-line">
        <strong>_______________________</strong><br>
        <span style="font-size: 11px; color: #666;">Signature & Date</span>
      </div>
    </div>
  </div>
  
  <div class="footer">
    <p>This is an official Department of Youth Services inventory audit document.</p>
    <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
    <p style="margin-top: 5px; font-size: 10px;">Commonwealth of Massachusetts | Department of Youth Services</p>
  </div>
</body>
</html>
  `;
}
