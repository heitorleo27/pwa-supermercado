import React from 'react';
import './App.css';
import InstallPrompt from './components/InstallPrompt';

function App() {
  return (
    <div className="app-container">
      <InstallPrompt />

      <div className="login-container">
        <h1>PWA Supermercado</h1>
        <p>Bem-vindo ao aplicativo de supermercado feito com Vite + React!</p>
        <p>Experimente instalar este app para usá-lo como aplicativo nativo.</p>

        <form className="login-form">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Senha" required />
          <button type="submit">Entrar</button>
        </form>

        <div className="register-section">
          <p>Não tem conta?</p>
          <button className="register-btn">Cadastrar</button>
        </div>

        <footer>
          <p>© 2025 Supermercado PWA. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
