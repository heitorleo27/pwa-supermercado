import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { registerSW } from 'virtual:pwa-register'
import { HashRouter } from 'react-router-dom' 

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
    {/* APLICAÇÃO DA CORREÇÃO: Envolve o componente App com HashRouter */}
    <HashRouter>
      <App updateSW={updateSW} />
    </HashRouter>
  </React.StrictMode>
)