import { 
  Search, 
  MessageCircle, 
  Briefcase, 
  Camera, 
  Play, 
  Globe, 
  Shield, 
  Gamepad2 
} from 'lucide-react'

interface AppItem {
  id: string
  name: string
  color: string
  icon: React.ReactNode
  packageName: string
  playStoreId: string
  hasWebVersion?: boolean
  webUrl?: string
}

const apps: AppItem[] = [
  { 
    id: 'google', 
    name: 'Google', 
    color: '#4285F4', 
    icon: <Search className="w-6 h-6" />,
    packageName: 'com.google.android.googlequicksearchbox',
    playStoreId: 'com.google.android.googlequicksearchbox'
  },
  { 
    id: 'whatsapp', 
    name: 'WhatsApp', 
    color: '#25D366', 
    icon: <MessageCircle className="w-6 h-6" />,
    packageName: 'com.whatsapp',
    playStoreId: 'com.whatsapp'
  },
  { 
    id: 'whatsapp-business', 
    name: 'WhatsApp Business', 
    color: '#00A884', 
    icon: <Briefcase className="w-6 h-6" />,
    packageName: 'com.whatsapp.w4b',
    playStoreId: 'com.whatsapp.w4b'
  },
  { 
    id: 'instagram', 
    name: 'Instagram', 
    color: '#E4405F', 
    icon: <Camera className="w-6 h-6" />,
    packageName: 'com.instagram.android',
    playStoreId: 'com.instagram.android',
    hasWebVersion: true,
    webUrl: 'https://www.instagram.com'
  },
  { 
    id: 'youtube', 
    name: 'YouTube', 
    color: '#FF0000', 
    icon: <Play className="w-6 h-6" />,
    packageName: 'com.google.android.youtube',
    playStoreId: 'com.google.android.youtube'
  },
  { 
    id: 'tor', 
    name: 'Tor Browser', 
    color: '#7D4698', 
    icon: <Globe className="w-6 h-6" />,
    packageName: 'org.torproject.torbrowser',
    playStoreId: 'org.torproject.torbrowser'
  },
  { 
    id: 'brave', 
    name: 'Brave', 
    color: '#FB542B', 
    icon: <Shield className="w-6 h-6" />,
    packageName: 'com.brave.browser',
    playStoreId: 'com.brave.browser'
  },
  { 
    id: 'operagx', 
    name: 'Opera GX', 
    color: '#FA1E4E', 
    icon: <Gamepad2 className="w-6 h-6" />,
    packageName: 'com.opera.gx',
    playStoreId: 'com.opera.gx'
  },
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
                className="flex items-center justify-center w-8 h-8 rounded-lg"
                style={{ 
                  backgroundColor: selectedApp === app.id ? 'rgba(255,255,255,0.2)' : app.color + '20',
                  color: app.color
                }}
              >
                {app.icon}
              </span>
              <span className="font-medium">{app.name}</span>
              {app.hasWebVersion && (
                <span className="ml-auto text-xs bg-purple-600 px-2 py-1 rounded-full">Web</span>
              )}
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
