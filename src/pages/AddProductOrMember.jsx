import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddProductOrMember.css';

export default function AddProductOrMember({
  store,
  products = [],
  onAddProduct,
  onAddMember
}) {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    if (onAddProduct) {
      onAddProduct();
      return;
    }
    navigate('/add-product');
  };

  const handleAddMember = () => {
    if (onAddMember) {
      onAddMember();
      return;
    }
    navigate('/add-member'); 
  };

  /*Ordenação dos produtos*/
  const sortedProducts = [...products].sort((a, b) => {
    const dateA = new Date(a.expiryDate);
    const dateB = new Date(b.expiryDate);

    if (dateA.getTime() !== dateB.getTime()) return dateA - dateB;
    return b.quantity - a.quantity;
  });

  const hasProducts = sortedProducts.length > 0;

  return (
    <div className="add-product-member-page">
      <h1 className="page-title">
        {store?.nome ? `Painel da Loja: ${store.nome}` : 'Painel da Loja'}
      </h1>

      {/* BOTÕES PRINCIPAIS — quando não há produtos */}
      {!hasProducts ? (
        <div className="highlight-buttons">
          <button className="cta-button add-product" onClick={handleAddProduct}>
            + Adicionar produto
          </button>

          <button className="cta-button add-member" onClick={handleAddMember}>
            + Adicionar colaborador
          </button>
        </div>
      ) : (
        /* BOTÕES FLOTANTES — quando já existem produtos */
        <div className="fab-buttons">
          <button className="fab add-product" onClick={handleAddProduct}>
            +
          </button>

          <button className="fab add-member" onClick={handleAddMember}>
            👤
          </button>
        </div>
      )}

      {/* LISTA DE PRODUTOS */}
      <div className="products-list">
        {hasProducts ? (
          sortedProducts.map(product => {
            const today = new Date();
            const expiry = new Date(product.expiryDate);
            const daysRemaining = Math.floor(
              (expiry - today) / (1000 * 60 * 60 * 24)
            );

            let statusColor = '';
            if (daysRemaining > 21) statusColor = 'green';
            else if (daysRemaining >= 11) statusColor = 'yellow';
            else statusColor = 'red';

            return (
              <div key={product.productId} className="product-item">
                <img
                  src={product.photoUrl || '/placeholder.png'}
                  alt={product.nameFull}
                  className="product-thumb"
                />

                <div className="product-info">
                  <p className="product-name">{product.nameFull}</p>
                  <p className="product-expiry">
                    Validade: {product.expiryDate} ({daysRemaining} dias)
                  </p>
                </div>

                <div className={`status-badge ${statusColor}`}></div>

                <div className="product-quantity">{product.quantity}</div>
              </div>
            );
          })
        ) : (
          <p className="empty-text">Nenhum produto cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}
