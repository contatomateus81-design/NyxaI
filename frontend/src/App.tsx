import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'

const apps = [
  { id: 'google', name: 'Google', color: '#4285F4' },
  { id: 'whatsapp', name: 'WhatsApp', color: '#25D366' },
  { id: 'whatsapp-business', name: 'WhatsApp Business', color: '#00A884' },
  { id: 'instagram', name: 'Instagram', color: '#E4405F' },
  { id: 'youtube', name: 'YouTube', color: '#FF0000' },
  { id: 'tor', name: 'Tor', color: '#7D4698' },
  { id: 'brave', name: 'Brave', color: '#FB542B' },
  { id: 'operagx', name: 'Opera GX', color: '#FA1E4E' },
]

function ChatPage() {
  const [selectedApp, setSelectedApp] = useState('whatsapp')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const currentApp = apps.find(app => app.id === selectedApp) || apps[0]

  return (
    <div className="flex h-screen bg-dark-900">
      {/* Menu toggle para mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-purple-600 text-white p-2 rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <Sidebar
        selectedApp={selectedApp}
        onSelectApp={setSelectedApp}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <main className="flex-1 flex flex-col lg:ml-0">
        <ChatWindow 
          appName={currentApp.name} 
          appColor={currentApp.color} 
        />
      </main>
    </div>
  )
}

export default ChatPage
