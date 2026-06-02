import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Detection from './pages/Detection'
import CompareModels from './pages/CompareModels'
import History from './pages/History'
import Layout from './components/Layout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/detection" element={<Detection />} />
        <Route path="/compare" element={<CompareModels />} />
        <Route path="/history" element={<History />} />
      </Route>
    </Routes>
  )
}

export default App
