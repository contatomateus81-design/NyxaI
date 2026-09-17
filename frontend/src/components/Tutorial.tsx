import { useState } from 'react'

interface TutorialProps {
  onComplete: (geminiKey: string, openAiKey: string) => void
  onSkip?: () => void
}

const Tutorial = ({ onComplete, onSkip }: TutorialProps) => {
  const [step, setStep] = useState(1)
  const [geminiKey, setGeminiKey] = useState('')
  const [openAiKey, setOpenAiKey] = useState('')

  const totalSteps = 4

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      onComplete(geminiKey, openAiKey)
    }
  }

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo ao Nyx AI!</h2>
              <p className="text-gray-300">
                Vamos configurar seu assistente pessoal inteligente. 
                Em poucos passos, você terá acesso a uma IA poderosa que lembra das suas conversas 
                e realiza pesquisas complexas.
              </p>
            </div>
            <div className="bg-dark-800/50 rounded-lg p-4 border border-purple-500/20">
              <h3 className="text-purple-300 font-semibold mb-2">🎯 O que você vai ganhar:</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Conversas privadas e memorizadas
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Pesquisas complexas via OpenAI
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  Acesso a múltiplos aplicativos
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  GameHub integrado
                </li>
              </ul>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Configurar Google Gemini API</h2>
              <p className="text-gray-300 mb-4">
                O Gemini será usado para conversar com você e lembrar de todo o histórico 
                de forma privada. Siga os passos abaixo:
              </p>
            </div>
            
            <div className="bg-dark-800 rounded-lg p-4 border border-blue-500/20 space-y-3">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white font-bold">1</span>
                <p className="text-gray-300 text-sm">Acesse <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google AI Studio</a></p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white font-bold">2</span>
                <p className="text-gray-300 text-sm">Faça login com sua conta Google</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white font-bold">3</span>
                <p className="text-gray-300 text-sm">Clique em "Create API Key" ou "Criar chave de API"</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white font-bold">4</span>
                <p className="text-gray-300 text-sm">Copie a chave gerada</p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Cole sua API Key do Gemini aqui:
              </label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value.trim())}
                placeholder="SUA-API-KEY"
                className="w-full px-4 py-3 bg-dark-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              {geminiKey && (
                <p className="text-green-400 text-xs mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Chave detectada!
                </p>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Configurar OpenAI API</h2>
              <p className="text-gray-300 mb-4">
                A OpenAI será usada para realizar pesquisas mais complexas e obter 
                informações detalhadas sobre diversos temas.
              </p>
            </div>
            
            <div className="bg-dark-800 rounded-lg p-4 border border-green-500/20 space-y-3">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs text-white font-bold">1</span>
                <p className="text-gray-300 text-sm">Acesse <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">OpenAI Platform</a></p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs text-white font-bold">2</span>
                <p className="text-gray-300 text-sm">Faça login ou crie uma conta</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs text-white font-bold">3</span>
                <p className="text-gray-300 text-sm">Clique em "Create new secret key"</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs text-white font-bold">4</span>
                <p className="text-gray-300 text-sm">Copie a chave imediatamente (ela só aparece uma vez)</p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Cole sua API Key da OpenAI aqui:
              </label>
              <input
                type="password"
                value={openAiKey}
                onChange={(e) => setOpenAiKey(e.target.value.trim())}
                placeholder="sk-..."
                className="w-full px-4 py-3 bg-dark-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              {openAiKey && openAiKey.startsWith('sk-') && (
                <p className="text-green-400 text-xs mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Formato de chave válido!
                </p>
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Quase lá!</h2>
              <p className="text-gray-300 mb-4">
                Suas chaves de API foram configuradas. Elas serão armazenadas de forma 
                segura e usadas apenas para suas conversas.
              </p>
            </div>

            <div className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-lg p-4 border border-purple-500/30">
              <h3 className="text-purple-300 font-semibold mb-3 text-center">Resumo da Configuração:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-dark-700/50 rounded">
                  <span className="text-gray-300">Google Gemini:</span>
                  <span className="text-green-400 flex items-center">
                    {geminiKey ? '✓ Configurado' : '✗ Não configurado'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-dark-700/50 rounded">
                  <span className="text-gray-300">OpenAI:</span>
                  <span className="text-green-400 flex items-center">
                    {openAiKey ? '✓ Configurado' : '✗ Não configurado'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mt-4">
              <p className="text-yellow-300 text-xs text-center">
                ⚠️ <strong>Importante:</strong> Suas chaves de API são pessoais. 
                Nunca compartilhe com ninguém. O Nyx AI as usa apenas localmente.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-dark-900 via-purple-950 to-dark-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-purple-500/30 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-900/30 to-transparent p-4 border-b border-purple-500/20 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Configuração Inicial
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-purple-300">
                Passo {step} de {totalSteps}
              </span>
              <div className="w-24 h-2 bg-dark-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-t from-dark-900 to-transparent p-4 border-t border-purple-500/20 rounded-b-2xl">
          <div className="flex items-center justify-between space-x-3">
            {step > 1 ? (
              <button
                onClick={handlePrev}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                ← Voltar
              </button>
            ) : (
              <div />
            )}
            
            <div className="flex space-x-3">
              {step < totalSteps && (
                <button
                  onClick={onSkip}
                  className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors text-sm"
                >
                  Pular
                </button>
              )}
              
              <button
                onClick={handleNext}
                disabled={
                  (step === 2 && !geminiKey) || 
                  (step === 3 && !openAiKey) ||
                  (step === 4 && (!geminiKey || !openAiKey))
                }
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  (step === 2 && !geminiKey) || 
                  (step === 3 && !openAiKey) ||
                  (step === 4 && (!geminiKey || !openAiKey))
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-purple-500/25'
                }`}
              >
                {step === totalSteps ? 'Começar' : 'Próximo'} →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tutorial
