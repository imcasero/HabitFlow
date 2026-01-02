import { Link } from 'react-router'

export const Home = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
            <span className="text-lg font-semibold">HabitFlow</span>
          </div>
          <Link to="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-24 text-center">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-zinc-400">Free forever. No credit card required.</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8">
            Start small.
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Build big.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            The hardest part of any habit is starting. Make it ridiculously small, make it
            impossible to skip.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="group relative px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-all"
            >
              Get started for free
              <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">
                →
              </span>
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white/5 text-white rounded-lg font-semibold hover:bg-white/10 transition-all border border-white/10"
            >
              Sign in
            </Link>
          </div>

          <p className="text-sm text-zinc-600 mt-6">
            Join thousands building better habits, one tiny step at a time
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                Philosophy
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">The Minimal Habit Standard</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mb-8" />
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-lg text-zinc-300 leading-relaxed">
                  Forget ambitious goals. Start with habits so ridiculously small that doing them
                  takes less effort than not doing them.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-lg text-zinc-300 leading-relaxed">
                  Once you start, momentum builds naturally. But the key is removing every barrier
                  to that first step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-32 bg-gradient-to-b from-transparent to-zinc-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Minimal Habit Examples</h2>
            <p className="text-xl text-zinc-400">So small, you can't say no</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center text-3xl mb-6">
                💪
              </div>
              <h3 className="text-2xl font-bold mb-3">5 Push-ups</h3>
              <p className="text-zinc-400 leading-relaxed">
                Not 50. Not even 10. Just 5. So easy you'll actually do it every day.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center text-3xl mb-6">
                📖
              </div>
              <h3 className="text-2xl font-bold mb-3">Read 5 Lines</h3>
              <p className="text-zinc-400 leading-relaxed">
                One paragraph. That's it. Build the habit first, expand it later.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/20 flex items-center justify-center text-3xl mb-6">
                💻
              </div>
              <h3 className="text-2xl font-bold mb-3">Code 10 Lines</h3>
              <p className="text-zinc-400 leading-relaxed">
                Ten lines of code. No pressure to build something amazing. Just show up.
              </p>
            </div>
          </div>

          <p className="text-center text-zinc-600 mt-12 text-sm">
            These are just examples. Your minimal habits are personal to you.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need.
              <br />
              <span className="text-zinc-500">Nothing you don't.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center text-2xl mb-6">
                📊
              </div>
              <h3 className="text-2xl font-bold mb-3">Track your progress</h3>
              <p className="text-zinc-400 leading-relaxed">
                See your yearly statistics and celebrate your consistency with beautiful
                visualizations.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center text-2xl mb-6">
                🔄
              </div>
              <h3 className="text-2xl font-bold mb-3">Flexible frequency</h3>
              <p className="text-zinc-400 leading-relaxed">
                Daily, weekly, or monthly habits. You decide what works for you.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center text-2xl mb-6">
                🆓
              </div>
              <h3 className="text-2xl font-bold mb-3">100% Free</h3>
              <p className="text-zinc-400 leading-relaxed">
                No premium tiers. No paywalls. Just a simple tool to build better habits.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-pink-600/20 flex items-center justify-center text-2xl mb-6">
                ✨
              </div>
              <h3 className="text-2xl font-bold mb-3">Simple & minimal</h3>
              <p className="text-zinc-400 leading-relaxed">
                No clutter. No complexity. Just you and your tiny habits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/10 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Ready to start small?</h2>
          <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
            Join HabitFlow and build lasting habits, one tiny step at a time.
          </p>
          <Link
            to="/register"
            className="inline-block px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold hover:opacity-90 transition-all text-lg"
          >
            Get started for free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-600" />
              <span className="font-semibold">HabitFlow</span>
            </div>
            <p className="text-sm text-zinc-600">&copy; 2026 HabitFlow. Start small. Build big.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
