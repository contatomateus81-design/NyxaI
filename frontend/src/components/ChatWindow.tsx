import { useState } from 'react'
import { ExternalLink, Download, Globe } from 'lucide-react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'other'
  timestamp: Date
}

interface App {
  id: string
  name: string
  color: string
  packageName: string
  playStoreId: string
  hasWebVersion?: boolean
  webUrl?: string
}

interface ChatWindowProps {
  app: App
  onOpenApp: () => void
}

export default function ChatWindow({ app, onOpenApp }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: `Olá! Bem-vindo ao ${app.name}`, sender: 'other', timestamp: new Date() },
  ])
  const [inputValue, setInputValue] = useState('')

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputValue,
        sender: 'user',
        timestamp: new Date(),
      }
      setMessages([...messages, newMessage])
      setInputValue('')
      
      // Resposta automática simulada
      setTimeout(() => {
        const response: Message = {
          id: messages.length + 2,
          text: `Estou aqui para ajudar você com o ${app.name}! 😊`,
          sender: 'other',
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, response])
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleOpenInBrowser = () => {
    if (app.webUrl) {
      window.open(app.webUrl, '_blank')
    }
  }

  const handleDownloadApp = () => {
    window.open(`https://play.google.com/store/apps/details?id=${app.playStoreId}`, '_blank')
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-dark-900">
      {/* Header */}
      <header 
        className="p-4 border-b border-dark-700 flex items-center justify-between"
        style={{ backgroundColor: app.color + '20' }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
            style={{ backgroundColor: app.color }}
          >
            {app.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg">{app.name}</h3>
            <p className="text-sm text-dark-400">Toque para abrir o app</p>
          </div>
        </div>
        
        {/* Botão de ação */}
        <button
          onClick={onOpenApp}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Abrir
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-xs lg:max-w-md px-4 py-2 rounded-2xl
                ${message.sender === 'user'
                  ? 'bg-purple-700 text-white rounded-br-md'
                  : 'bg-dark-700 text-dark-100 rounded-bl-md'
                }
              `}
            >
              <p>{message.text}</p>
              <p className="text-xs mt-1 opacity-60">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Balão de opções para Instagram */}
        {app.hasWebVersion && (
          <div className="flex justify-center my-4">
            <div className="bg-dark-800 border border-purple-700/50 rounded-2xl p-4 shadow-xl">
              <p className="text-white font-medium mb-3 text-center">Como deseja acessar o {app.name}?</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadApp}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Baixar App
                </button>
                <button
                  onClick={handleOpenInBrowser}
                  className="flex-1 bg-dark-700 hover:bg-dark-600 text-white px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border border-dark-600"
                >
                  <Globe className="w-5 h-5" />
                  Navegador
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-dark-700 bg-dark-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-dark-700 text-white px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-dark-400"
          />
          <button
            onClick={handleSend}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}
