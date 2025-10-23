import React, { useState } from 'react';
import Cadastro from './Cadastro'; // Importa a tela de cadastro
import './Login.css';

const Login = ({ onLoginSucesso }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [exibirCadastro, setExibirCadastro] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    // Validações básicas
    if (!email || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }
    if (!email.includes('@')) {
      setErro('Digite um e-mail válido.');
      return;
    }

    setErro('');
    // Aqui seria a autenticação local ou via API
    onLoginSucesso && onLoginSucesso({ email });
  };

  if (exibirCadastro) {
    return <Cadastro onCadastroSucesso={onLoginSucesso} />;
  }

  return (
    <div className="login-container">
      <h2>Entrar</h2>
      <form onSubmit={handleLogin} className="login-form">
        <label>
          E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Senha
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        </label>
        {erro && <p className="erro">{erro}</p>}
        <button type="submit" className="btn-login">Entrar</button>
      </form>
      <p className="cadastro-link">
        Não tem conta? <span onClick={() => setExibirCadastro(true)}>Criar conta</span>
      </p>
    </div>
  );
};

export default Login;
