import { Link } from 'react-router-dom'
import { CheckCircle, Users, Zap, ArrowRight, LayoutDashboard, Sparkles } from 'lucide-react'

function Landing() {
  return (
    <div className="min-h-screen bg-light dark:bg-mesh relative overflow-hidden">
      {/* Decorative Floating Blobs */}
      <div className="absolute top-20 -left-32 w-96 h-96 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-40 -right-32 w-96 h-96 bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-rose-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '4s' }}></div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-nav transition-all duration-300">
        <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Taskify Logo" className="w-10 h-10 rounded-xl shadow-lg shadow-indigo-500/20 object-cover" />
            <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Taskify</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-cyan-400 font-medium transition-colors">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Sign Up <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-6 pt-40 pb-20 text-center z-10 animate-fade-in">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
          Supercharge Your <br />
          <span className="text-gradient">Team Productivity</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
          The ultimate platform to collaborate seamlessly, track progress in real-time, and deliver projects faster than ever before.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/signup" className="btn btn-primary px-8 py-4 text-lg w-full sm:w-auto shadow-[0_0_40px_rgba(99,102,241,0.4)]">
            Get Started Free
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 text-left animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="glass-card group relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all duration-500"></div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-white">Easy Management</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Create, assign, and track tasks with an intuitive interface designed for speed.</p>
          </div>

          <div className="glass-card group relative overflow-hidden animate-float">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500"></div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-white">Team Collaboration</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Work together in real-time. Share updates, files, and feedback instantly.</p>
          </div>

          <div className="glass-card group relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-500"></div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-white">Real-time Analytics</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Track progress and metrics instantly. Make data-driven decisions for your team.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing