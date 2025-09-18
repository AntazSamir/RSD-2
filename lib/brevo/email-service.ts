import nodemailer from 'nodemailer'
import { brevoConfig } from './config'

// Create a transporter using Brevo SMTP
const transporter = nodemailer.createTransport({
  host: brevoConfig.smtp.host,
  port: brevoConfig.smtp.port,
  secure: brevoConfig.smtp.secure,
  auth: {
    user: brevoConfig.smtp.auth.user,
    pass: brevoConfig.smtp.auth.pass,
  },
})

// Verify transporter configuration
transporter.verify((error: Error | null) => {
  if (error) {
    console.error('Brevo SMTP configuration error:', error)
  } else {
    console.log('Brevo SMTP server is ready to send emails')
  }
})

// Email templates
export const emailTemplates = {
  reservationConfirmation: (data: { 
    customerName: string, 
    reservationDate: string, 
    reservationTime: string, 
    partySize: number,
    specialRequests?: string
  }) => ({
    subject: 'Reservation Confirmation - Restaurant Dashboard',
    html: `
      <h2>Reservation Confirmation</h2>
      <p>Hello ${data.customerName},</p>
      <p>Your reservation has been confirmed with the following details:</p>
      <ul>
        <li>Date: ${data.reservationDate}</li>
        <li>Time: ${data.reservationTime}</li>
        <li>Party Size: ${data.partySize} people</li>
        ${data.specialRequests ? `<li>Special Requests: ${data.specialRequests}</li>` : ''}
      </ul>
      <p>We look forward to serving you!</p>
      <p>Best regards,<br/>Restaurant Team</p>
    `,
  }),

  orderConfirmation: (data: { 
    customerName: string, 
    orderId: string, 
    orderTotal: number,
    orderItems: Array<{ name: string, quantity: number, price: number }>
  }) => ({
    subject: 'Order Confirmation - Restaurant Dashboard',
    html: `
      <h2>Order Confirmation</h2>
      <p>Hello ${data.customerName},</p>
      <p>Thank you for your order #${data.orderId}. Here are the details:</p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align: left; border-bottom: 1px solid #ddd; padding: 8px;">Item</th>
            <th style="text-align: left; border-bottom: 1px solid #ddd; padding: 8px;">Quantity</th>
            <th style="text-align: left; border-bottom: 1px solid #ddd; padding: 8px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${data.orderItems.map(item => `
            <tr>
              <td style="padding: 8px;">${item.name}</td>
              <td style="padding: 8px;">${item.quantity}</td>
              <td style="padding: 8px;">$${item.price.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p><strong>Total: $${data.orderTotal.toFixed(2)}</strong></p>
      <p>Thank you for choosing our restaurant!</p>
      <p>Best regards,<br/>Restaurant Team</p>
    `,
  }),

  passwordReset: (data: { 
    customerName: string, 
    resetLink: string 
  }) => ({
    subject: 'Password Reset Request - Restaurant Dashboard',
    html: `
      <h2>Password Reset Request</h2>
      <p>Hello ${data.customerName},</p>
      <p>We received a request to reset your password. Click the link below to reset your password:</p>
      <p><a href="${data.resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br/>Restaurant Team</p>
    `,
  }),
}

// Send email function
export async function sendEmail(options: {
  to: string | string[]
  subject: string
  html: string
  text?: string
}) {
  try {
    const mailOptions = {
      from: `"${brevoConfig.sender.name}" <${brevoConfig.sender.email}>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error: any) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

// Predefined email functions
export async function sendReservationConfirmation(
  to: string,
  data: {
    customerName: string
    reservationDate: string
    reservationTime: string
    partySize: number
    specialRequests?: string
  }
) {
  const template = emailTemplates.reservationConfirmation(data)
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}

export async function sendOrderConfirmation(
  to: string,
  data: {
    customerName: string
    orderId: string
    orderTotal: number
    orderItems: Array<{ name: string; quantity: number; price: number }>
  }
) {
  const template = emailTemplates.orderConfirmation(data)
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}

export async function sendPasswordReset(
  to: string,
  data: {
    customerName: string
    resetLink: string
  }
) {
  const template = emailTemplates.passwordReset(data)
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}