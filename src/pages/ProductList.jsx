import React, { useState } from 'react';
import './ProductList.css';

const ProductList = ({ lojaSelecionada }) => {
  const [produtos, setProdutos] = useState([]);
  
  const adicionarProduto = () => {
    // lógica para abrir AddProductDetails (scanner/form)
    alert('Abrir cadastro de produto');
  };

  const adicionarColaborador = () => {
    alert('Abrir cadastro de colaborador');
  };

  const estadoInicial = produtos.length === 0;

  return (
    <div className="product-list-container">
      <header>
        <h2>{lojaSelecionada.nome}</h2>
        <div className="acoes-header">
          <button onClick={adicionarColaborador} className="btn-colaborador">Adicionar colaborador</button>
        </div>
      </header>

      {estadoInicial ? (
        <div className="botoes-destaque">
          <button onClick={adicionarProduto} className="btn-principal">Adicionar produto</button>
          <button onClick={adicionarColaborador} className="btn-principal">Adicionar colaborador</button>
        </div>
      ) : (
        <>
          <button onClick={adicionarProduto} className="fab">+</button>
          <ul className="produtos-lista">
            {produtos.map(p => (
              <li key={p.id}>
                <span>{p.nameFull}</span>
                <span>Validade: {p.expiryDate}</span>
                <span>Qtd: {p.quantity}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ProductList;
