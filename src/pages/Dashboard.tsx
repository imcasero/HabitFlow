import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { EvolveHabitModal } from '@/components/EvolveHabitModal'
import { StatsModal } from '@/components/StatsModal'
import { supabase } from '@/lib/supabase'

interface Habit {
  id: string
  name: string
  description: string | null
  frequency_type: string
  tags: string[] | null
  is_archived: boolean
  created_at: string
}

interface HabitWithStreak extends Habit {
  currentStreak: number
}

const HABIT_SUGGESTIONS = [
  {
    name: 'Read 5 Lines',
    description: 'Just 5 lines from any book',
    tags: ['reading', 'learning'],
  },
  { name: 'Do 10 Squats', description: 'Quick energy boost', tags: ['fitness', 'health'] },
  {
    name: 'Code 10 Lines',
    description: 'Keep the coding habit alive',
    tags: ['coding', 'learning'],
  },
  { name: 'Meditate 1 Minute', description: 'One mindful minute', tags: ['mindfulness', 'health'] },
  {
    name: 'Write 50 Words',
    description: 'Daily writing practice',
    tags: ['writing', 'creativity'],
  },
]

export const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [habits, setHabits] = useState<HabitWithStreak[]>([])
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [showAddHabit, setShowAddHabit] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [showEvolveModal, setShowEvolveModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)
  const [newHabit, setNewHabit] = useState({ name: '', description: '', tags: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

  const checkUser = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      navigate('/login')
      return
    }
    setUser({ email: user.email || '' })
  }, [navigate])

  const fetchHabits = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('is_archived', showArchived)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching habits:', error)
      setHabits([])
    } else {
      // Fetch streaks for each habit
      const habitsWithStreaks = await Promise.all(
        (data || []).map(async habit => {
          const { data: streakData } = await supabase.rpc('get_current_streak', {
            p_habit_id: habit.id,
          })
          return { ...habit, currentStreak: streakData || 0 }
        })
      )
      setHabits(habitsWithStreaks)
    }
    setLoading(false)
  }, [showArchived])

  const fetchTodayCompletions = useCallback(async () => {
    const { data, error } = await supabase
      .from('habit_completions')
      .select('habit_id')
      .eq('date', today)

    if (error) {
      console.error('Error fetching completions:', error)
    } else {
      setCompletedToday(new Set(data?.map(c => c.habit_id) || []))
    }
  }, [today])

  useEffect(() => {
    checkUser()
    fetchHabits()
    fetchTodayCompletions()

    const handleClickOutside = () => setOpenMenuId(null)
    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [checkUser, fetchHabits, fetchTodayCompletions])

  const parseTags = useCallback((tagsString: string) => {
    const tags = tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
    return tags.length > 0 ? tags : null
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const handleAddHabit = async () => {
    if (!newHabit.name.trim()) return

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('habits').insert([
      {
        user_id: user.id,
        name: newHabit.name,
        description: newHabit.description || null,
        frequency_type: 'daily',
        tags: parseTags(newHabit.tags),
        is_archived: false,
      },
    ])

    if (error) {
      console.error('Error adding habit:', error)
    } else {
      setNewHabit({ name: '', description: '', tags: '' })
      setShowAddHabit(false)
      fetchHabits()
    }
  }

  const handleCompleteHabit = async (habitId: string) => {
    const { error } = await supabase.rpc('complete_habit', {
      p_habit_id: habitId,
    })

    if (error) {
      console.error('Error completing habit:', error)
    } else {
      setCompletedToday(prev => new Set([...prev, habitId]))
      fetchHabits() // Refresh to update streak
    }
  }

  const handleUncompleteHabit = async (habitId: string) => {
    const { error } = await supabase
      .from('habit_completions')
      .delete()
      .eq('habit_id', habitId)
      .eq('date', today)

    if (error) {
      console.error('Error uncompleting habit:', error)
    } else {
      setCompletedToday(prev => {
        const newSet = new Set(prev)
        newSet.delete(habitId)
        return newSet
      })
      fetchHabits() // Refresh to update streak
    }
  }

  const handleArchiveHabit = async (habitId: string) => {
    const { error } = await supabase
      .from('habits')
      .update({
        is_archived: true,
        archived_at: new Date().toISOString(),
      })
      .eq('id', habitId)

    if (error) {
      console.error('Error archiving habit:', error)
    } else {
      setOpenMenuId(null)
      fetchHabits()
    }
  }

  const handleUnarchiveHabit = async (habitId: string) => {
    const { error } = await supabase
      .from('habits')
      .update({
        is_archived: false,
        archived_at: null,
      })
      .eq('id', habitId)

    if (error) {
      console.error('Error unarchiving habit:', error)
    } else {
      setOpenMenuId(null)
      fetchHabits()
    }
  }

  const handleDeleteHabit = async () => {
    if (!selectedHabit) return

    const { error } = await supabase.from('habits').delete().eq('id', selectedHabit.id)

    if (error) {
      console.error('Error deleting habit:', error)
    } else {
      setShowDeleteConfirm(false)
      setSelectedHabit(null)
      fetchHabits()
    }
  }

  const handleUseSuggestion = (suggestion: (typeof HABIT_SUGGESTIONS)[0]) => {
    setNewHabit({
      name: suggestion.name,
      description: suggestion.description,
      tags: suggestion.tags.join(', '),
    })
  }

  // Get all unique tags from habits
  const allTags = Array.from(
    new Set(habits.flatMap(h => h.tags || []).filter(tag => tag.length > 0))
  ).sort()

  // Filter habits by search and tag
  const filteredHabits = habits.filter(habit => {
    const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !selectedTag || habit.tags?.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const completedTodayCount = filteredHabits.filter(h => completedToday.has(h.id)).length
  const totalHabits = filteredHabits.length

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600" />
              <div>
                <h1 className="text-xl font-bold">HabitFlow</h1>
                <p className="text-xs text-zinc-500">{user?.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-linear-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400 mb-1">
                  {showArchived ? 'Archived' : 'Active'} Habits
                </p>
                <p className="text-3xl font-bold">{totalHabits}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">
                📊
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-linear-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Completed Today</p>
                <p className="text-3xl font-bold">{completedTodayCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl">
                ✅
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-linear-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Completion Rate</p>
                <p className="text-3xl font-bold">
                  {totalHabits > 0 ? Math.round((completedTodayCount / totalHabits) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl">
                🎯
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Your Habits</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowArchived(!showArchived)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all border ${
                  showArchived
                    ? 'bg-zinc-700 border-zinc-600 text-white'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                }`}
              >
                {showArchived ? 'Show Active' : 'Show Archived'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddHabit(true)}
                className="px-4 py-2 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all flex items-center gap-2"
              >
                <span className="text-xl">+</span> New Habit
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search habits..."
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            {allTags.length > 0 && (
              <select
                value={selectedTag || ''}
                onChange={e => setSelectedTag(e.target.value || null)}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Add Habit Modal */}
        {showAddHabit && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
            <div className="w-full max-w-2xl p-6 rounded-2xl bg-zinc-900 border border-white/10 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Create New Habit</h3>

              {/* Suggestions */}
              <div className="mb-6">
                <p className="text-sm text-zinc-400 mb-3">Quick suggestions (click to use):</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {HABIT_SUGGESTIONS.map(suggestion => (
                    <button
                      key={suggestion.name}
                      type="button"
                      onClick={() => handleUseSuggestion(suggestion)}
                      className="p-3 text-left rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all"
                    >
                      <p className="font-medium text-sm">{suggestion.name}</p>
                      <p className="text-xs text-zinc-500">{suggestion.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="habit-name"
                    className="block text-sm font-medium mb-2 text-zinc-300"
                  >
                    Habit Name
                  </label>
                  <input
                    id="habit-name"
                    type="text"
                    value={newHabit.name}
                    onChange={e => setNewHabit({ ...newHabit, name: e.target.value })}
                    placeholder="e.g., Read 5 Lines"
                    maxLength={255}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="habit-description"
                    className="block text-sm font-medium mb-2 text-zinc-300"
                  >
                    Ridiculous Minimum
                  </label>
                  <textarea
                    id="habit-description"
                    value={newHabit.description}
                    onChange={e => setNewHabit({ ...newHabit, description: e.target.value })}
                    placeholder="Make it so small you can't say no. e.g., 'Just 5 lines from any book'"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  />
                  <p className="mt-1.5 text-xs text-zinc-500">
                    The key is making it ridiculously easy to start
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="habit-tags"
                    className="block text-sm font-medium mb-2 text-zinc-300"
                  >
                    Tags (optional)
                  </label>
                  <input
                    id="habit-tags"
                    type="text"
                    value={newHabit.tags}
                    onChange={e => setNewHabit({ ...newHabit, tags: e.target.value })}
                    placeholder="health, morning, fitness"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <p className="mt-1.5 text-xs text-zinc-500">Separate tags with commas</p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAddHabit}
                    className="flex-1 px-4 py-3 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all"
                  >
                    Create Habit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddHabit(false)}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/5 text-white font-semibold hover:bg-white/10 transition-all border border-white/10"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Modal */}
        {showStatsModal && selectedHabit && (
          <StatsModal
            habitId={selectedHabit.id}
            habitName={selectedHabit.name}
            onClose={() => {
              setShowStatsModal(false)
              setSelectedHabit(null)
            }}
          />
        )}

        {/* Evolve Modal */}
        {showEvolveModal && selectedHabit && (
          <EvolveHabitModal
            habit={selectedHabit}
            onClose={() => {
              setShowEvolveModal(false)
              setSelectedHabit(null)
            }}
            onSuccess={() => fetchHabits()}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && selectedHabit && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6">
            <div className="w-full max-w-md p-6 rounded-2xl bg-zinc-900 border border-red-500/20">
              <h3 className="text-xl font-bold mb-2 text-red-400">Delete Habit Permanently</h3>
              <p className="text-zinc-400 mb-6">
                Are you sure you want to delete "
                <span className="text-white font-semibold">{selectedHabit.name}</span>"? This will
                permanently delete all history, completions, and evolution records. This action
                cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleDeleteHabit}
                  className="flex-1 px-4 py-3 rounded-lg bg-red-500/20 text-red-400 font-semibold hover:bg-red-500/30 transition-all border border-red-500/30"
                >
                  Delete Permanently
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setSelectedHabit(null)
                  }}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/5 text-white font-semibold hover:bg-white/10 transition-all border border-white/10"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Habits List */}
        {loading ? (
          <div className="text-center py-12 text-zinc-500">Loading habits...</div>
        ) : filteredHabits.length === 0 ? (
          <div className="text-center py-12 p-8 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery || selectedTag ? 'No matching habits' : 'No habits yet'}
            </h3>
            <p className="text-zinc-400 mb-6">
              {searchQuery || selectedTag
                ? 'Try adjusting your filters'
                : 'Start small. Create your first minimal habit.'}
            </p>
            {!searchQuery && !selectedTag && (
              <button
                type="button"
                onClick={() => setShowAddHabit(true)}
                className="px-6 py-3 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all"
              >
                Create Your First Habit
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHabits.map(habit => {
              const isCompleted = completedToday.has(habit.id)
              return (
                <div
                  key={habit.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    isCompleted
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{habit.name}</h3>
                      {habit.description && (
                        <p className="text-sm text-zinc-400 mb-2">{habit.description}</p>
                      )}
                      {habit.tags && habit.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {habit.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {/* Streak */}
                      {habit.currentStreak > 0 && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="text-lg">🔥</span>
                          <span className="text-sm font-semibold text-orange-400">
                            {habit.currentStreak} day{habit.currentStreak !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation()
                          setOpenMenuId(openMenuId === habit.id ? null : habit.id)
                        }}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        aria-label="More options"
                      >
                        <svg
                          className="w-5 h-5 text-zinc-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      {openMenuId === habit.id && (
                        <div className="absolute right-0 mt-2 w-44 rounded-lg bg-zinc-800 border border-white/10 shadow-xl z-10">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedHabit(habit)
                              setShowStatsModal(true)
                              setOpenMenuId(null)
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                          >
                            📊 View Stats
                          </button>
                          {!showArchived && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedHabit(habit)
                                setShowEvolveModal(true)
                                setOpenMenuId(null)
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                            >
                              ⬆️ Evolve
                            </button>
                          )}
                          {!showArchived ? (
                            <button
                              type="button"
                              onClick={() => handleArchiveHabit(habit.id)}
                              className="w-full px-4 py-2 text-left text-sm text-yellow-400 hover:bg-yellow-500/10 transition-colors flex items-center gap-2"
                            >
                              📦 Archive
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUnarchiveHabit(habit.id)}
                              className="w-full px-4 py-2 text-left text-sm text-green-400 hover:bg-green-500/10 transition-colors flex items-center gap-2"
                            >
                              📤 Unarchive
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedHabit(habit)
                              setShowDeleteConfirm(true)
                              setOpenMenuId(null)
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors rounded-b-lg flex items-center gap-2"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Complete Button */}
                  {!showArchived && (
                    <button
                      type="button"
                      onClick={() =>
                        isCompleted
                          ? handleUncompleteHabit(habit.id)
                          : handleCompleteHabit(habit.id)
                      }
                      className={`w-full py-3 rounded-lg font-semibold transition-all ${
                        isCompleted
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {isCompleted ? '✓ Completed Today' : 'Complete Today'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
