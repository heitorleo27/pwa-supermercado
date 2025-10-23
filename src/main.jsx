import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Registrar o service worker com callbacks úteis
const updateSW = registerSW({
  onNeedRefresh() {
    // aqui podemos sugerir ao usuário recarregar para atualizar
    console.log('Nova versão disponível — chame update quando quiser.')
  },
  onOfflineReady() {
    console.log('Aplicativo pronto para uso offline.')
  }
})

// Render da aplicação
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App updateSW={updateSW} />
  </React.StrictMode>
)
