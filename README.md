# Multi-App Chat Interface

Aplicativo de chat multi-plataforma com interface escura e detalhes em roxo.

## 🚀 Funcionalidades

- **Tema Escuro**: Interface moderna com fundo escuro (#0f172a)
- **Janelas Roxas**: Mensagens do usuário em roxo (#7c3aed)
- **Menu Lateral**: Acesso rápido a 8 aplicativos:
  - Google
  - WhatsApp
  - WhatsApp Business
  - Instagram
  - YouTube
  - Tor
  - Brave
  - Opera GX
- **Responsivo**: Funciona em desktop e mobile
- **Cores Dinâmicas**: Header muda conforme o app selecionado

## 📁 Estrutura do Projeto

```
/
├── frontend/          # React + Vite + TypeScript + TailwindCSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── backend/           # Flask + Python
    ├── app.py
    ├── requirements.txt
    └── routes/
```

## 🔧 Instalação e Execução

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend rodará em `http://localhost:3002/`

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

pip install -r requirements.txt
python app.py
```

O backend rodará em `http://localhost:5000/`

## 🛠️ Tecnologias

**Frontend:**
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router DOM

**Backend:**
- Flask
- Python 3.x

## 📝 Comandos Úteis

### Frontend
- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Compila para produção
- `npm run preview` - Preview da build de produção

### Backend
- `python app.py` - Inicia servidor Flask

## 🎨 Personalização

As cores podem ser ajustadas em `frontend/tailwind.config.js`:

```js
colors: {
  dark: {
    700: '#1e293b',
    800: '#0f172a',
    900: '#020617',
  },
  purple: {
    600: '#9333ea',
    700: '#7e22ce',
  }
}
```

## 📄 Licença

Projeto privado - Todos os direitos reservados
