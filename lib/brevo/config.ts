// Brevo (Sendinblue) SMTP Configuration
// 
// To configure Brevo SMTP, you need to:
// 1. Create a Brevo account at https://www.brevo.com/
// 2. Navigate to SMTP & API > SMTP
// 3. Copy your SMTP credentials
// 4. Add them to your .env.local file:
//
// BREVO_SMTP_HOST=smtp-relay.sendinblue.com
// BREVO_SMTP_PORT=587
// BREVO_SMTP_USER=your_brevo_login_email
// BREVO_SMTP_PASS=your_brevo_smtp_key
// BREVO_SENDER_EMAIL=sender@yourdomain.com
// BREVO_SENDER_NAME="Restaurant Dashboard"
//
// For more information, see: https://help.brevo.com/hc/en-us/articles/209499125-What-is-SMTP-

export const brevoConfig = {
  smtp: {
    host: process.env.BREVO_SMTP_HOST || 'smtp-relay.sendinblue.com',
    port: parseInt(process.env.BREVO_SMTP_PORT || '587'),
    secure: process.env.BREVO_SMTP_SECURE === 'true' || false,
    auth: {
      user: process.env.BREVO_SMTP_USER || '',
      pass: process.env.BREVO_SMTP_PASS || '',
    },
  },
  apiKey: process.env.BREVO_API_KEY || '',
  sender: {
    email: process.env.BREVO_SENDER_EMAIL || '',
    name: process.env.BREVO_SENDER_NAME || 'Restaurant Dashboard',
  },
}