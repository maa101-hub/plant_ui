import { Outlet, NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ScanLine,
  GitCompare,
  Clock,
  BookOpen,
  Info,
  Plus,
  Search,
  Bell,
  Settings,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/detection', icon: ScanLine, label: 'Detection' },
  { to: '/compare', icon: GitCompare, label: 'Compare Models' },
  { to: '/history', icon: Clock, label: 'History' },
  { to: '/knowledge-base', icon: BookOpen, label: 'Knowledge Base' },
  { to: '/about', icon: Info, label: 'About' },
]

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-bg-sidebar border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <ScanLine className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-text-primary">PlantVision AI</h1>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">AI Core: Active</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors relative ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-input'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-l" />
                  )}
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* New Analysis Button */}
        <div className="p-4">
          <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-xl font-medium text-sm transition-colors">
            <Plus className="w-4 h-4" />
            New Analysis
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            {/* Page-specific content rendered by child */}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search data..."
                className="bg-bg-input border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 w-56"
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
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
