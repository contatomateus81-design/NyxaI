import { useState } from 'react'

interface AppItem {
  id: string
  name: string
  icon: string
  color: string
}

const apps: AppItem[] = [
  { id: 'google', name: 'Google', icon: '🔍', color: '#4285F4' },
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: '#25D366' },
  { id: 'whatsapp-business', name: 'WhatsApp Business', icon: '💼', color: '#00A884' },
  { id: 'instagram', name: 'Instagram', icon: '📸', color: '#E4405F' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', color: '#FF0000' },
  { id: 'tor', name: 'Tor', icon: '🧅', color: '#7D4698' },
  { id: 'brave', name: 'Brave', icon: '🦁', color: '#FB542B' },
  { id: 'operagx', name: 'Opera GX', icon: '🎮', color: '#FA1E4E' },
]

interface SidebarProps {
  selectedApp: string
  onSelectApp: (appId: string) => void
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ selectedApp, onSelectApp, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-full w-64 
          bg-dark-800 border-r border-dark-700
          transform transition-transform duration-300 ease-in-out
          lg:transform-none lg:static lg:block
          z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-dark-700">
          <h2 className="text-xl font-bold text-purple-400">Apps</h2>
          <p className="text-sm text-dark-400 mt-1">Selecione um aplicativo</p>
        </div>

        {/* Lista de Apps */}
        <nav className="p-2">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                onSelectApp(app.id)
                onClose()
              }}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg mb-1
                transition-all duration-200
                ${selectedApp === app.id 
                  ? 'bg-purple-700 text-white shadow-lg shadow-purple-900/50' 
                  : 'bg-dark-700 text-dark-200 hover:bg-dark-600 hover:text-white'
                }
              `}
            >
              <span 
                className="text-2xl"
                style={{ filter: selectedApp === app.id ? 'none' : 'grayscale(30%)' }}
              >
                {app.icon}
              </span>
              <span className="font-medium">{app.name}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-700">
          <div className="flex items-center gap-2 text-dark-400 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Online</span>
          </div>
        </div>
      </aside>
    </>
  )
}
