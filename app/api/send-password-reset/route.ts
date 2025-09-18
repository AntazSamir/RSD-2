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
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
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