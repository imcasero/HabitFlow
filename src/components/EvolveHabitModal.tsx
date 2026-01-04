import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Habit {
  id: string
  name: string
  description: string | null
}

interface EvolveHabitModalProps {
  habit: Habit
  onClose: () => void
  onSuccess: () => void
}

const SUGGESTIONS = [
  { from: '5 lines', to: '1 page' },
  { from: '1 push-up', to: '5 push-ups' },
  { from: '1 minute', to: '5 minutes' },
  { from: '10 lines of code', to: '1 function' },
  { from: '50 words', to: '200 words' },
]

export const EvolveHabitModal = ({ habit, onClose, onSuccess }: EvolveHabitModalProps) => {
  const [newDescription, setNewDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEvolve = async () => {
    if (!newDescription.trim()) {
      setError('Please enter a new description')
      return
    }

    if (newDescription === habit.description) {
      setError('New description must be different from current')
      return
    }

    setLoading(true)
    setError('')

    const { error: evolveError } = await supabase.rpc('evolve_habit', {
      p_habit_id: habit.id,
      p_new_description: newDescription,
    })

    if (evolveError) {
      console.error('Error evolving habit:', evolveError)
      setError('Failed to evolve habit. Please try again.')
    } else {
      onSuccess()
      onClose()
    }

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <div className="w-full max-w-lg p-6 rounded-2xl bg-zinc-900 border border-white/10">
        <h3 className="text-2xl font-bold mb-2">Evolve Your Habit</h3>
        <p className="text-sm text-zinc-400 mb-6">
          Increase your minimum to keep growing. Your streak stays intact!
        </p>

        <div className="space-y-4">
          {/* Current Description */}
          <div>
            <p className="block text-sm font-medium mb-2 text-zinc-300">Current Minimum</p>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-zinc-400">
              {habit.description || 'No description'}
            </div>
          </div>

          {/* New Description */}
          <div>
            <label
              htmlFor="new-description"
              className="block text-sm font-medium mb-2 text-zinc-300"
            >
              New Minimum
            </label>
            <textarea
              id="new-description"
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              placeholder="e.g., Read 1 page"
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            />
          </div>

          {/* Suggestions */}
          <div>
            <p className="text-xs text-zinc-500 mb-2">Evolution examples:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map(suggestion => (
                <button
                  key={`${suggestion.from}-${suggestion.to}`}
                  type="button"
                  onClick={() => setNewDescription(suggestion.to)}
                  className="px-3 py-1.5 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                >
                  {suggestion.from} → {suggestion.to}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleEvolve}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Evolving...' : 'Evolve Habit'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-lg bg-white/5 text-white font-semibold hover:bg-white/10 transition-all border border-white/10 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
