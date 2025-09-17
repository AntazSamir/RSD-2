# Brevo Email Integration

This document explains how to set up and use Brevo (formerly Sendinblue) SMTP for email notifications in the restaurant dashboard.

## Overview

The Brevo integration provides email notification capabilities for the restaurant dashboard, including:
- Reservation confirmations
- Order confirmations
- Password reset emails
- Custom email sending

## Setup Instructions

### 1. Create a Brevo Account

1. Go to [https://www.brevo.com/](https://www.brevo.com/)
2. Sign up for an account or log in if you already have one
3. Navigate to the SMTP settings in your Brevo dashboard

### 2. Get SMTP Credentials

In your Brevo dashboard:
1. Go to "SMTP & API" section
2. Note down the following information:
   - SMTP Server: smtp-relay.sendinblue.com
   - Port: 587 (or 465 for SSL)
   - SMTP Username: Your Brevo login email
   - SMTP Password: Your SMTP key (not your account password)

### 3. Configure Environment Variables

Add the following to your `.env.local` file:

```
BREVO_SMTP_HOST=smtp-relay.sendinblue.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=your_brevo_login_email
BREVO_SMTP_PASS=your_brevo_smtp_key
BREVO_SENDER_EMAIL=sender@yourdomain.com
BREVO_SENDER_NAME="Restaurant Dashboard"
```

### 4. Restart Development Server

After adding the environment variables, restart your development server:

```bash
npm run dev
```

## File Structure

The Brevo integration consists of the following files:

```
lib/brevo/
├── config.ts          # Configuration settings
├── email-service.ts   # Email sending functions
└── templates/         # Email templates (optional)
```

## Usage

### Sending Custom Emails

```typescript
import { sendEmail } from '@/lib/brevo/email-service'

// Send a simple email
const result = await sendEmail({
  to: 'recipient@example.com',
  subject: 'Hello from Restaurant Dashboard',
  html: '<h1>Hello!</h1><p>This is a test email.</p>',
})
```

### Using Predefined Templates

```typescript
import { sendReservationConfirmation, sendOrderConfirmation, sendPasswordReset } from '@/lib/brevo/email-service'

// Send reservation confirmation
await sendReservationConfirmation('customer@example.com', {
  customerName: 'John Doe',
  reservationDate: '2025-09-20',
  reservationTime: '19:00',
  partySize: 4,
  specialRequests: 'Window seat preferred'
})

// Send order confirmation
await sendOrderConfirmation('customer@example.com', {
  customerName: 'John Doe',
  orderId: '12345',
  orderTotal: 25.99,
  orderItems: [
    { name: 'Margherita Pizza', quantity: 1, price: 12.99 },
    { name: 'Caesar Salad', quantity: 1, price: 8.99 },
    { name: 'Mineral Water', quantity: 2, price: 4.01 }
  ]
})

// Send password reset
await sendPasswordReset('customer@example.com', {
  customerName: 'John Doe',
  resetLink: 'https://yourapp.com/reset-password?token=abc123'
})
```

## API Routes

### Test Email Endpoint

- **URL**: `/api/send-test-email`
- **Method**: POST
- **Body**:
  ```json
  {
    "to": "recipient@example.com",
    "subject": "Test Email",
    "html": "<h1>Test</h1><p>This is a test email.</p>"
  }
  ```

## Testing

### Web Interface

Visit [http://localhost:3000/test-email](http://localhost:3000/test-email) to test the email functionality through a web interface.

### Programmatic Testing

You can test the email functionality programmatically by calling the API endpoint:

```bash
curl -X POST http://localhost:3000/api/send-test-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Test Email",
    "html": "<h1>Test</h1><p>This is a test email.</p>"
  }'
```

## Error Handling

The email service includes comprehensive error handling:

```typescript
try {
  const result = await sendEmail({
    to: 'recipient@example.com',
    subject: 'Test',
    html: '<p>Test</p>'
  })
  
  if (result.success) {
    console.log('Email sent successfully:', result.messageId)
  } else {
    console.error('Failed to send email:', result.error)
  }
} catch (error) {
  console.error('Unexpected error:', error)
}
```

## Security Considerations

1. **Environment Variables**: Never commit SMTP credentials to version control
2. **Rate Limiting**: Be aware of Brevo's sending limits
3. **Input Validation**: Always validate email addresses before sending
4. **Error Logging**: Avoid logging sensitive information in error messages

## Troubleshooting

### "Connection Refused" Errors

- Check that your SMTP credentials are correct
- Verify that your firewall isn't blocking outbound connections
- Ensure you're using the correct port (587 for TLS, 465 for SSL)

### "Authentication Failed" Errors

- Double-check your SMTP username and password
- Make sure you're using your SMTP key, not your account password
- Verify that your Brevo account is active

### "Email Not Received"

- Check your spam/junk folder
- Verify the recipient email address is correct
- Check Brevo's delivery logs in the dashboard

## Customization

### Adding New Email Templates

Add new templates to the `emailTemplates` object in `lib/brevo/email-service.ts`:

```typescript
const emailTemplates = {
  // ... existing templates
  
  customTemplate: (data: { name: string, message: string }) => ({
    subject: `Custom Email for ${data.name}`,
    html: `<h1>Hello ${data.name}!</h1><p>${data.message}</p>`,
  })
}
```

### Creating New Email Functions

Create new functions for specific email types:

```typescript
export async function sendCustomEmail(
  to: string,
  data: { name: string, message: string }
) {
  const template = emailTemplates.customTemplate(data)
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}
```

## Brevo Features

### Transactional vs Marketing Emails

Brevo differentiates between:
- **Transactional emails**: Order confirmations, password resets (high priority)
- **Marketing emails**: Newsletters, promotions (lower priority)

This integration is designed for transactional emails.

### Analytics

Brevo provides detailed analytics on:
- Delivery rates
- Open rates
- Click rates
- Bounce rates

You can view these metrics in your Brevo dashboard.

### Webhooks

Brevo supports webhooks for real-time delivery status updates. To implement:
1. Set up a webhook endpoint in your application
2. Configure the webhook in your Brevo dashboard
3. Process incoming webhook events

## Limitations

1. **Rate Limits**: Be aware of Brevo's sending limits
2. **Attachments**: The current implementation doesn't support file attachments
3. **Bulk Sending**: For sending to many recipients, consider using Brevo's API directly