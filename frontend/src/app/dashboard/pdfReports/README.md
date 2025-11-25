# PDF Report Templates

This folder contains all PDF/print report HTML templates for the YSP application.

## 📁 Structure

All PDF report generation logic is centralized here for easy maintenance and reusability.

### Current Templates

- **`incidentReportTemplate.ts`** - Incident report PDF template
- **`shakedownReportTemplate.ts`** - Shakedown report PDF template

### Future Templates (to be migrated)

- `firePlanTemplate.ts` - Fire plan/evacuation PDF template
- `drillReportTemplate.ts` - Fire drill report PDF template
- `floorPlanTemplate.ts` - Floor plan visualization PDF template
- `ucrReportTemplate.ts` - UCR report PDF template

## 🎨 Design Standards

All templates follow these design standards:

### Color Scheme
- **Primary Blue:** `#1e40af` (headers, borders, section titles)
- **Light Blue Background:** `#eff6ff` (info items, table headers)
- **Pale Blue Borders:** `#dbeafe` (section underlines, table borders)
- **Sky Blue Background:** `#f0f9ff` (signature boxes)

### Typography
- **Font Family:** Arial, sans-serif
- **Title Size:** 28px
- **Section Headers:** 18px, bold, blue
- **Body Text:** 14px
- **Labels:** 12px, bold

### Layout
- **Commonwealth Header:** "COMMONWEALTH OF MASSACHUSETTS" in blue
- **DYS Logo:** 120px width at top center
- **Page Padding:** 40px (print: 20px)
- **Section Spacing:** 25px margin-bottom
- **Grid Layouts:** 2-column responsive grids for info items

### Components
- **Info Grid:** 2-column layout with blue background items
- **Tables:** Blue headers, alternating row colors
- **Signature Box:** Blue border, light blue background
- **Footer:** Centered, small text with timestamp

## 📝 Usage

### Import Templates

```typescript
import { generateIncidentReportHTML, generateShakedownReportHTML } from '../pdfReports';
```

### Use in Print Function

```typescript
const printReport = (data: any) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const html = generateIncidentReportHTML(data);
  
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  
  setTimeout(() => printWindow.print(), 250);
};
```

## ✅ Benefits of Centralization

1. **Single Source of Truth** - All PDF templates in one place
2. **Easy Maintenance** - Update styles globally by editing template files
3. **Reusability** - Templates can be used across different pages
4. **Consistency** - All reports follow the same design standards
5. **Testability** - Each template can be tested independently
6. **Smaller Page Files** - Component files are cleaner without huge HTML strings

## 🔧 Adding New Templates

1. Create new template file: `[reportName]Template.ts`
2. Export function: `export function generate[ReportName]HTML(data: any): string`
3. Follow existing design standards for consistency
4. Add export to `index.ts`
5. Import and use in your page component

## 📄 Template Function Signature

```typescript
export function generateReportHTML(data: any): string {
  // Logo URL
  const logoUrl = 'https://storage.googleapis.com/...';
  
  // Return complete HTML document as string
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Report Title</title>
        <style>
          /* All styles inline for print compatibility */
        </style>
      </head>
      <body>
        <!-- Report content -->
      </body>
    </html>
  `;
}
```

## 🎯 Best Practices

- ✅ Keep all styles inline (no external CSS)
- ✅ Use template literals for dynamic content
- ✅ Include `@media print` styles
- ✅ Test print preview in multiple browsers
- ✅ Ensure logo URLs are absolute paths
- ✅ Include timestamps and metadata in footers
- ✅ Use semantic HTML for accessibility
- ✅ Handle missing/optional data gracefully

## 📊 Migration Status

- ✅ Incident Reports - **Migrated**
- ✅ Shakedown Reports - **Migrated**
- ⏳ Fire Plans - Pending
- ⏳ Drill Reports - Pending
- ⏳ Floor Plans - Pending
- ⏳ UCR Reports - Pending
