import { Gamepad2, ExternalLink } from 'lucide-react'

interface Game {
  name: string;
  packageName: string;
}

interface GameHubProps {
  games: Game[];
  isOpen: boolean;
  onClose: () => void;
  onLaunchGame: (packageName: string) => void;
}

export default function GameHub({ games, isOpen, onClose, onLaunchGame }: GameHubProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-dark-800 to-dark-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-6 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-lg">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">GameHub</h2>
                <p className="text-xs text-purple-300">{games.length} jogos instalados</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Lista de Jogos */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {games.length === 0 ? (
            <div className="text-center py-12">
              <Gamepad2 className="w-16 h-16 text-purple-500/30 mx-auto mb-4" />
              <p className="text-gray-400">Nenhum jogo encontrado</p>
              <p className="text-xs text-gray-500 mt-2">Instale alguns jogos para vê-los aqui</p>
            </div>
          ) : (
            <div className="space-y-2">
              {games.map((game, index) => (
                <button
                  key={game.packageName}
                  onClick={() => onLaunchGame(game.packageName)}
                  className="w-full group bg-gradient-to-r from-dark-700/50 to-dark-800/50 hover:from-purple-900/30 hover:to-pink-900/30 border border-purple-500/10 hover:border-purple-500/30 rounded-xl p-4 transition-all duration-200 flex items-center gap-4"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Ícone do jogo (placeholder) */}
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl flex items-center justify-center group-hover:from-purple-600/30 group-hover:to-pink-600/30 transition-all">
                    <Gamepad2 className="w-6 h-6 text-purple-400 group-hover:text-purple-300" />
                  </div>
                  
                  {/* Nome do jogo */}
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-white group-hover:text-purple-200 transition-colors truncate">
                      {game.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {game.packageName}
                    </p>
                  </div>
                  
                  {/* Ícone de abrir */}
                  <ExternalLink className="w-5 h-5 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-500/10 bg-dark-900/50">
          <p className="text-xs text-center text-gray-500">
            Toque em um jogo para abrir
          </p>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(17, 24, 39, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #7c3aed, #db2777);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #8b5cf6, #ec4899);
        }
      `}</style>
    </>
  )
}
