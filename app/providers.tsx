'use client'

import { Suspense } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/supabase/auth-context'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <Suspense fallback={null}>{children}</Suspense>
      </ThemeProvider>
    </AuthProvider>
  )
}
