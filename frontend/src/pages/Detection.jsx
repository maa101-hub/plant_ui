import { useState, useRef } from 'react'
import { Upload, RefreshCw, CheckCircle, AlertTriangle, X, Loader, ExternalLink } from 'lucide-react'
import { predictImage } from '../api'

const MODEL_OPTIONS = [
  { key: 'custom_cnn', name: 'Custom CNN', accuracy: '90.2%', speed: '42ms',  active: true },
  { key: 'resnet50',   name: 'ResNet50',   accuracy: '97.3%', speed: '88ms',  active: false },
]

export default function Detection() {
  const [selectedModel, setSelectedModel] = useState('custom_cnn')
  const [selectedFile, setSelectedFile]   = useState(null)
  const [preview, setPreview]             = useState(null)
  const [result, setResult]               = useState(null)
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState(null)
  const [dragOver, setDragOver]           = useState(false)
  const fileInputRef = useRef()

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, TIFF).')
      return
    }
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
    setError(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await predictImage(selectedFile, selectedModel)
      setResult(data)
    } catch (err) {
      setError(err.message || 'Could not connect to the AI server. Make sure the backend is running on port 8000.')
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

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-primary text-lg font-semibold">Detection Workspace</h1>
          <span className="text-text-muted text-sm">
            Active Model: {MODEL_OPTIONS.find(m => m.key === selectedModel)?.name}
          </span>
        </div>
        <h2 className="text-3xl font-bold text-text-primary">AI Diagnostic Console</h2>
        <p className="text-text-secondary text-sm mt-2 max-w-2xl">
          Deploy state-of-the-art neural networks to identify pathogens, nutrient deficiencies, and
          physiological stress in crops with sub-millimeter precision.
        </p>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Left Panel */}
        <div className="col-span-2 space-y-4">
          {/* Model Selection */}
          <div className="bg-bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-text-primary">Model Selection</h3>
              <button onClick={handleReset} className="text-text-muted hover:text-primary" title="Reset">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {MODEL_OPTIONS.map((model) => {
                const isSelected = selectedModel === model.key
                return (
                  <button
                    key={model.key}
                    onClick={() => { setSelectedModel(model.key); setResult(null) }}
                    className={`w-full text-left p-4 rounded-xl border transition-colors ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-text-primary">{model.name}</span>
                      {isSelected && (
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium uppercase">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-[10px] text-text-muted uppercase tracking-wider">Accuracy</p>
                        <p className="text-lg font-bold text-text-primary">{model.accuracy}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-muted uppercase tracking-wider">Speed</p>
                        <p className="text-lg font-bold text-text-primary">{model.speed}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Telemetry */}
          <div className="bg-bg-card border border-border rounded-2xl p-6">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Global Telemetry</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">GPU Utilization</span>
                <div className="w-24 h-2 bg-bg-input rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-primary rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Neural Latency</span>
                <span className="text-sm font-mono text-primary">
                  {result ? `${result.latency_ms}ms` : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Active Model</span>
                <span className="text-sm font-mono text-primary">
                  {MODEL_OPTIONS.find(m => m.key === selectedModel)?.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-span-3 space-y-4">
          {!result ? (
            /* Upload Area */
            <div
              className={`bg-bg-card border-2 border-dashed rounded-2xl transition-colors ${
                dragOver ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {preview ? (
                <div className="p-6">
                  <div className="relative">
                    <img src={preview} alt="Selected plant" className="w-full h-64 object-cover rounded-xl" />
                    <button
                      onClick={handleReset}
                      className="absolute top-2 right-2 bg-bg-dark/80 text-text-secondary hover:text-text-primary p-1.5 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-primary font-medium">{selectedFile?.name}</p>
                      <p className="text-xs text-text-muted mt-0.5">{(selectedFile?.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      onClick={handleAnalyze}
                      disabled={loading}
                      className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
                    >
                      {loading ? <><Loader className="w-4 h-4 animate-spin" />Analyzing...</> : 'Run Analysis'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-16">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-3">Initialize Plant Analysis</h3>
                  <p className="text-text-secondary text-sm text-center max-w-sm mb-8">
                    Drag and drop a leaf image here. Supports JPG, PNG, TIFF formats.
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-medium transition-colors"
                  >
                    Select File
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => handleFile(e.target.files[0])} />
                </div>
              )}
            </div>
          ) : (
            <ResultCard result={result} onReset={handleReset} preview={preview} />
          )}

          {error && (
            <div className="bg-accent-red/10 border border-accent-red/30 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-accent-red shrink-0 mt-0.5" />
              <p className="text-sm text-text-primary">{error}</p>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-12 pt-6 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-primary font-bold text-sm tracking-[0.15em]">PLANTVISION AI</span>
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

function ResultCard({ result, onReset, preview }) {
  const { prediction, disease_info, supplement, top5 } = result
  const isHealthy = prediction.is_healthy

  return (
    <div className="space-y-4">
      {/* Main Result */}
      <div className={`bg-bg-card border rounded-2xl p-6 ${isHealthy ? 'border-primary/40' : 'border-accent-red/40'}`}>
        <div className="flex items-start gap-4">
          {preview && <img src={preview} alt="analyzed" className="w-24 h-24 object-cover rounded-xl shrink-0" />}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isHealthy
                ? <CheckCircle className="w-5 h-5 text-primary" />
                : <AlertTriangle className="w-5 h-5 text-accent-red" />}
              <span className={`text-xs font-semibold uppercase tracking-wider ${isHealthy ? 'text-primary' : 'text-accent-red'}`}>
                {isHealthy ? 'Healthy Plant' : 'Disease Detected'}
              </span>
              <span className="ml-auto text-xs text-text-muted bg-bg-input px-2 py-0.5 rounded-full">
                {result.model_used === 'custom_cnn' ? 'Custom CNN' : 'ResNet50'} · {result.latency_ms}ms
              </span>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-1">{prediction.disease_name}</h3>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[10px] text-text-muted uppercase">Confidence</p>
                <p className="text-2xl font-bold text-primary">{prediction.confidence.toFixed(1)}%</p>
              </div>
              <div className="flex-1 h-2 bg-bg-input rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${prediction.confidence}%` }} />
              </div>
            </div>
          </div>
          <button onClick={onReset} className="text-text-muted hover:text-text-primary"><X className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Description & Steps */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-bg-card border border-border rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-text-primary mb-3">Description</h4>
          <p className="text-xs text-text-secondary leading-relaxed line-clamp-6">{disease_info.description}</p>
        </div>
        <div className="bg-bg-card border border-border rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-text-primary mb-3">Treatment Steps</h4>
          <p className="text-xs text-text-secondary leading-relaxed line-clamp-6">{disease_info.possible_steps}</p>
        </div>
      </div>

      {/* Top 5 */}
      <div className="bg-bg-card border border-border rounded-2xl p-5">
        <h4 className="text-sm font-semibold text-text-primary mb-4">Top Predictions</h4>
        <div className="space-y-2">
          {top5.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-text-muted w-4">{i + 1}</span>
              <span className="text-xs text-text-secondary flex-1 truncate">
                {item.class.replace(/___/g, ' › ').replace(/_/g, ' ')}
              </span>
              <div className="w-24 h-1.5 bg-bg-input rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${item.confidence}%` }} />
              </div>
              <span className="text-xs text-text-secondary w-12 text-right">{item.confidence}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Supplement */}
      {supplement.name && supplement.name !== 'nan' && (
        <div className="bg-bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-xl">💊</div>
          <div className="flex-1">
            <p className="text-[10px] text-text-muted uppercase tracking-wider">Recommended Supplement</p>
            <p className="text-sm font-semibold text-text-primary mt-0.5">{supplement.name}</p>
          </div>
          {supplement.buy_link && supplement.buy_link !== 'nan' && (
            <a href={supplement.buy_link} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors">
              Buy Now <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
    </div>
  )
}
