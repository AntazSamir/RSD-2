'use client'

import { useAuth } from '@/lib/supabase/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function LogoutButton() {
  const { signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const { error } = await signOut()
      if (error) throw error
      // Redirect to sign-in page after logout
      router.push('/sign-in')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  )
}