import { ReactFlowProvider } from '@xyflow/react'
import { Canvas } from './components/Canvas'
import { AssetsSidebar } from './components/AssetsSidebar'
import { PropertyPanel } from './components/PropertyPanel'
import { Toolbar } from './components/Toolbar'
import { useAutoSave } from './hooks/useAutoSave'

function AppContent() {
  // Initialize auto-save
  useAutoSave()

  return (
    <div className="w-full h-full flex flex-col bg-slate-950">
      {/* Top Toolbar */}
      <Toolbar />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Assets */}
        <AssetsSidebar />

        {/* Canvas */}
        <Canvas />

        {/* Right Sidebar - Properties */}
        <PropertyPanel />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  )
}
