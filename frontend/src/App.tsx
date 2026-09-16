import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import WelcomeScreen from './components/WelcomeScreen'

const apps = [
  { id: 'google', name: 'Google', color: '#4285F4', packageName: 'com.google.android.googlequicksearchbox', playStoreId: 'com.google.android.googlequicksearchbox' },
  { id: 'whatsapp', name: 'WhatsApp', color: '#25D366', packageName: 'com.whatsapp', playStoreId: 'com.whatsapp' },
  { id: 'whatsapp-business', name: 'WhatsApp Business', color: '#00A884', packageName: 'com.whatsapp.w4b', playStoreId: 'com.whatsapp.w4b' },
  { id: 'instagram', name: 'Instagram', color: '#E4405F', packageName: 'com.instagram.android', playStoreId: 'com.instagram.android', hasWebVersion: true, webUrl: 'https://www.instagram.com' },
  { id: 'youtube', name: 'YouTube', color: '#FF0000', packageName: 'com.google.android.youtube', playStoreId: 'com.google.android.youtube' },
  { id: 'tor', name: 'Tor Browser', color: '#7D4698', packageName: 'org.torproject.torbrowser', playStoreId: 'org.torproject.torbrowser' },
  { id: 'brave', name: 'Brave', color: '#FB542B', packageName: 'com.brave.browser', playStoreId: 'com.brave.browser' },
  { id: 'operagx', name: 'Opera GX', color: '#FA1E4E', packageName: 'com.opera.gx', playStoreId: 'com.opera.gx' },
]

function ChatPage() {
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)

  const currentApp = apps.find(app => app.id === selectedApp)

  const handleAppSelect = (appId: string) => {
    const app = apps.find(a => a.id === appId)
    if (!app) return

    // Verifica se é Instagram para mostrar opções especiais
    if (app.hasWebVersion) {
      // Para Instagram, mostramos o chat com opções
      setSelectedApp(appId)
      setShowWelcome(false)
    } else {
      // Para outros apps, tenta abrir diretamente
      setSelectedApp(appId)
      setShowWelcome(false)
    }
    
    setSidebarOpen(false)
  }

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
        selectedApp={selectedApp || ''}
        onSelectApp={handleAppSelect}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <main className="flex-1 flex flex-col lg:ml-0">
        {showWelcome ? (
          <WelcomeScreen onGetStarted={() => setShowWelcome(false)} />
        ) : currentApp ? (
          <ChatWindow 
            app={currentApp}
            onOpenApp={() => {
              // Lógica para abrir app ou loja
              const isInstalled = Math.random() > 0.3 // Simulação - em produção usaria Capacitor
              if (isInstalled) {
                window.location.href = `intent:${currentApp.packageName}`
              } else {
                window.open(`https://play.google.com/store/apps/details?id=${currentApp.playStoreId}`, '_blank')
              }
            }}
          />
        ) : (
          <WelcomeScreen onGetStarted={() => setShowWelcome(false)} />
        )}
      </main>
    </div>
  )
}

export default ChatPage
