'use client'

import { useAuth } from '@/lib/supabase/auth-context'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to sign-in page if not authenticated
      router.push('/sign-in')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Render children if user is authenticated
  if (user) {
    return <>{children}</>
  }

  // Return null while redirecting
  return null
}