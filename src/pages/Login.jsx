import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Login({ onLoginSucesso }) {
  const [form, setForm] = useState({
    email: '',
    senha: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const [erros, setErros] = useState({
    email: '',
    senha: ''
  });

  const validar = () => {
    let ok = true;
    const novoErro = { email: '', senha: '' };

    if (!form.email.trim()) {
      novoErro.email = 'Digite seu e-mail.';
      ok = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      novoErro.email = 'E-mail inválido.';
      ok = false;
    }

    if (!form.senha.trim()) {
      novoErro.senha = 'Digite sua senha.';
      ok = false;
    } else if (form.senha.length < 4) {
      novoErro.senha = 'A senha deve ter pelo menos 4 caracteres.';
      ok = false;
    }

    setErros(novoErro);
    return ok;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validar()) return;

    const payload = {
      id: `u_${Date.now()}`,
      email: form.email,
      nome: form.email.split('@')[0],
      criadoEm: new Date().toISOString()
    };

    onLoginSucesso(payload);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="login-container">
      <h1 className="app-title">ShelfScan</h1>
      <p className="app-subtitle">Controle simples e rápido de estoque</p>

      <form className="login-form" onSubmit={handleSubmit}>

        {/* CAMPO EMAIL */}
        <label className="form-label">E-mail</label>
        <input
          type="email"
          name="email"
          className={`form-input ${erros.email ? 'input-error' : ''}`}
          value={form.email}
          onChange={handleInput}
          placeholder="exemplo@empresa.com"
        />
        {erros.email && <p className="error-text">{erros.email}</p>}

        {/* CAMPO SENHA */}
        <label className="form-label">Senha</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="senha"
            className={`form-input ${erros.senha ? 'input-error' : ''}`}
            value={form.senha}
            onChange={handleInput}
            placeholder="Digite sua senha"
          />
          <span
            className="password-toggle"
            onClick={() => setShowPassword(prev => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {erros.senha && <p className="error-text">{erros.senha}</p>}

        <button type="submit" className="login-btn">
          Entrar
        </button>
      </form>

      <p className="register-link">
        Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </div>
  );
}
