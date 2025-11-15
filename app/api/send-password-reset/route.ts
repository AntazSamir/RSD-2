import { sendPasswordReset } from '@/lib/brevo/email-service'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, customerName, resetLink } = await request.json()
    
    // Validate input
    if (!email || !resetLink) {
      return NextResponse.json(
        { error: 'Email and reset link are required' },
        { status: 400 }
      )
    }
    
    // Send password reset email
    const result = await sendPasswordReset(email, {
      customerName: customerName || email.split('@')[0],
      resetLink
    })
    
    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      // Return a more helpful error message
      const errorMessage = result.error?.message || 'Unknown error'
      if (errorMessage.includes('Missing SMTP credentials') || errorMessage.includes('SMTP')) {
        return NextResponse.json(
          { 
            error: 'Email service not configured', 
            details: 'Brevo SMTP credentials are missing. Please configure BREVO_SMTP_USER and BREVO_SMTP_PASS in .env.local. Note: Supabase will still send the password reset email.',
            requiresConfig: true
          },
          { status: 503 } // Service Unavailable
        )
      }
      return NextResponse.json(
        { error: 'Failed to send email', details: errorMessage },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}