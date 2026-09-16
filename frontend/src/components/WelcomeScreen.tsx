import { useState, useEffect } from 'react'

interface WelcomeScreenProps {
  onGetStarted: () => void
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const [greeting, setGreeting] = useState('')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    
    let greetingMessage = ''
    if (hour >= 5 && hour < 12) {
      greetingMessage = 'Bom dia! ☀️ Que seu dia seja tão brilhante quanto você!'
    } else if (hour >= 12 && hour < 18) {
      greetingMessage = 'Boa tarde! 🌤️ Aproveite o resto do seu dia!'
    } else if (hour >= 18 && hour < 23) {
      greetingMessage = 'Boa noite! 🌙 Relax e aproveite sua noite!'
    } else {
      greetingMessage = 'Olá! 🌟 Espero que esteja bem a qualquer hora!'
    }
    
    setGreeting(greetingMessage)
    setUserName('Amigo(a)')
  }, [])

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-dark-900 via-purple-900/20 to-dark-900">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo/Nome do App */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            NyxaI
          </h1>
          <p className="text-dark-400 text-lg">Seu assistente inteligente</p>
        </div>

        {/* Mensagem Fofa */}
        <div className="bg-dark-800/50 backdrop-blur-sm border border-purple-700/30 rounded-2xl p-6 shadow-xl shadow-purple-900/20">
          <div className="text-6xl mb-4">💜</div>
          <p className="text-xl text-purple-200 font-medium leading-relaxed">
            {greeting || 'Carregando...'}
          </p>
          <p className="text-dark-400 mt-3">
            Bem-vindo(a), <span className="text-purple-400 font-semibold">{userName}</span>!
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="bg-dark-800/30 rounded-xl p-4 border border-dark-700">
            <div className="text-2xl mb-2">🚀</div>
            <h3 className="text-white font-semibold mb-1">Rápido</h3>
            <p className="text-dark-400 text-sm">Acesso instantâneo aos seus apps favoritos</p>
          </div>
          <div className="bg-dark-800/30 rounded-xl p-4 border border-dark-700">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="text-white font-semibold mb-1">Seguro</h3>
            <p className="text-dark-400 text-sm">Navegação privada e protegida</p>
          </div>
          <div className="bg-dark-800/30 rounded-xl p-4 border border-dark-700">
            <div className="text-2xl mb-2">🎨</div>
            <h3 className="text-white font-semibold mb-1">Personalizável</h3>
            <p className="text-dark-400 text-sm">Interface do seu jeito</p>
          </div>
          <div className="bg-dark-800/30 rounded-xl p-4 border border-dark-700">
            <div className="text-2xl mb-2">💬</div>
            <h3 className="text-white font-semibold mb-1">Inteligente</h3>
            <p className="text-dark-400 text-sm">Assistente sempre disponível</p>
          </div>
        </div>

        {/* Botão Começar */}
        <button
          onClick={onGetStarted}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg shadow-purple-900/50 transition-all duration-300 transform hover:scale-105"
        >
          Começar Agora ✨
        </button>

        {/* Dica */}
        <p className="text-dark-500 text-sm">
          Selecione um app no menu lateral para começar
        </p>
      </div>
    </div>
  )
}
