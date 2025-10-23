import React from "react";
import InstallPrompt from "./components/InstallPrompt";

function App() {
  return (
    <div className="app-container">
      <InstallPrompt />

      <header className="header">
        <h1>PWA Supermercado</h1>
      </header>

      <main className="content">
        <p>Bem-vindo ao aplicativo de supermercado feito com Vite + React!</p>
        <p>Experimente instalar este app para usá-lo como aplicativo nativo.</p>
      </main>

      <footer className="footer">
        <small>© 2025 Supermercado PWA. Todos os direitos reservados.</small>
      </footer>
    </div>
  );
}

export default App;
