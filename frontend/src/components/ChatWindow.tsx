import { useState } from 'react'
import { ExternalLink, Download, Globe, Bot, Send } from 'lucide-react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'other' | 'ai'
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
    { id: 1, text: `Olá! Bem-vindo ao ${app.name}. Como posso ajudar você hoje?`, sender: 'ai', timestamp: new Date() },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Função para chamar a API da IA Qwen
  const callQwenAI = async (userMessage: string): Promise<string> => {
    try {
      // Em produção, substitua pela URL real da sua API
      const response = await fetch('https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_HUGGINGFACE_TOKEN', // Substitua pelo seu token
        },
        body: JSON.stringify({
          inputs: `Você é um assistente prestativo e amigável integrado ao app ${app.name}. Responda de forma concisa e útil. Usuário disse: "${userMessage}"`,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7,
            return_full_text: false,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Erro na API')
      }

      const data = await response.json()
      return data[0]?.generated_text || `Desculpe, não entendi. Pode reformular?`
    } catch (error) {
      console.error('Erro ao chamar IA:', error)
      return `Estou aqui para ajudar você com o ${app.name}! 😊`
    }
  }

  const handleSend = async () => {
    if (inputValue.trim()) {
      const userMessage: Message = {
        id: messages.length + 1,
        text: inputValue,
        sender: 'user',
        timestamp: new Date(),
      }
      setMessages([...messages, userMessage])
      setInputValue('')
      setIsTyping(true)
      
      // Chama a IA Qwen para responder
      setTimeout(async () => {
        const aiResponse = await callQwenAI(inputValue)
        const response: Message = {
          id: messages.length + 2,
          text: aiResponse,
          sender: 'ai',
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, response])
        setIsTyping(false)
      }, 500)
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
    <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-purple-950 via-dark-900 to-black">
      {/* Header */}
      <header 
        className="p-4 border-b border-dark-700 flex items-center justify-between bg-gradient-to-r from-purple-900/30 to-transparent"
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
            <p className="text-sm text-purple-300">Toque para abrir o app</p>
          </div>
        </div>
        
        {/* Botão de ação */}
        <button
          onClick={onOpenApp}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 shadow-lg"
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
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-md'
                  : message.sender === 'ai'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-bl-md border border-purple-400/30'
                  : 'bg-dark-700 text-dark-100 rounded-bl-md'
                }
              `}
            >
              <div className="flex items-start gap-2">
                {message.sender === 'ai' && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                <div>
                  <p>{message.text}</p>
                  <p className="text-xs mt-1 opacity-60">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Indicador de digitação */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-purple-400/30 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Balão de opções para Instagram */}
        {app.hasWebVersion && (
          <div className="flex justify-center my-4">
            <div className="bg-gradient-to-br from-dark-800 to-dark-900 border border-purple-700/50 rounded-2xl p-4 shadow-xl">
              <p className="text-white font-medium mb-3 text-center">Como deseja acessar o {app.name}?</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadApp}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg"
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
      <div className="p-4 border-t border-dark-700 bg-gradient-to-r from-dark-800 to-dark-900">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-dark-700 text-white px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-dark-400 border border-dark-600"
          />
          <button
            onClick={handleSend}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}
