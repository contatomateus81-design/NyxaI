import { useState, useEffect } from 'react'
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
  geminiApiKey: string
  openAiApiKey: string
  onOpenApp: () => void
}

export default function ChatWindow({ app, geminiApiKey, openAiApiKey, onOpenApp }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Inicializar com mensagem de boas-vindas quando o app mudar
  useEffect(() => {
    setMessages([
      { id: 1, text: `Olá! Bem-vindo ao ${app.name}. Como posso ajudar você hoje?`, sender: 'ai', timestamp: new Date() },
    ])
  }, [app.id])

  // Função para chamar a API do Google Gemini
  const callGeminiAI = async (userMessage: string, conversationHistory: Message[]): Promise<string> => {
    if (!geminiApiKey) {
      return "⚠️ API Key do Gemini não configurada. Por favor, complete o tutorial inicial."
    }

    try {
      // Construir histórico da conversa
      const conversationContext = conversationHistory
        .filter(m => m.sender === 'user' || m.sender === 'ai')
        .slice(-10) // Últimas 10 mensagens para contexto
        .map(m => `${m.sender === 'user' ? 'user' : 'model'}: ${m.text}`)
        .join('\n')

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Você é um assistente prestativo e amigável integrado ao app ${app.name}. 
                Mantenha conversas naturais e lembre-se do contexto anterior.
                
                Histórico da conversa:
                ${conversationContext}
                
                Usuário disse: "${userMessage}"
                
                Responda de forma concisa, útil e em português.`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 256,
            }
          }),
        }
      )

      const data = await response.json()
      
      if (!response.ok) {
        const errorMsg = data.error?.message || 'Erro desconhecido na API do Gemini'
        throw new Error(errorMsg)
      }

      return data.candidates?.[0]?.content?.parts?.[0]?.text || `Desculpe, não entendi. Pode reformular?`
    } catch (error: any) {
      console.error('Erro ao chamar Gemini:', error)
      return `❌ Erro no Gemini: ${error.message || 'Verifique sua API Key e conexão.'}`
    }
  }

  // Função para chamar a API da OpenAI para pesquisas complexas
  const callOpenAI = async (query: string): Promise<string> => {
    if (!openAiApiKey) {
      return "⚠️ API Key da OpenAI não configurada. Por favor, complete o tutorial inicial."
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Você é um assistente especializado em pesquisas complexas integrado ao app ${app.name}. 
              Forneça informações detalhadas, precisas e bem estruturadas em português.`
            },
            {
              role: 'user',
              content: query
            }
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        const errorMsg = data.error?.message || 'Erro desconhecido na API da OpenAI'
        throw new Error(errorMsg)
      }

      return data.choices?.[0]?.message?.content || `Não consegui realizar a pesquisa. Tente novamente.`
    } catch (error: any) {
      console.error('Erro ao chamar OpenAI:', error)
      return `❌ Erro na OpenAI: ${error.message || 'Verifique sua API Key e conexão.'}`
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
      
      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)
      setInputValue('')
      setIsTyping(true)
      
      // Detectar se é uma pesquisa complexa (palavras-chave)
      const isComplexQuery = /pesquise|pesquisar|busque|buscar|investigue|investigar|análise|analisar|explique|detalhes|informações sobre/i.test(inputValue)
      
      setTimeout(async () => {
        let aiResponse: string
        
        if (isComplexQuery && openAiApiKey) {
          // Usar OpenAI para pesquisas complexas
          aiResponse = await callOpenAI(inputValue)
        } else {
          // Usar Gemini para conversas normais com memória
          aiResponse = await callGeminiAI(inputValue, updatedMessages)
        }
        
        const response: Message = {
          id: updatedMessages.length + 1,
          text: aiResponse,
          sender: 'ai',
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, response])
        setIsTyping(false)
      }, 800)
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
            placeholder="Digite sua mensagem... (use 'pesquise' para buscas complexas)"
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
