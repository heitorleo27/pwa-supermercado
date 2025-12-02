import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Cadastro({ onCadastroSucesso }) {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmaSenha: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [erros, setErros] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmaSenha: ''
  });

  const validar = () => {
    let ok = true;
    const novoErro = { nome: '', email: '', senha: '', confirmaSenha: '' };

    if (!form.nome.trim()) {
      novoErro.nome = 'Digite seu nome.';
      ok = false;
    }

    if (!form.email.trim()) {
      novoErro.email = 'Digite seu e-mail.';
      ok = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      novoErro.email = 'E-mail inválido.';
      ok = false;
    }

    if (!form.senha.trim()) {
      novoErro.senha = 'Digite uma senha.';
      ok = false;
    } else if (form.senha.length < 4) {
      novoErro.senha = 'A senha deve ter pelo menos 4 caracteres.';
      ok = false;
    }

    if (form.confirmaSenha !== form.senha) {
      novoErro.confirmaSenha = 'As senhas não coincidem.';
      ok = false;
    }

    setErros(novoErro);
    return ok;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const novoUsuario = {
      id: `u_${Date.now()}`,
      nome: form.nome.trim(),
      email: form.email.trim(),
      criadoEm: new Date().toISOString()
    };

    onCadastroSucesso(novoUsuario);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="cadastro-container">
      <h1 className="app-title">Criar Conta</h1>
      <p className="app-subtitle">Cadastre-se para começar a usar o ShelfScan</p>

      <form className="cadastro-form" onSubmit={handleSubmit}>

        {/* Nome */}
        <label className="form-label">Nome</label>
        <input
          type="text"
          name="nome"
          className={`form-input ${erros.nome ? 'input-error' : ''}`}
          value={form.nome}
          onChange={handleInput}
          placeholder="Seu nome completo"
        />
        {erros.nome && <p className="error-text">{erros.nome}</p>}

        {/* E-mail */}
        <label className="form-label">E-mail</label>
        <input
          type="email"
          name="email"
          className={`form-input ${erros.email ? 'input-error' : ''}`}
          value={form.email}
          onChange={handleInput}
          placeholder="email@exemplo.com"
        />
        {erros.email && <p className="error-text">{erros.email}</p>}

        {/* Senha */}
        <label className="form-label">Senha</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="senha"
            className={`form-input ${erros.senha ? 'input-error' : ''}`}
            value={form.senha}
            onChange={handleInput}
            placeholder="Crie uma senha"
          />
          <span
            className="password-toggle"
            onClick={() => setShowPassword(prev => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {erros.senha && <p className="error-text">{erros.senha}</p>}

        {/* Confirmar senha */}
        <label className="form-label">Confirmar Senha</label>
        <div className="password-wrapper">
          <input
            type={showPassword2 ? "text" : "password"}
            name="confirmaSenha"
            className={`form-input ${erros.confirmaSenha ? 'input-error' : ''}`}
            value={form.confirmaSenha}
            onChange={handleInput}
            placeholder="Repita sua senha"
          />
          <span
            className="password-toggle"
            onClick={() => setShowPassword2(prev => !prev)}
          >
            {showPassword2 ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {erros.confirmaSenha && <p className="error-text">{erros.confirmaSenha}</p>}

        <button className="cadastro-btn" type="submit">
          Criar Conta
        </button>
      </form>

      <p className="login-link">
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  );
}
