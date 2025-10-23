import React, { useState } from 'react';
import './StoreSelection.css';

const StoreSelection = ({ onSelectLoja }) => {
  const [lojas, setLojas] = useState([
    // exemplo inicial, pode ser carregado do IndexedDB
    { id: 1, nome: 'Loja Exemplo', cidade: 'Centro' }
  ]);
  const [nomeNovaLoja, setNomeNovaLoja] = useState('');
  const [cidadeNovaLoja, setCidadeNovaLoja] = useState('');

  const criarLoja = () => {
    if (!nomeNovaLoja.trim()) return;
    const novaLoja = { id: Date.now(), nome: nomeNovaLoja, cidade: cidadeNovaLoja };
    setLojas([...lojas, novaLoja]);
    setNomeNovaLoja('');
    setCidadeNovaLoja('');
  };

  return (
    <div className="store-selection-container">
      <h2>Selecione a loja</h2>
      <ul className="lojas-lista">
        {lojas.map(loja => (
          <li key={loja.id} onClick={() => onSelectLoja(loja)}>
            {loja.nome} {loja.cidade && `- ${loja.cidade}`}
          </li>
        ))}
      </ul>
      <div className="criar-loja-form">
        <input
          type="text"
          placeholder="Nome da loja"
          value={nomeNovaLoja}
          onChange={e => setNomeNovaLoja(e.target.value)}
        />
        <input
          type="text"
          placeholder="Cidade/Bairro (opcional)"
          value={cidadeNovaLoja}
          onChange={e => setCidadeNovaLoja(e.target.value)}
        />
        <button onClick={criarLoja}>+ Adicionar loja</button>
      </div>
    </div>
  );
};

export default StoreSelection;
