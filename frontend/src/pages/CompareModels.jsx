import { useState, useRef } from 'react'
import { Upload, Download, RefreshCw, Sparkles, AlertTriangle, ExternalLink, Loader, X } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { predictCompare } from '../api'

export default function CompareModels() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview]           = useState(null)
  const [result, setResult]             = useState(null)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState(null)
  const [dragOver, setDragOver]         = useState(false)
  const fileInputRef = useRef()

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
    setError(null)
  }

  const handleCompare = async () => {
    if (!selectedFile) return
    setLoading(true)
    setError(null)
    try {
      const data = await predictCompare(selectedFile)
      setResult(data)
    } catch (err) {
      setError(err.message || 'Could not connect to the AI server.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  // Build chart data from results
  const confidenceData = result ? [
    { name: 'Custom CNN', value: result.custom_cnn.prediction.confidence },
    { name: 'ResNet50',   value: result.resnet50.prediction.confidence },
  ] : [
    { name: 'Custom CNN', value: 0 },
    { name: 'ResNet50',   value: 0 },
  ]

  const performanceRows = result ? [
    {
      model: 'Custom CNN', key: 'custom_cnn',
      prediction: result.custom_cnn.prediction.disease_name,
      confidence: result.custom_cnn.prediction.confidence,
      speed: `${result.custom_cnn.latency_ms}ms`,
      status: result.summary.recommended_model === 'custom_cnn' ? 'RECOMMENDED' : 'STABLE',
    },
    {
      model: 'ResNet50', key: 'resnet50',
      prediction: result.resnet50.prediction.disease_name,
      confidence: result.resnet50.prediction.confidence,
      speed: `${result.resnet50.latency_ms}ms`,
      status: result.summary.recommended_model === 'resnet50' ? 'RECOMMENDED' : 'STABLE',
    },
  ] : null

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-text-primary">Multi-Model Comparison</h2>
          <p className="text-text-secondary text-sm mt-2 max-w-2xl">
            Benchmarking real-time leaf tissue analysis against our core neural network
            architectures. Evaluating precision, latency, and predictive confidence.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-bg-card border border-border px-4 py-2 rounded-lg text-sm text-text-primary hover:border-primary/50 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button
            onClick={result ? handleCompare : undefined}
            disabled={!selectedFile || loading}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? <><Loader className="w-4 h-4 animate-spin" />Running...</> : <><RefreshCw className="w-4 h-4" />Re-run Batch</>}
          </button>
        </div>
      </div>

      {/* Upload + Results Grid */}
      <div className="grid grid-cols-5 gap-6 mb-6">
        {/* Image Panel */}
        <div className="col-span-2 bg-bg-card border border-border rounded-2xl overflow-hidden">
          {preview ? (
            <div className="relative h-full min-h-64">
              <img src={preview} alt="leaf sample" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-bg-dark/80 backdrop-blur px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-primary text-[10px] font-mono uppercase">Scanning:</p>
                  <p className="text-text-primary text-xs font-mono truncate max-w-48">{selectedFile?.name}</p>
                </div>
                <button onClick={handleReset} className="text-text-muted hover:text-text-primary">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {!result && (
                <div className="absolute inset-0 flex items-center justify-center bg-bg-dark/40">
                  <button
                    onClick={handleCompare}
                    disabled={loading}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    {loading ? <><Loader className="w-4 h-4 animate-spin" />Comparing...</> : 'Compare Models'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div
              className={`h-full min-h-64 flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-colors cursor-pointer ${
                dragOver ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-10 h-10 text-primary mb-4" />
              <p className="text-text-primary text-sm font-medium mb-1">Upload leaf image</p>
              <p className="text-text-muted text-xs text-center">Drag & drop or click to select</p>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => handleFile(e.target.files[0])} />
            </div>
          )}
        </div>

        {/* Architecture Performance Table */}
        <div className="col-span-3 bg-bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">Architecture Performance</h3>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${result ? 'bg-primary' : 'bg-text-muted'}`} />
              <span className="text-text-muted text-xs font-mono">
                {result ? 'SYNCED_ENGINES' : 'AWAITING_INPUT'}
              </span>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 pb-3 border-b border-border mb-3">
            {['Model Engine', 'Prediction', 'Confidence', 'Speed', 'Status'].map(h => (
              <span key={h} className="text-xs text-text-muted uppercase">{h}</span>
            ))}
          </div>

          {/* Rows */}
          {(performanceRows || [
            { model: 'Custom CNN', key: 'custom_cnn', prediction: '—', confidence: 0, speed: '42ms', status: 'READY' },
            { model: 'ResNet50',   key: 'resnet50',   prediction: '—', confidence: 0, speed: '88ms', status: 'READY' },
          ]).map((row) => (
            <div key={row.key} className="grid grid-cols-5 gap-4 py-3 border-b border-border/50 items-center">
              <span className={`text-sm font-semibold ${row.status === 'RECOMMENDED' ? 'text-primary' : 'text-text-primary'}`}>
                {row.model}
              </span>
              <span className="text-xs text-text-secondary truncate">{row.prediction}</span>
              <div className="flex items-center gap-2">
                <div className="w-14 h-2 bg-bg-input rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${row.confidence}%` }} />
                </div>
                <span className="text-xs text-text-secondary">{row.confidence > 0 ? `${row.confidence.toFixed(1)}%` : '—'}</span>
              </div>
              <span className="text-sm text-text-secondary">{row.speed}</span>
              <span className={`text-[10px] px-2 py-1 rounded-full font-medium w-fit ${
                row.status === 'RECOMMENDED' ? 'text-primary bg-primary/10' : 'text-text-secondary bg-bg-input'
              }`}>{row.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-accent-red/10 border border-accent-red/30 rounded-xl p-4 flex items-start gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-accent-red shrink-0 mt-0.5" />
          <p className="text-sm text-text-primary">{error}</p>
        </div>
      )}

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Confidence Distribution */}
        <div className="bg-bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Confidence Distribution</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '8px' }}
                  formatter={(v) => [`${v.toFixed(1)}%`, 'Confidence']} />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {result && (
            <p className="text-center text-primary text-sm font-semibold mt-2">
              {Math.max(result.custom_cnn.prediction.confidence, result.resnet50.prediction.confidence).toFixed(1)}%
            </p>
          )}
        </div>

        {/* Optimal Match */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          {result ? (
            <>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Optimal Match</h3>
              <p className="text-text-secondary text-sm mb-1">
                {result.summary.recommended_model === 'custom_cnn' ? 'Custom CNN' : 'ResNet50'} selected
              </p>
              <p className="text-text-muted text-xs mb-4">
                {result.summary.agreement ? '✓ Both models agree' : '⚠ Models disagree'}
              </p>
              <button className="bg-primary/10 border border-primary/30 text-primary px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
                View Logic
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Optimal Match</h3>
              <p className="text-text-secondary text-sm mb-4">Upload an image to see which model performs best.</p>
            </>
          )}
        </div>

        {/* Avg Inference */}
        <div className="bg-bg-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Avg Inference</p>
          <p className="text-5xl font-bold text-primary">
            {result ? result.summary.avg_latency_ms : '—'}
            <span className="text-lg text-text-secondary ml-1">ms</span>
          </p>
          <p className="text-text-muted text-xs mt-3">Real-time optimized</p>
          <div className="mt-4 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <ExternalLink className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-bg-card border border-border rounded-2xl p-6 flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Neural Diversity Strategy</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Cross-referencing multiple architectures mitigates model bias. By running a
              heterogeneous ensemble, PlantVision AI ensures diagnostic accuracy even in
              high-noise environmental conditions.
            </p>
          </div>
        </div>

        <div className={`bg-bg-card rounded-2xl p-6 flex items-start gap-4 ${
          result && !result.summary.agreement ? 'border border-accent-red/30' : 'border border-border'
        }`}>
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
            result && !result.summary.agreement ? 'bg-accent-red/10' : 'bg-accent-yellow/10'
          }`}>
            <AlertTriangle className={`w-7 h-7 ${result && !result.summary.agreement ? 'text-accent-red' : 'text-accent-yellow'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Pathogen Risk Alert</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              {result
                ? `Current detection indicates ${result.custom_cnn.prediction.disease_name}. ${
                    result.custom_cnn.prediction.is_healthy
                      ? 'Plant appears healthy — no immediate action required.'
                      : 'Immediate intervention is recommended for the infected area.'
                  }`
                : 'Upload a leaf image to receive a real-time pathogen risk assessment.'}
            </p>
          </div>
        </div>
      </div>

      <footer className="mt-12 pt-6 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-primary font-bold text-sm">PlantVision AI</span>
          <span className="text-text-muted text-sm">© 2024 Precision Agronomy Systems.</span>
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
