import React, { useState } from 'react';
import './Cadastro.css';

const Cadastro = ({ onCadastroSucesso }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validações
    if (!nome || !email || !senha || !confirmarSenha) {
      setErro('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (!email.includes('@')) {
      setErro('Digite um e-mail válido.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    setErro('');
    // Aqui salvaríamos o usuário localmente ou via API
    // Chama callback para login automático após cadastro
    onCadastroSucesso && onCadastroSucesso({ nome, email, telefone });
  };

  return (
    <div className="cadastro-container">
      <h2>Criar Conta</h2>
      <form onSubmit={handleSubmit} className="cadastro-form">
        <label>
          Nome completo*
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
        </label>
        <label>
          E-mail*
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Senha*
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        </label>
        <label>
          Confirmar senha*
          <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
        </label>
        <label>
          Telefone (opcional)
          <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        </label>
        {erro && <p className="erro">{erro}</p>}
        <button type="submit" className="btn-cadastro">Cadastrar</button>
      </form>
    </div>
  );
};

export default Cadastro;
