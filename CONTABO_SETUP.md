# Contabo Object Storage Setup

This application uses Contabo Object Storage (S3-compatible) to store shift log attachments.

## Configuration

### 1. Add Credentials to `.env` File

Copy the credentials from your Contabo dashboard and add them to your `/opt/ysp-app/.env` file:

```bash
# Contabo S3 Object Storage
S3_ENDPOINT=https://usc1.contabostorage.com
S3_REGION=us-east-1
S3_ACCESS_KEY=6242823db36ae58adb6052b918ca2723
S3_SECRET_KEY=064083264fc2f0cc909efc436ee4d804
S3_BUCKET_NAME=ysp-app
S3_PUBLIC_URL=https://usc1.contabostorage.com/ysp-app
```

### 2. Your Contabo Details

**Object Storage Name:** Object Storage US-central 9818  
**Region:** United States (Central)  
**Access Key:** `6242823db36ae58adb6052b918ca2723`  
**Secret Key:** `064083264fc2f0cc909efc436ee4d804`  
**Bucket Name:** `ysp-app`  
**Bucket URL:** `https://usc1.contabostorage.com/ysp-app`

### 3. Restart Backend

After adding the credentials, restart the backend container:

```bash
cd /opt/ysp-app
docker compose restart backend
```

## How It Works

### Upload Flow
1. User uploads a file in the shift log form
2. Frontend sends file to: `POST /api/programs/{programId}/logbook/shift-logs/{logId}/attachments`
3. Backend uploads to Contabo bucket at path: `shift-logs/{uuid}.{ext}`
4. File URL is saved to database: `https://usc1.contabostorage.com/ysp-app/shift-logs/{uuid}.{ext}`
5. Attachment info is returned to frontend

### PDF Generation
- When printing a shift log, all attachments are included in the PDF
- Shows: File name, type, size, and upload date
- Includes clickable links to view/download files

### Fallback Behavior
- If S3 credentials are not configured, files are stored locally in `/opt/ysp-app/uploads`
- Files are served via nginx at `/uploads/*`
- This ensures the system works even without S3

## Bucket Permissions

Make sure your Contabo bucket is configured with:
- **Public Access:** Inactive (files accessed via direct URLs)
- **CORS:** Enabled if you need browser uploads
- **Access Control:** Configured for your access keys

## Testing

1. Go to Dashboard → Logbook
2. Create a new shift log
3. Upload a PDF or image file
4. Submit the log
5. Print/view the log PDF - attachments should appear

## Troubleshooting

### Files not uploading
- Check backend logs: `docker logs ysp-app-backend`
- Verify S3 credentials in `.env`
- Test connection from backend container

### Files not showing in PDF
- Verify attachment is in database: Check `shift_log_attachments` table
- Ensure `fileUrl` is populated correctly
- Check if `attachments` array is in API response

### Access denied errors
- Verify Access Key and Secret Key are correct
- Check bucket name matches exactly
- Ensure bucket permissions allow your keys
