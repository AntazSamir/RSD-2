'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function TestSupabasePage() {
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testSupabaseConnection = async () => {
      try {
        setStatus('Testing Supabase connection...')
        
        // Test the Supabase client
        const { data, error } = await supabase.from('users').select('count')
        
        if (error) {
          throw error
        }
        
        setStatus('Supabase connection successful!')
      } catch (err: any) {
        console.error('Supabase connection error:', err)
        setError(err.message || 'Unknown error occurred')
        setStatus('Supabase connection failed')
      }
    }

    testSupabaseConnection()
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-center">Supabase Connection Test</h1>
        
        <div className="p-4 rounded-lg border">
          <p className="text-center">
            Status: <span className={status === 'Supabase connection successful!' ? 'text-green-500' : 'text-yellow-500'}>
              {status}
            </span>
          </p>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}
        </div>
        
        <div className="pt-4">
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