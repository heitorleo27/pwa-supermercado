import React from 'react';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiPlus, FiUsers, FiSettings, FiLogOut, FiRefreshCw } from 'react-icons/fi';

export default function Sidebar({ user, onLogout, onChangeStore }) {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="logo">ShelfScan</h2>
        <p className="user-email">{user?.email || 'Usuário'}</p>
      </div>

      <nav className="sidebar-nav">
        <button onClick={() => navigate('/home')} className="nav-btn"><FiHome /> Início</button>
        <button onClick={() => navigate('/add-product')} className="nav-btn"><FiPlus /> Adicionar Produto</button>
        <button onClick={() => navigate('/add-member')} className="nav-btn"><FiUsers /> Colaboradores</button>
        <button onClick={() => navigate('/settings')} className="nav-btn"><FiSettings /> Configurações</button>
      </nav>

      <div className="sidebar-footer">
        <button onClick={onChangeStore} className="footer-btn"><FiRefreshCw /> Trocar Loja</button>
        <button onClick={onLogout} className="footer-btn logout"><FiLogOut /> Sair</button>
      </div>
    </aside>
  );
}
