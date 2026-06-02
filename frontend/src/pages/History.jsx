import { Calendar, Download, Filter, Search } from 'lucide-react'

const historyData = [
  {
    id: 'ANL-0492',
    date: '2024-03-15 14:32',
    model: 'Custom CNN',
    prediction: 'Early Blight',
    confidence: 98.2,
    status: 'Confirmed',
    statusColor: 'text-primary bg-primary/10',
  },
  {
    id: 'ANL-0491',
    date: '2024-03-15 13:18',
    model: 'ResNet50',
    prediction: 'Rust (Puccinia)',
    confidence: 94.7,
    status: 'Confirmed',
    statusColor: 'text-primary bg-primary/10',
  },
  {
    id: 'ANL-0490',
    date: '2024-03-15 11:45',
    model: 'VGG16',
    prediction: 'Healthy',
    confidence: 99.1,
    status: 'Verified',
    statusColor: 'text-accent-blue bg-accent-blue/10',
  },
  {
    id: 'ANL-0489',
    date: '2024-03-14 16:22',
    model: 'Custom CNN',
    prediction: 'Powdery Mildew',
    confidence: 91.3,
    status: 'Pending Review',
    statusColor: 'text-accent-yellow bg-accent-yellow/10',
  },
  {
    id: 'ANL-0488',
    date: '2024-03-14 14:55',
    model: 'Custom CNN',
    prediction: 'Late Blight',
    confidence: 96.8,
    status: 'Confirmed',
    statusColor: 'text-primary bg-primary/10',
  },
  {
    id: 'ANL-0487',
    date: '2024-03-14 10:30',
    model: 'ResNet50',
    prediction: 'Bacterial Spot',
    confidence: 88.4,
    status: 'Flagged',
    statusColor: 'text-accent-red bg-accent-red/10',
  },
]

export default function History() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-text-primary">Analysis History</h2>
          <p className="text-text-secondary text-sm mt-1">Complete log of all diagnostic analyses performed by the AI engine.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-bg-card border border-border px-4 py-2 rounded-lg text-sm text-text-primary hover:border-primary/50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 bg-bg-card border border-border px-4 py-2 rounded-lg text-sm text-text-primary hover:border-primary/50 transition-colors">
            <Calendar className="w-4 h-4" />
            Date Range
          </button>
          <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search analyses by ID, model, or prediction..."
          className="w-full bg-bg-card border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
        />
      </div>

      {/* Table */}
      <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-border">
          <span className="text-xs text-text-muted uppercase tracking-wider">Analysis ID</span>
          <span className="text-xs text-text-muted uppercase tracking-wider">Date & Time</span>
          <span className="text-xs text-text-muted uppercase tracking-wider">Model</span>
          <span className="text-xs text-text-muted uppercase tracking-wider">Prediction</span>
          <span className="text-xs text-text-muted uppercase tracking-wider">Confidence</span>
          <span className="text-xs text-text-muted uppercase tracking-wider">Status</span>
          <span className="text-xs text-text-muted uppercase tracking-wider">Actions</span>
        </div>

        {/* Table Rows */}
        {historyData.map((row) => (
          <div key={row.id} className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-border/50 hover:bg-bg-input/50 transition-colors">
            <span className="text-sm font-mono text-primary">{row.id}</span>
            <span className="text-sm text-text-secondary">{row.date}</span>
            <span className="text-sm text-text-primary">{row.model}</span>
            <span className="text-sm text-text-primary">{row.prediction}</span>
            <div className="flex items-center gap-2">
              <div className="w-12 h-1.5 bg-bg-input rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${row.confidence}%` }} />
              </div>
              <span className="text-xs text-text-secondary">{row.confidence}%</span>
            </div>
            <span className={`text-[10px] px-2 py-1 rounded-full font-medium w-fit ${row.statusColor}`}>
              {row.status}
            </span>
            <button className="text-xs text-primary hover:underline w-fit">View Details</button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-text-muted text-sm">Showing 6 of 1,247 analyses</p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-bg-card border border-border rounded-lg text-sm text-text-secondary hover:border-primary/50">
            Previous
          </button>
          <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium">1</button>
          <button className="px-3 py-1.5 bg-bg-card border border-border rounded-lg text-sm text-text-secondary hover:border-primary/50">
            2
          </button>
          <button className="px-3 py-1.5 bg-bg-card border border-border rounded-lg text-sm text-text-secondary hover:border-primary/50">
            3
          </button>
          <button className="px-3 py-1.5 bg-bg-card border border-border rounded-lg text-sm text-text-secondary hover:border-primary/50">
            Next
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-primary font-bold text-sm">PlantVision AI</span>
          <span className="text-text-muted text-sm">© 2024 PlantVision AI. Precision Agronomy Systems.</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-primary text-sm hover:underline">Documentation</a>
          <a href="#" className="text-primary text-sm hover:underline">System Status</a>
          <a href="#" className="text-primary text-sm hover:underline">Privacy</a>
        </div>
      </footer>
    </div>
  )
}
