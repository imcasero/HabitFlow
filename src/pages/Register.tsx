import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { supabase } from '@/lib/supabase'

export const Register = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError

      if (data.user) {
        setSuccess(true)

        if (!data.session) {
          setNeedsEmailVerification(true)
        } else {
          setTimeout(() => {
            navigate('/dashboard')
          }, 2000)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600" />
          <span className="text-2xl font-bold">HabitFlow</span>
        </div>

        {/* Card */}
        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create your account</h1>
            <p className="text-zinc-400">Start building better habits today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && !needsEmailVerification && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              Account created successfully! Redirecting to dashboard...
            </div>
          )}

          {success && needsEmailVerification && (
            <div className="mb-6 p-6 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <div className="text-3xl">📧</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">
                    Verify your email address
                  </h3>
                  <p className="text-sm text-zinc-300 mb-3">
                    We've sent a confirmation email to{' '}
                    <span className="font-medium text-white">{email}</span>
                  </p>
                  <p className="text-sm text-zinc-400 mb-4">
                    Click the link in the email to verify your account and start using HabitFlow.
                  </p>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-zinc-500 mb-2">📌 Next steps:</p>
                    <ol className="text-xs text-zinc-400 space-y-1 list-decimal list-inside">
                      <li>Check your inbox (and spam folder)</li>
                      <li>Click the verification link in the email</li>
                      <li>Return here and sign in</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-zinc-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={success}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-zinc-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={success}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
              <p className="mt-1.5 text-xs text-zinc-500">Must be at least 6 characters</p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2 text-zinc-300"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                disabled={success}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full px-4 py-3 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : success ? 'Account created!' : 'Create account'}
            </button>
          </form>

          {!needsEmailVerification && (
            <div className="mt-6 text-center">
              <p className="text-sm text-zinc-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}

          {needsEmailVerification && (
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-block px-6 py-3 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all"
              >
                Go to Sign In
              </Link>
              <p className="text-xs text-zinc-500 mt-3">
                After verifying your email, use this to sign in
              </p>
            </div>
          )}
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-zinc-500 hover:text-zinc-400 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
