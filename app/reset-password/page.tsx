"use client"

import { useState } from "react"
import { useAuth } from "@/lib/supabase/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)
    setError(null)
    
    try {
      const { error } = await resetPassword(email)
      
      if (error) {
        setError(error.message || "Failed to send reset password email")
      } else {
        setMessage("Password reset email sent! Please check your inbox.")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackToSignIn = () => {
    window.location.href = "/sign-in"
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
          <p className="text-muted-foreground mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={handleBackToSignIn}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to Sign In
          </button>
        </div>
        
        {message && (
          <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-2xl text-green-500 text-center">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-500 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}