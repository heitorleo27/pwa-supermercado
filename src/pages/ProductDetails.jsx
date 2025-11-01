import React, { useState } from 'react';
import './ProductDetails.css';

/**
 * Props:
 * - product: objeto com os campos do modelo (productId, nameFull, barcode, quantity, expiryDate, locationType, locationDesc, photos (array), notes, storeId)
 * - onBack(): função para voltar à lista
 * - onEdit(product): abrir edição (pode reutilizar AddProductDetails com dados)
 * - onDelete(productId): função para excluir (deve confirmar antes)
 * - onMarkExpired(productId): marca como vencido (incrementa estatística local)
 */
export default function ProductDetails({ product, onBack, onEdit, onDelete, onMarkExpired }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!product) {
    return (
      <div className="product-details empty">
        <p>Produto não encontrado.</p>
        <button onClick={onBack} className="btn">Voltar</button>
      </div>
    );
  }

  const today = new Date();
  const expiry = new Date(product.expiryDate);
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.floor((expiry - today) / msPerDay);

  const status = (() => {
    if (daysRemaining > 21) return 'green';
    if (daysRemaining >= 11) return 'yellow';
    return 'red';
  })();

  const primaryPhoto = (product.photos && product.photos.length > 0 && product.photos[0].blobUrl) ? product.photos[0].blobUrl : '/placeholder.png';

  return (
    <div className="product-details">
      <div className="topbar">
        <button className="back-btn" onClick={onBack}>← Voltar</button>
        <div className="top-actions">
          <button className="btn edit" onClick={() => onEdit && onEdit(product)}>Editar</button>
          <button className="btn delete" onClick={() => setConfirmDelete(true)}>Excluir</button>
        </div>
      </div>

      <div className="details-card">
        <div className="photo-col">
          <img src={primaryPhoto} alt={product.nameFull} className="product-photo" />
        </div>

        <div className="info-col">
          <h2 className="product-title">{product.nameFull}</h2>
          <p className="meta"><strong>Código:</strong> {product.barcode || 'Sem código'}</p>
          <p className="meta"><strong>Loja:</strong> {product.storeName || product.storeId}</p>
          <p className="meta"><strong>Local:</strong> {product.locationType === 'OUTRO' ? product.locationDesc : product.locationType}</p>

          <div className="row">
            <div className={`status ${status}`}>
              <span className="dot" /> {daysRemaining} dias
            </div>
            <div className="quantity">Qtd: <strong>{product.quantity}</strong></div>
          </div>

          <p className="validade"><strong>Validade:</strong> {product.expiryDate}</p>

          {product.notes && (
            <div className="notes">
              <h4>Observações</h4>
              <p>{product.notes}</p>
            </div>
          )}

          <div className="actions">
            <button className="btn mark-expired" onClick={() => onMarkExpired && onMarkExpired(product.productId)}>
              Marcar como vencido
            </button>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>Tem certeza que deseja excluir este produto? Esta ação é irreversível.</p>
            <div className="confirm-actions">
              <button className="btn cancel" onClick={() => setConfirmDelete(false)}>Cancelar</button>
              <button className="btn confirm" onClick={() => { setConfirmDelete(false); onDelete && onDelete(product.productId); }}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
