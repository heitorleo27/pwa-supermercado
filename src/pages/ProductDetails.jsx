import { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

export default function ProductDetails({ product, onBack, onEdit, onDelete, onMarkExpired }) {
  const [formMode, setFormMode] = useState(false);
  const [edited, setEdited] = useState(null);

  useEffect(() => {
    if (product) {
      setEdited({
        productId: product.productId,
        name: product.name || "",
        barcode: product.barcode || "",
        quantity: product.quantity || "",
        shelf: product.shelf || "",
        expirationDate: product.expirationDate || "",
        photo: product.photo || null,
      });
    }
  }, [product]);

  if (!product) {
    return (
      <div className="product-details-container">
        <button className="back-btn" onClick={onBack}>
          <FaArrowLeft /> Voltar
        </button>
        <p className="warning-text">
          Produto não encontrado. Talvez a página tenha sido recarregada.
        </p>
      </div>
    );
  }

  const handleSaveEdit = () => {
    onEdit({ ...edited });
    setFormMode(false);
  };

  const handleDelete = () => {
    const confirmation = window.confirm("Deseja realmente excluir este produto?");
    if (confirmation) onDelete(product.productId);
  };

  const handleMarkExpiredClick = () => {
    const confirmation = window.confirm("Marcar como vencido?");
    if (confirmation) onMarkExpired(product.productId);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setEdited(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="product-details-container">

      {/* Botão Voltar */}
      <button className="back-btn" onClick={onBack}>
        <FaArrowLeft /> Voltar
      </button>

      <h2 className="section-title">Detalhes do Produto</h2>

      {/* Foto */}
      <div className="photo-wrapper">
        {product.photo ? (
          <img src={product.photo} alt="Foto do produto" className="product-photo" />
        ) : (
          <div className="no-photo">Sem foto</div>
        )}
      </div>

      {/* Se estamos editando: */}
      {formMode && edited && (
        <div className="edit-form">

          <label className="form-label">Nome</label>
          <input
            type="text"
            name="name"
            className="form-input"
            value={edited.name}
            onChange={handleInput}
          />

          <label className="form-label">Código de Barras</label>
          <input
            type="text"
            name="barcode"
            className="form-input"
            value={edited.barcode}
            onChange={handleInput}
          />

          <label className="form-label">Quantidade</label>
          <input
            type="number"
            name="quantity"
            className="form-input"
            value={edited.quantity}
            onChange={handleInput}
          />

          <label className="form-label">Prateleira / Corredor</label>
          <input
            type="text"
            name="shelf"
            className="form-input"
            value={edited.shelf}
            onChange={handleInput}
          />

          <label className="form-label">Validade</label>
          <input
            type="date"
            name="expirationDate"
            className="form-input"
            value={edited.expirationDate}
            onChange={handleInput}
          />

          <button className="save-btn" onClick={handleSaveEdit}>Salvar Alterações</button>
          <button className="cancel-btn" onClick={() => setFormMode(false)}>Cancelar</button>
        </div>
      )}

      {/* Se NÃO estamos editando */}
      {!formMode && (
        <div className="info-panel">
          <p><strong>Nome:</strong> {product.name}</p>
          <p><strong>Código de Barras:</strong> {product.barcode}</p>
          <p><strong>Quantidade:</strong> {product.quantity}</p>
          <p><strong>Prateleira:</strong> {product.shelf}</p>

          <p>
            <strong>Validade:</strong>{" "}
            {product.expirationDate || "—"}
          </p>

          {product.isMarkedExpired && (
            <p className="expired-flag">
              <FaExclamationTriangle /> Produto marcado como vencido
            </p>
          )}

          <div className="action-buttons">

            <button className="edit-btn" onClick={() => setFormMode(true)}>
              <FaEdit /> Editar
            </button>

            {!product.isMarkedExpired && (
              <button className="expired-btn" onClick={handleMarkExpiredClick}>
                <FaExclamationTriangle /> Marcar Vencido
              </button>
            )}

            <button className="delete-btn" onClick={handleDelete}>
              <FaTrash /> Excluir
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
