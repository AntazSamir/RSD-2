import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server-admin'
import { sendEmail } from '@/lib/brevo/email-service'

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 })
    }
    const { email, redirectTo, customerName } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }
    const safeRedirect = redirectTo || `${process.env.NEXT_PUBLIC_SITE_URL || ''}` || undefined

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      options: { redirectTo: safeRedirect },
    })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const actionLink: string | undefined = data?.properties?.action_link
    if (!actionLink) {
      return NextResponse.json({ error: 'Failed to generate signup link' }, { status: 500 })
    }

    const name = customerName || (email.split('@')[0])
    const html = `
      <h2>Confirm your account</h2>
      <p>Hello ${name},</p>
      <p>Click the button below to confirm your email and finish creating your account:</p>
      <p><a href="${actionLink}" style="background:#0ea5e9;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Confirm Email</a></p>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p><a href="${actionLink}">${actionLink}</a></p>
    `

    const result = await sendEmail({ to: email, subject: 'Confirm your account', html })
    if (!result.success) {
      return NextResponse.json({ error: result.error?.message || 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}


