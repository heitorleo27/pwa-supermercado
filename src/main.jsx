import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { registerSW } from 'virtual:pwa-register'
// REMOVIDO: import { HashRouter } from 'react-router-dom' 

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('Nova versão disponível — chame update quando quiser.')
  },
  onOfflineReady() {
    console.log('Aplicativo pronto para uso offline.')
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* CORREÇÃO: Não há mais Router duplicado aqui. */}
    <App updateSW={updateSW} />
  </React.StrictMode>
)