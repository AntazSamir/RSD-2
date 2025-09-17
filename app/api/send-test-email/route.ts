import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/brevo/email-service'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, subject, html } = body

    // Validate required fields
    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      )
    }

    // Send test email
    const result = await sendEmail({
      to,
      subject,
      html,
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId,
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error instanceof Error ? result.error.message : 'Failed to send email' 
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error sending test email:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}