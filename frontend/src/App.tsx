import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import WelcomeScreen from './components/WelcomeScreen'
import GameHub from './components/GameHub'

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

interface Game {
  name: string;
  packageName: string;
}

function ChatPage() {
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [gameHubOpen, setGameHubOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [installedGames, setInstalledGames] = useState<Game[]>([])

  const currentApp = apps.find(app => app.id === selectedApp)

  useEffect(() => {
    // Carregar jogos instalados quando o GameHub for aberto
    if (gameHubOpen && installedGames.length === 0) {
      loadInstalledGames()
    }
  }, [gameHubOpen])

  const loadInstalledGames = async () => {
    try {
      // @ts-ignore - Capacitor plugin
      const { Plugins } = await import('@capacitor/core')
      const { GameHub } = Plugins
      
      if (GameHub) {
        const result = await GameHub.getInstalledGames()
        setInstalledGames(result.games || [])
      }
    } catch (error) {
      console.error('Erro ao carregar jogos:', error)
      // Fallback para testes no navegador
      setInstalledGames([
        { name: 'Candy Crush Saga', packageName: 'com.king.candycrushsaga' },
        { name: 'Clash of Clans', packageName: 'com.supercell.clashofclans' },
        { name: 'Pokémon GO', packageName: 'com.nianticlabs.pokemongo' },
      ])
    }
  }

  const launchGame = async (packageName: string) => {
    try {
      // @ts-ignore - Capacitor plugin
      const { Plugins } = await import('@capacitor/core')
      const { GameHub } = Plugins
      
      if (GameHub) {
        await GameHub.launchGame({ packageName })
      } else {
        // Fallback para navegador
        window.open(`intent:${packageName}`, '_blank')
      }
    } catch (error) {
      console.error('Erro ao abrir jogo:', error)
      alert('Não foi possível abrir o jogo. Verifique se ele está instalado.')
    }
  }

  const handleAppSelect = (appId: string) => {
    const app = apps.find(a => a.id === appId)
    if (!app) return

    setSelectedApp(appId)
    setShowWelcome(false)
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

      {/* Botão GameHub (lado direito) */}
      <button
        onClick={() => setGameHubOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      <Sidebar
        selectedApp={selectedApp || ''}
        onSelectApp={handleAppSelect}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      {/* GameHub Drawer */}
      <GameHub
        games={installedGames}
        isOpen={gameHubOpen}
        onClose={() => setGameHubOpen(false)}
        onLaunchGame={launchGame}
      />
      
      <main className="flex-1 flex flex-col lg:ml-0">
        {showWelcome ? (
          <WelcomeScreen onGetStarted={() => setShowWelcome(false)} />
        ) : currentApp ? (
          <ChatWindow 
            app={currentApp}
            onOpenApp={() => {
              const isInstalled = Math.random() > 0.3
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
