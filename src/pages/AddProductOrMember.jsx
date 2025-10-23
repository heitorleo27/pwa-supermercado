import React, { useState } from 'react';
import './AddProductOrMember.css';

const AddProductOrMember = ({ products, onAddProduct, onAddMember }) => {
  const [hasProducts] = useState(products && products.length > 0);

  return (
    <div className="add-product-member-page">
      <h1 className="page-title">Painel da Loja</h1>
      {!hasProducts ? (
        <div className="highlight-buttons">
          <button className="cta-button add-product" onClick={onAddProduct}>
            + Adicionar produto
          </button>
          <button className="cta-button add-member" onClick={onAddMember}>
            + Adicionar colaborador
          </button>
        </div>
      ) : (
        <div className="fab-buttons">
          <button className="fab add-product" onClick={onAddProduct}>
            +
          </button>
          <button className="fab add-member" onClick={onAddMember}>
            👤
          </button>
        </div>
      )}

      <div className="products-list">
        {products && products.length > 0 ? (
          products
            .sort((a, b) => {
              const dateA = new Date(a.expiryDate);
              const dateB = new Date(b.expiryDate);
              if (dateA.getTime() !== dateB.getTime()) return dateA - dateB;
              return b.quantity - a.quantity;
            })
            .map((product) => {
              const today = new Date();
              const expiry = new Date(product.expiryDate);
              const daysRemaining = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
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
};

export default AddProductOrMember;
