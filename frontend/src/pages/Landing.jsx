import { Link } from 'react-router-dom'
import { ArrowRight, Search, Bell, Settings, Globe, Waves, Shield } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg-dark">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-border">
        <h1 className="text-lg font-bold text-text-primary">PlantVision AI</h1>
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="text-primary text-sm font-medium">Dashboard</Link>
          <Link to="/detection" className="text-text-secondary text-sm hover:text-text-primary">Detection</Link>
          <Link to="/compare" className="text-text-secondary text-sm hover:text-text-primary">Compare Models</Link>
          <Link to="/history" className="text-text-secondary text-sm hover:text-text-primary">History</Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search data..."
              className="bg-bg-input border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 w-48"
            />
          </div>
          <button className="text-text-secondary hover:text-text-primary">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-text-secondary hover:text-text-primary">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-primary/30 border-2 border-primary" />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 bg-bg-card border border-border rounded-full px-4 py-1.5 mb-8">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">System Status: Optimal</span>
            </div>

            <h1 className="text-5xl font-bold leading-tight mb-6">
              <span className="text-text-primary">Detect Plant Diseases</span>
              <br />
              <span className="text-primary">Using Advanced AI</span>
            </h1>

            <p className="text-text-secondary text-base leading-relaxed mb-10 max-w-lg">
              Precision agronomy meets neural networks. Monitor crop health in real-time
              with sub-millimeter diagnostic accuracy and automated treatment
              recommendations.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4 mb-12">
              <Link
                to="/detection"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                Start Detection
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-bg-card border border-border hover:border-primary/50 text-text-primary px-6 py-3 rounded-full font-medium transition-colors"
              >
                Learn More
              </Link>
            </div>

            {/* Tech Badges */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-text-muted text-xs uppercase tracking-wider">
                <Globe className="w-4 h-4" />
                TensorFlow Core
              </div>
              <div className="flex items-center gap-2 text-text-muted text-xs uppercase tracking-wider">
                <Waves className="w-4 h-4" />
                Multi-Spectral
              </div>
              <div className="flex items-center gap-2 text-text-muted text-xs uppercase tracking-wider">
                <Shield className="w-4 h-4" />
                USDA Compliant
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image Area */}
          <div className="relative">
            {/* AI Precision Badge */}
            <div className="absolute top-0 right-0 bg-bg-card border border-border rounded-xl px-4 py-3 z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase">AI Precision</p>
                  <p className="text-lg font-bold text-text-primary">97.3%</p>
                </div>
              </div>
            </div>

            {/* Main Image Placeholder */}
            <div className="bg-bg-card border border-border rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22c4-4 8-7.5 8-12a8 8 0 10-16 0c0 4.5 4 8 8 12z" />
                    <path d="M12 12V8" />
                    <path d="M12 8c-1 0-2 1-2 2" />
                    <path d="M12 8c1 0 2 1 2 2" />
                  </svg>
                </div>
                <p className="text-text-muted text-sm">AI Plant Analysis Engine</p>
              </div>

              {/* Scanning rings */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <div className="w-32 h-16 border border-primary/30 rounded-full" />
                <div className="w-24 h-12 border border-primary/20 rounded-full absolute top-2 left-4" />
              </div>
            </div>

            {/* Analyses Completed Badge */}
            <div className="absolute bottom-4 right-8 bg-bg-card border border-border rounded-xl px-5 py-3">
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Analyses Completed</p>
              <p className="text-2xl font-bold text-text-primary">1.2M+</p>
              <div className="w-12 h-1 bg-primary rounded-full mt-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-bg-card border border-border rounded-2xl p-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">Leaf Edge Analysis</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Proprietary vision models detect cellular-level decay before visible symptoms appear.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-bg-card border border-border rounded-2xl p-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 12h4l3-9 4 18 3-9h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">Cross-Model Validation</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Dual-engine verification comparing neural results against regional botanical databases.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-bg-card border border-border rounded-2xl p-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">Predictive History</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Automated timeline tracking to forecast potential spread across your entire yield.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-primary font-bold text-sm">PLANTVISION AI</span>
            <span className="text-text-muted text-sm">© 2024 Precision Agronomy Systems.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-primary text-sm hover:underline">Documentation</a>
            <a href="#" className="text-primary text-sm hover:underline">System Status</a>
            <a href="#" className="text-primary text-sm hover:underline">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
