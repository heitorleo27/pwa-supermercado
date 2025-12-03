import { useEffect, useState } from 'react';
import { FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import './ProductDetails.css';

export default function ProductDetails({ product, onBack, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState(null);

  // UTIL: dias até vencer
  const getDaysRemaining = (expiry) => {
    if (!expiry) return Infinity;
    const today = new Date();
    const target = new Date(expiry);
    return Math.floor((target - today) / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = getDaysRemaining(product?.expiryDate);

  // COR DO STATUS
  const getStatusColor = (days) => {
    if (days > 21) return 'green';
    if (days >= 11) return 'yellow';
    return 'red'; // inclui vencido
  };

  const statusColor = getStatusColor(daysRemaining);

  // Carrega dados atuais no formulário
  useEffect(() => {
    if (product) {
      setEdited({
        productId: product.productId,
        name: product.name || "",
        barcode: product.barcode || "",
        quantity: product.quantity || 1,
        shelf: product.shelf || "",
        expiryDate: product.expiryDate || "",
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
        <p>Produto não encontrado.</p>
      </div>
    );
  }

  // Salvar edição
  const handleSave = () => {
    onEdit({ ...edited });
    setIsEditing(false);
  };

  // Exclusão
  const handleDelete = () => {
    const ok = window.confirm("Deseja realmente excluir este produto?");
    if (ok) onDelete(product.productId);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setEdited((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="product-details-container">

      {/* VOLTAR */}
      <button className="back-btn" onClick={onBack}>
        <FaArrowLeft /> Voltar
      </button>

      <h2 className="section-title">Detalhes do Produto</h2>

      {/* FOTO */}
      <div className="photo-wrapper">
        {product.photo ? (
          <img src={product.photo} alt="Foto do produto" className="product-photo" />
        ) : (
          <div className="no-photo">Sem foto</div>
        )}
      </div>

      {/* FORMULÁRIO DE EDIÇÃO */}
      {isEditing && edited && (
        <div className="edit-form">

          <label className="form-label">Nome</label>
          <input
            type="text"
            name="name"
            value={edited.name}
            className="form-input"
            onChange={handleInput}
          />

          <label className="form-label">Código de Barras</label>
          <input
            type="text"
            name="barcode"
            value={edited.barcode}
            className="form-input"
            onChange={handleInput}
          />

          <label className="form-label">Quantidade</label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={edited.quantity}
            className="form-input"
            onChange={handleInput}
          />

          <label className="form-label">Prateleira / Corredor</label>
          <input
            type="text"
            name="shelf"
            value={edited.shelf}
            className="form-input"
            onChange={handleInput}
          />

          <label className="form-label">Validade</label>
          <input
            type="date"
            name="expiryDate"
            value={edited.expiryDate}
            className="form-input"
            onChange={handleInput}
          />

          <button className="save-btn" onClick={handleSave}>Salvar</button>
          <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancelar</button>
        </div>
      )}

      {/* VISUALIZAÇÃO */}
      {!isEditing && (
        <div className="info-panel">

          <p><strong>Nome:</strong> {product.name}</p>
          <p><strong>Código de Barras:</strong> {product.barcode || "—"}</p>
          <p><strong>Quantidade:</strong> {product.quantity}</p>
          <p><strong>Prateleira:</strong> {product.shelf || "—"}</p>

          <p>
            <strong>Validade:</strong> {product.expiryDate || "—"}{" "}
            <span className={`days-badge ${statusColor}`}>
              {Number.isFinite(daysRemaining)
                ? daysRemaining >= 0
                  ? `(${daysRemaining} dias)`
                  : `(Vencido há ${Math.abs(daysRemaining)} dias)`
                : ""}
            </span>
          </p>

          {/* BOTÕES */}
          <div className="action-buttons">
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <FaEdit /> Editar
            </button>

            <button className="delete-btn" onClick={handleDelete}>
              <FaTrash /> Excluir
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
