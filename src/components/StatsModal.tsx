import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface HabitStats {
  current_streak: number
  longest_streak: number
  total_completions: number
  days_failed: number
  success_rate: number
  days_since_creation: number
}

interface StatsModalProps {
  habitId: string
  habitName: string
  onClose: () => void
}

export const StatsModal = ({ habitId, habitName, onClose }: StatsModalProps) => {
  const [stats, setStats] = useState<HabitStats | null>(null)
  const [completionDates, setCompletionDates] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    const { data, error } = await supabase.rpc('get_habit_stats', {
      p_habit_id: habitId,
    })

    if (error) {
      console.error('Error fetching stats:', error)
    } else {
      setStats(data)
    }
    setLoading(false)
  }

  const fetchCompletions = async () => {
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    const { data, error } = await supabase
      .from('habit_completions')
      .select('date')
      .eq('habit_id', habitId)
      .gte('date', ninetyDaysAgo.toISOString().split('T')[0])
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching completions:', error)
    } else {
      setCompletionDates(data?.map(c => c.date) || [])
    }
  }

  useEffect(() => {
    fetchStats()
    fetchCompletions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitId])

  const renderCalendar = () => {
    const days = []
    const today = new Date()
    const startDate = new Date()
    startDate.setDate(today.getDate() - 89)

    for (let i = 0; i < 90; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      const dateString = currentDate.toISOString().split('T')[0]
      const isCompleted = completionDates.includes(dateString)
      const isToday = dateString === today.toISOString().split('T')[0]

      days.push(
        <div
          key={dateString}
          className={`w-3 h-3 rounded-sm ${
            isCompleted ? 'bg-green-500' : 'bg-zinc-800'
          } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
          title={dateString}
        />
      )
    }

    return days
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl bg-zinc-900 border border-white/10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold">{habitName}</h3>
            <p className="text-sm text-zinc-400">Statistics & Progress</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-zinc-500">Loading statistics...</div>
        ) : stats ? (
          <div className="space-y-6">
            {/* Main Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <p className="text-sm text-zinc-400 mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-orange-400">🔥 {stats.current_streak}</p>
                <p className="text-xs text-zinc-500 mt-1">days</p>
              </div>

              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-sm text-zinc-400 mb-1">Longest Streak</p>
                <p className="text-3xl font-bold text-purple-400">{stats.longest_streak}</p>
                <p className="text-xs text-zinc-500 mt-1">days</p>
              </div>

              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-zinc-400 mb-1">Total Completions</p>
                <p className="text-3xl font-bold text-green-400">{stats.total_completions}</p>
                <p className="text-xs text-zinc-500 mt-1">days</p>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-zinc-400 mb-1">Success Rate</p>
                <p className="text-3xl font-bold text-blue-400">{stats.success_rate.toFixed(1)}%</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {stats.total_completions}/{stats.days_since_creation} days
                </p>
              </div>

              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-zinc-400 mb-1">Days Failed</p>
                <p className="text-3xl font-bold text-red-400">{stats.days_failed}</p>
                <p className="text-xs text-zinc-500 mt-1">missed</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-500/10 border border-zinc-500/20">
                <p className="text-sm text-zinc-400 mb-1">Days Active</p>
                <p className="text-3xl font-bold text-zinc-400">{stats.days_since_creation}</p>
                <p className="text-xs text-zinc-500 mt-1">total days</p>
              </div>
            </div>

            {/* Calendar Heatmap */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Last 90 Days</h4>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="grid grid-cols-15 gap-1">{renderCalendar()}</div>
                <div className="flex items-center gap-4 mt-4 text-xs text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-zinc-800" />
                    <span>Not completed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-green-500" />
                    <span>Completed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-zinc-800 ring-2 ring-blue-500" />
                    <span>Today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-red-400">Failed to load statistics</div>
        )}
      </div>
    </div>
  )
}
