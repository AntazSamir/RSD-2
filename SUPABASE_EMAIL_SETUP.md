# Supabase Email Configuration Guide

## Issue
Password reset emails are failing with HTTP 500 error from Supabase. This indicates that Supabase's email service is not properly configured.

## Solution

### Step 1: Enable Email Authentication in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Ensure **Email** provider is enabled
5. Click **Save**

### Step 2: Configure Email Templates

1. In Supabase Dashboard, go to **Authentication** → **Email Templates**
2. You should see templates for:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password ← **This is the one we need**

3. For **Reset Password** template:
   - Click on it to edit
   - Ensure the template is active
   - The default template should work, but you can customize it
   - Make sure the redirect URL includes: `{{ .SiteURL }}/set-new-password`

### Step 3: Configure Site URL

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `http://localhost:3000` (for development)
3. Add to **Redirect URLs**:
   - `http://localhost:3000/set-new-password`
   - `http://localhost:3000/**` (for all routes)
4. Click **Save**

### Step 4: Verify Email Service Status

1. Go to **Settings** → **API**
2. Check that your project is active
3. Verify your project URL and anon key match your `.env.local` file

### Step 5: Check Email Rate Limits

1. Go to **Settings** → **Usage**
2. Check if you've exceeded email sending limits
3. Free tier: 3 emails per hour per user
4. If exceeded, wait before testing again

### Step 6: Test Email Sending

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Try sending a test email to a user
3. Check if emails are being sent successfully

## Alternative: Use Custom SMTP (Optional)

If Supabase's default email service doesn't work, you can configure custom SMTP:

1. Go to **Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Enable **Custom SMTP**
4. Enter your SMTP credentials:
   - **Host**: Your SMTP server (e.g., `smtp.gmail.com`)
   - **Port**: Usually 587 or 465
   - **Username**: Your email address
   - **Password**: Your email password or app password
   - **Sender email**: The email address to send from
   - **Sender name**: Display name for emails

## Troubleshooting

### Error: "Error sending recovery email" (HTTP 500)

**Possible causes:**
1. Email service not enabled in Supabase
2. Email templates not configured
3. Site URL not set correctly
4. Rate limit exceeded
5. Invalid redirect URL

**Solutions:**
1. Follow Steps 1-3 above
2. Wait a few minutes if rate limited
3. Verify redirect URL matches your application URL
4. Check Supabase project status

### Error: "User not found"

This is actually a security feature - Supabase doesn't reveal if an email exists. The application will show a success message regardless.

### Emails going to spam

1. Verify your sender email in Supabase
2. Check SPF/DKIM records if using custom domain
3. Ask users to check spam folder

## Testing

After configuration:

1. Restart your Next.js development server
2. Go to `/reset-password`
3. Enter a registered email address
4. Click "Send Reset Link"
5. Check your email inbox (and spam folder)
6. Click the reset link
7. Set a new password

## Current Status

The application code has been improved to:
- ✅ Provide better error messages
- ✅ Handle HTTP 500 errors gracefully
- ✅ Validate email format
- ✅ Show user-friendly messages
- ✅ Prevent email enumeration attacks

**Next Step:** Configure Supabase email settings as described above.

---

For more information, see: https://supabase.com/docs/guides/auth/auth-email

