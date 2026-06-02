import { useEffect, useState } from 'react'
import { Calendar, Download, BarChart3, CheckCircle, AlertTriangle, Brain, MapPin, RefreshCw } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip,
  BarChart, Bar, Cell,
} from 'recharts'
import { fetchStats } from '../api'

export default function Dashboard() {
  const [stats, setStats]           = useState(null)
  const [backendOnline, setBackendOnline] = useState(null)
  const [loading, setLoading]       = useState(true)

  const load = () => {
    setLoading(true)
    fetchStats()
      .then((data) => { setStats(data); setBackendOnline(true) })
      .catch(() => setBackendOnline(false))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  // Derived values from real stats
  const totalPred   = stats?.total_predictions ?? 0
  const healthyPct  = stats ? ((stats.healthy_count / stats.total_predictions) * 100).toFixed(1) : '—'
  const diseasedPct = stats ? ((stats.diseased_count / stats.total_predictions) * 100).toFixed(1) : '—'
  const bestAcc     = stats?.model_accuracy ?? '—'

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-primary text-lg font-semibold">Disease Intelligence</h1>
            <span className="text-text-muted text-sm flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              PlantVillage Validation Set
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase ${
              backendOnline === null ? 'bg-bg-input text-text-muted'
              : backendOnline ? 'bg-primary/10 text-primary'
              : 'bg-accent-red/10 text-accent-red'
            }`}>
              {backendOnline === null ? '● Connecting' : backendOnline ? '● API Online' : '● API Offline'}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-text-primary">Intelligence Dashboard</h2>
          <p className="text-text-secondary text-sm mt-1">
            Real model evaluation metrics — PlantVillage dataset, 10,861 validation images.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="flex items-center gap-2 bg-bg-card border border-border px-4 py-2 rounded-lg text-sm text-text-primary hover:border-primary/50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="flex items-center gap-2 bg-bg-card border border-border px-4 py-2 rounded-lg text-sm text-text-primary hover:border-primary/50 transition-colors">
            <Calendar className="w-4 h-4" />
            Val Set
          </button>
          <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<BarChart3 className="w-5 h-5 text-accent-blue" />}
          iconBg="bg-accent-blue/10"
          label="VALIDATION IMAGES"
          value={stats ? totalPred.toLocaleString() : '—'}
          badge={stats ? `${stats.dataset?.train_images.toLocaleString()} train` : null}
          badgeColor="text-text-muted"
          sub={stats ? `${stats.dataset?.classes} disease classes` : null}
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5 text-primary" />}
          iconBg="bg-primary/10"
          label="HEALTHY SAMPLES"
          value={stats ? stats.healthy_count.toLocaleString() : '—'}
          badge="Healthy"
          badgeColor="text-primary"
          sub={stats ? `${healthyPct}% of validation set` : null}
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5 text-accent-red" />}
          iconBg="bg-accent-red/10"
          label="DISEASED SAMPLES"
          value={stats ? stats.diseased_count.toLocaleString() : '—'}
          badge="Detected"
          badgeColor="text-accent-red"
          sub={stats ? `${diseasedPct}% of validation set` : null}
        />
        <StatCard
          icon={<Brain className="w-5 h-5 text-primary" />}
          iconBg="bg-primary/10"
          label="BEST MODEL ACCURACY"
          value={bestAcc}
          valueSuffix="%"
          sub={stats ? `ResNet50 — ${stats.resnet_correct?.toLocaleString()} / ${totalPred.toLocaleString()} correct` : null}
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Training Accuracy Trend */}
        <div className="col-span-2 bg-bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Training Accuracy Trend</h3>
              <p className="text-text-muted text-sm">
                Rolling validation accuracy over 7 evaluation runs
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-text-secondary text-xs">ResNet50</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-blue" />
                <span className="text-text-secondary text-xs">Custom CNN</span>
              </div>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.weekly_trend ?? []}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                  hide={false}
                  domain={[85, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  width={40}
                />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '8px' }}
                  labelStyle={{ color: '#94a3b8' }}
                  formatter={(v, name) => [`${v}%`, name === 'resnet_acc' ? 'ResNet50' : 'Custom CNN']}
                />
                <Line type="monotone" dataKey="resnet_acc" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} />
                <Line type="monotone" dataKey="cnn_acc"    stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Diseases */}
        <div className="bg-bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-5">Top Diseases in Dataset</h3>
          <div className="space-y-3">
            {(stats?.top_diseases ?? []).map((d) => (
              <div key={d.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-text-primary truncate max-w-40">{d.name}</span>
                  <span className="text-xs text-text-secondary ml-2 shrink-0">{d.pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-bg-input rounded-full">
                  <div className="h-1.5 bg-primary rounded-full" style={{ width: `${(d.pct / 10) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Outbreak Warning */}
          <div className="mt-5 bg-bg-input border border-accent-red/20 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-accent-red mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-text-primary">High Prevalence Alert</p>
                <p className="text-xs text-text-secondary mt-1">
                  Tomato Early Blight is the most frequent disease in the dataset at 9.2% of all samples.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Model Comparison Cards ── */}
      {stats?.models && (
        <div className="bg-bg-card border border-border rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-text-primary">Model Evaluation Summary</h3>
            <span className="text-xs text-text-muted">
              Evaluated on {stats.dataset?.val_images.toLocaleString()} validation images
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.models.map((m) => {
              const errorRate = (100 - m.accuracy).toFixed(1)
              const correct   = m.val_correct?.toLocaleString()
              const total     = m.val_total?.toLocaleString()
              return (
                <div
                  key={m.key}
                  className={`p-5 rounded-xl border ${
                    m.status === 'active' ? 'border-primary/40 bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-text-primary">{m.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase ${
                      m.status === 'active' ? 'bg-primary/20 text-primary' : 'bg-bg-input text-text-muted'
                    }`}>{m.status}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-wider">Accuracy</p>
                      <p className="text-xl font-bold text-text-primary">{m.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-wider">Avg Speed</p>
                      <p className="text-xl font-bold text-text-primary">{m.speed_ms}ms</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-wider">Params</p>
                      <p className="text-xl font-bold text-text-primary">{m.params_m}M</p>
                    </div>
                  </div>
                  {/* Accuracy bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-[10px] text-text-muted mb-1">
                      <span>Val accuracy</span>
                      <span>{correct} / {total} correct</span>
                    </div>
                    <div className="w-full h-2 bg-bg-input rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${m.accuracy}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-text-muted">
                    Error rate: {errorRate}% · {m.classes} classes · {m.params_m}M parameters
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Dataset Info + Throughput ── */}
      {stats?.dataset && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-bg-card border border-border rounded-2xl p-5">
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Dataset</p>
            <p className="text-lg font-bold text-text-primary">{stats.dataset.name}</p>
            <p className="text-xs text-text-secondary mt-1">{stats.dataset.total_images.toLocaleString()} total images</p>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Train split</span>
                <span className="text-text-primary">{stats.dataset.train_images.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Val split</span>
                <span className="text-text-primary">{stats.dataset.val_images.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Classes</span>
                <span className="text-text-primary">{stats.dataset.classes}</span>
              </div>
            </div>
          </div>

          <div className="bg-bg-card border border-border rounded-2xl p-5">
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Avg Inference (CPU)</p>
            <p className="text-3xl font-bold text-primary">
              {stats.neural_latency ? `${(stats.neural_latency * 1000).toFixed(0)}` : '—'}
              <span className="text-base text-text-secondary ml-1">ms</span>
            </p>
            <p className="text-xs text-text-secondary mt-2">Across both models on CPU</p>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Custom CNN</span>
                <span className="text-text-primary">42ms</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">ResNet50</span>
                <span className="text-text-primary">88ms</span>
              </div>
            </div>
          </div>

          <div className="bg-bg-card border border-border rounded-2xl p-5">
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Accuracy Gap</p>
            <p className="text-3xl font-bold text-accent-yellow">
              +{stats ? (97.3 - 90.2).toFixed(1) : '—'}
              <span className="text-base text-text-secondary ml-1">%</span>
            </p>
            <p className="text-xs text-text-secondary mt-2">ResNet50 over Custom CNN</p>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">ResNet50</span>
                <span className="text-primary font-medium">97.3%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Custom CNN</span>
                <span className="text-accent-blue font-medium">90.2%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Weekly Throughput Bar Chart ── */}
      {stats?.weekly_trend && (
        <div className="bg-bg-card border border-border rounded-2xl p-6 mb-8">
          <h3 className="text-base font-semibold text-text-primary mb-1">Daily Inference Throughput</h3>
          <p className="text-text-muted text-sm mb-5">Images processed per hour across evaluation runs</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weekly_trend} barSize={28}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} width={40} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '8px' }}
                  formatter={(v) => [`${v} img/hr`, 'Throughput']}
                />
                <Bar dataKey="throughput" radius={[4, 4, 0, 0]}>
                  {stats.weekly_trend.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.throughput === Math.max(...stats.weekly_trend.map(d => d.throughput))
                        ? '#10b981' : '#1e293b'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <footer className="mt-4 pt-6 border-t border-border flex items-center justify-between">
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

function StatCard({ icon, iconBg, label, value, valueSuffix, badge, badgeColor, sub }) {
  return (
    <div className="bg-bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>{icon}</div>
        {badge && <span className={`text-xs font-medium ${badgeColor}`}>{badge}</span>}
      </div>
      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-bold text-text-primary">
        {value}{valueSuffix && <span className="text-lg">{valueSuffix}</span>}
      </p>
      {sub && <p className="text-xs text-text-muted mt-1">{sub}</p>}
      <div className="w-12 h-1 bg-primary rounded-full mt-3" />
    </div>
  )
}
