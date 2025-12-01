import React, { useEffect, useState } from 'react';
import './StoreSelection.css';
import { addStore, getStores } from '../db';

const StoreSelection = ({ onSelectLoja }) => {
  
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nomeNovaLoja, setNomeNovaLoja] = useState('');
  const [cidadeNovaLoja, setCidadeNovaLoja] = useState('');

  useEffect(() => {
    let mounted = true;

    async function carregar() {
      try {
        setLoading(true);
        const lista = await getStores();
        if (!mounted) return;
        
        setLojas(Array.isArray(lista) ? lista : []);
      } catch (err) {
        console.error('Erro ao carregar lojas:', err);
        setLojas([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    carregar();

    return () => { mounted = false; };
  }, []);

  const criarLoja = async () => {
    const nome = nomeNovaLoja?.trim();
    if (!nome) return;

    const novaLoja = {
      id: Date.now(), 
      nome,
      cidade: cidadeNovaLoja?.trim() || ''
    };

    try {
      await addStore(novaLoja);                 
      const listaAtualizada = await getStores(); 
      setLojas(Array.isArray(listaAtualizada) ? listaAtualizada : []);
      
      setNomeNovaLoja('');
      setCidadeNovaLoja('');
    } catch (err) {
      console.error('Erro ao criar loja:', err);
      
    }
  };

  const selecionarLoja = (loja) => {
    if (typeof onSelectLoja === 'function') onSelectLoja(loja);
  };

  return (
    <div className="store-selection-container">
      <h2>Selecione a loja</h2>

      {/* Lista / loading */}
      {loading ? (
        <p>Carregando lojas...</p>
      ) : (
        <>
          <ul className="lojas-lista">
            {lojas.length === 0 ? (
              <p className="nenhuma-loja">Nenhuma loja cadastrada.</p>
            ) : (
              lojas.map(loja => (
                <li key={loja.id} onClick={() => selecionarLoja(loja)} className="loja-item">
                  <div className="loja-nome">{loja.nome}</div>
                  {loja.cidade ? <div className="loja-cidade">- {loja.cidade}</div> : null}
                </li>
              ))
            )}
          </ul>
        </>
      )}

      {/* Form criação de loja */}
      <div className="criar-loja-form">
        <input
          type="text"
          placeholder="Nome da loja"
          value={nomeNovaLoja}
          onChange={e => setNomeNovaLoja(e.target.value)}
          aria-label="Nome da loja"
        />
        <input
          type="text"
          placeholder="Cidade/Bairro (opcional)"
          value={cidadeNovaLoja}
          onChange={e => setCidadeNovaLoja(e.target.value)}
          aria-label="Cidade/Bairro (opcional)"
        />
        <button onClick={criarLoja}>+ Adicionar loja</button>
      </div>
    </div>
  );
};

export default StoreSelection;
