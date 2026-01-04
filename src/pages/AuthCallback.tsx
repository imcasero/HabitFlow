import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '@/lib/supabase'

export const AuthCallback = () => {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

          if (exchangeError) {
            throw exchangeError
          }

          const {
            data: { session },
          } = await supabase.auth.getSession()

          if (session) {
            navigate('/dashboard', { replace: true })
          } else {
            setError('Failed to create session. Please try signing in again.')
          }
        } else {
          setError('No verification code found. Please check your email link.')
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        setError(err instanceof Error ? err.message : 'An error occurred during verification')
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600" />
          <span className="text-2xl font-bold">HabitFlow</span>
        </div>

        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
          {error ? (
            <>
              <div className="text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-bold mb-4 text-red-400">Verification Failed</h1>
              <p className="text-zinc-400 mb-6">{error}</p>
              <a
                href="/login"
                className="inline-block px-6 py-3 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all"
              >
                Go to Sign In
              </a>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">⏳</div>
              <h1 className="text-2xl font-bold mb-4">Verifying your email...</h1>
              <p className="text-zinc-400">Please wait while we confirm your account.</p>
              <div className="mt-6">
                <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
