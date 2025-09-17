'use client'

import { useState } from 'react'

export default function TestEmailPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    to: '',
    subject: 'Test Email from Restaurant Dashboard',
    html: '<h1>Test Email</h1><p>This is a test email sent from the Restaurant Dashboard using Brevo SMTP.</p>',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch('/api/send-test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: data.message })
      } else {
        setError(data.error || 'Failed to send email')
      }
    } catch (err: any) {
      console.error('Error sending email:', err)
      setError(err.message || 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Test Brevo SMTP</h1>
          <p className="text-muted-foreground mt-2">
            Send a test email using your Brevo SMTP configuration
          </p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="to" className="block text-sm font-medium mb-1">
                To Email
              </label>
              <input
                type="email"
                id="to"
                name="to"
                value={formData.to}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="recipient@example.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Email subject"
              />
            </div>

            <div>
              <label htmlFor="html" className="block text-sm font-medium mb-1">
                HTML Content
              </label>
              <textarea
                id="html"
                name="html"
                value={formData.html}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="HTML email content"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-4 w-4 mr-2 border-b-2 border-current rounded-full"></span>
                  Sending Email...
                </span>
              ) : (
                'Send Test Email'
              )}
            </button>
          </form>

          {result && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                result.success
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              <p>{result.message}</p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>
              Add your Brevo SMTP credentials to your{' '}
              <code className="bg-muted px-1 rounded">.env.local</code> file:
              <pre className="bg-muted p-2 rounded mt-2 text-xs overflow-x-auto">
                {`BREVO_SMTP_HOST=smtp-relay.sendinblue.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=your_brevo_login
BREVO_SMTP_PASS=your_brevo_password
BREVO_SENDER_EMAIL=sender@yourdomain.com
BREVO_SENDER_NAME="Restaurant Dashboard"`}
              </pre>
            </li>
            <li>Restart your development server</li>
            <li>Enter a recipient email address above</li>
            <li>Click "Send Test Email"</li>
          </ol>
        </div>

        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}