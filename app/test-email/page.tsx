"use client"

import { useState } from "react"

export default function TestEmailPage() {
	const [to, setTo] = useState("")
	const [subject, setSubject] = useState("Test Email")
	const [html, setHtml] = useState("<h1>Test</h1><p>This is a test email.</p>")
	const [isLoading, setIsLoading] = useState(false)
	const [result, setResult] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setResult(null)
		setError(null)
		try {
			const res = await fetch("/api/send-test-email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ to, subject, html }),
			})
			const data = await res.json()
			if (!res.ok || data.success === false) {
				throw new Error(data.error || "Failed to send email")
			}
			setResult(`Sent! messageId: ${data.messageId ?? "n/a"}`)
		} catch (err: any) {
			setError(err?.message || "Unexpected error")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
			<h1>Send Test Email</h1>
			<p>Use this form to send a test email via Brevo SMTP.</p>
			<form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
				<label style={{ display: "grid", gap: 6 }}>
					<span>To</span>
					<input
						type="email"
						placeholder="recipient@example.com"
						value={to}
						onChange={(e) => setTo(e.target.value)}
						required
						style={{ padding: 8 }}
					/>
				</label>
				<label style={{ display: "grid", gap: 6 }}>
					<span>Subject</span>
					<input
						type="text"
						value={subject}
						onChange={(e) => setSubject(e.target.value)}
						required
						style={{ padding: 8 }}
					/>
				</label>
				<label style={{ display: "grid", gap: 6 }}>
					<span>HTML</span>
					<textarea
						rows={8}
						value={html}
						onChange={(e) => setHtml(e.target.value)}
						required
						style={{ padding: 8, fontFamily: "monospace" }}
					/>
				</label>
				<button type="submit" disabled={isLoading} style={{ padding: "10px 14px" }}>
					{isLoading ? "Sending..." : "Send Email"}
				</button>
			</form>
			{result && (
				<p style={{ color: "green", marginTop: 12 }}>{result}</p>
			)}
			{error && (
				<p style={{ color: "crimson", marginTop: 12 }}>Error: {error}</p>
			)}
		</div>
	)
}


