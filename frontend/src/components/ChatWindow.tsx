import { useState } from 'react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'other'
  timestamp: Date
}

interface ChatWindowProps {
  appName: string
  appColor: string
}

export default function ChatWindow({ appName, appColor }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Olá! Bem-vindo ao ' + appName, sender: 'other', timestamp: new Date() },
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
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-dark-900">
      {/* Header */}
      <header 
        className="p-4 border-b border-dark-700 flex items-center gap-3"
        style={{ backgroundColor: appColor + '20' }}
      >
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: appColor }}
        >
          {appName.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-white">{appName}</h3>
          <p className="text-sm text-dark-400">Online</p>
        </div>
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
            className="flex-1 bg-dark-700 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-dark-400"
          />
          <button
            onClick={handleSend}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}
