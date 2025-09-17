# Brevo SMTP Setup Guide

This guide provides step-by-step instructions for setting up Brevo SMTP with your restaurant dashboard.

## Prerequisites

- A Brevo (Sendinblue) account
- Access to your restaurant dashboard codebase
- Ability to modify environment variables

## Step 1: Create a Brevo Account

1. Go to [https://www.brevo.com/](https://www.brevo.com/)
2. Click "Start Free" or "Login" if you already have an account
3. Complete the registration process

## Step 2: Get SMTP Credentials

1. Log in to your Brevo dashboard
2. Navigate to **SMTP & API** > **SMTP**
3. Note down the following information:
   - **SMTP Server**: smtp-relay.sendinblue.com
   - **Port**: 587 (for TLS) or 465 (for SSL)
   - **SMTP Username**: Your Brevo login email
   - **SMTP Password**: Your SMTP key (NOT your account password)

## Step 3: Generate SMTP Key

If you don't have an SMTP key yet:

1. In the SMTP settings page, click **"Generate new SMTP key"**
2. Give your key a name (e.g., "Restaurant Dashboard")
3. Click **"Generate"**
4. Copy the generated key - this is your `BREVO_SMTP_PASS`

## Step 4: Configure Environment Variables

Add the following to your `.env.local` file in your project root:

```env
# Brevo SMTP Configuration
BREVO_SMTP_HOST=smtp-relay.sendinblue.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=your_brevo_login_email@example.com
BREVO_SMTP_PASS=your_generated_smtp_key
BREVO_SENDER_EMAIL=sender@yourdomain.com
BREVO_SENDER_NAME="Restaurant Dashboard"
```

Replace the placeholder values with your actual Brevo credentials.

## Step 5: Verify Sender Email (Optional but Recommended)

To avoid emails going to spam:

1. In your Brevo dashboard, go to **Senders & Domains** > **Senders**
2. Click **"Add new sender"**
3. Enter your sender information:
   - **Sender name**: Restaurant Dashboard
   - **Sender email**: sender@yourdomain.com (same as BREVO_SENDER_EMAIL)
   - **Reply email**: (optional, can be the same as sender email)
4. Click **"Send confirmation email"**
5. Check your inbox and click the confirmation link

## Step 6: Test the Configuration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit the test email page:
   [http://localhost:3000/test-email](http://localhost:3000/test-email)

3. Enter a recipient email address and click "Send Test Email"

4. Check your inbox for the test email

## Troubleshooting

### Common Issues

1. **"Authentication failed"**:
   - Double-check your SMTP username and password
   - Ensure you're using the SMTP key, not your account password
   - Verify your Brevo account is active

2. **"Connection refused"**:
   - Check that you're using the correct SMTP server (smtp-relay.sendinblue.com)
   - Verify the port number (587 for TLS, 465 for SSL)
   - Ensure your firewall isn't blocking outbound connections

3. **Emails going to spam**:
   - Verify your sender email address in Brevo
   - Ensure your email content follows best practices
   - Check your domain's SPF and DKIM records

### Environment Variables Not Loading

1. Ensure your `.env.local` file is in the project root directory
2. Restart your development server after adding environment variables
3. Check that there are no syntax errors in your `.env.local` file

## Brevo Account Limits

### Free Plan
- 300 emails per day
- Limited to 100 contacts in marketing lists
- Basic support

### Premium Plans
- Higher sending limits
- Advanced features
- Priority support

For a restaurant dashboard, the free plan may be sufficient for transactional emails, but consider upgrading if you need to send marketing emails or have higher volume requirements.

## Security Best Practices

1. **Never commit credentials**: Keep your `.env.local` file in `.gitignore`
2. **Use environment variables**: Store sensitive information in environment variables
3. **Regular credential rotation**: Periodically regenerate your SMTP key
4. **Monitor sending activity**: Regularly check your Brevo dashboard for unusual activity

## Advanced Configuration

### Using SSL (Port 465)

If you prefer to use SSL instead of TLS:

```env
BREVO_SMTP_HOST=smtp-relay.sendinblue.com
BREVO_SMTP_PORT=465
BREVO_SMTP_SECURE=true
BREVO_SMTP_USER=your_brevo_login_email@example.com
BREVO_SMTP_PASS=your_generated_smtp_key
BREVO_SENDER_EMAIL=sender@yourdomain.com
BREVO_SENDER_NAME="Restaurant Dashboard"
```

### Using Brevo API Key

For additional features, you can also configure your Brevo API key:

```env
BREVO_API_KEY=your_brevo_api_key
```

## Integration with Supabase (Optional)

If you're using Supabase database triggers to send emails:

1. Create a Supabase function that calls your Next.js API route
2. Set up database triggers for INSERT/UPDATE operations
3. The API route sends the appropriate email notification

Example Supabase function:
```sql
CREATE OR REPLACE FUNCTION send_reservation_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  -- Call your Next.js API endpoint
  -- This would typically be done via an HTTP request
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Support

For issues with the restaurant dashboard email integration:
- Check the console logs for error messages
- Review the documentation in `docs/brevo-email.md`
- Verify your Brevo account settings

For issues with Brevo services:
- Check the [Brevo Help Center](https://help.brevo.com/)
- Contact Brevo support through your dashboard