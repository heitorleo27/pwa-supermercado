import React, { useEffect, useState } from 'react';
import './ProductList.css';
import { useNavigate } from 'react-router-dom';

let dbApi = null;
try {
  dbApi = require('../db');
} catch (err) {
  dbApi = null;
}

export default function ProductList({ lojaSelecionada, products: productsProp = [] }) {
  const navigate = useNavigate();

  // Estados principais
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [editingId, setEditingId] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [error, setError] = useState(null);

  // Helpers
  const daysRemaining = (expiryDateStr) => {
    if (!expiryDateStr) return Infinity;
    const today = new Date();
    const expiry = new Date(expiryDateStr);
    const diff = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const statusColor = (expiryDateStr) => {
    const days = daysRemaining(expiryDateStr);
    if (days > 21) return 'green';
    if (days >= 11) return 'yellow';
    return 'red';
  };

  // Carregar produtos
  useEffect(() => {
    let mounted = true;

    async function carregar() {
      setLoading(true);
      setError(null);

      try {
        if (
          dbApi &&
          typeof dbApi.getProductsByStore === 'function' &&
          lojaSelecionada &&
          lojaSelecionada.id != null
        ) {
          const arr = await dbApi.getProductsByStore(lojaSelecionada.id);
          if (!mounted) return;
          setProdutos(Array.isArray(arr) ? arr : []);
        } else if (productsProp && Array.isArray(productsProp)) {
          setProdutos(productsProp);
        } else {
          setProdutos([]);
        }
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
        setError('Erro ao carregar produtos.');
        setProdutos([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    carregar();

    return () => {
      mounted = false;
    };
  }, [lojaSelecionada, productsProp]);

  // Filtragem + ordenação
  const getVisibleProducts = () => {
    const q = (query || '').trim().toLowerCase();

    const filtered = produtos.filter((p) => {
      const matchQuery =
        !q ||
        (p.nameFull && p.nameFull.toLowerCase().includes(q)) ||
        (p.barcode && p.barcode.toString().toLowerCase().includes(q));

      if (!matchQuery) return false;

      const days = daysRemaining(p.expiryDate);

      if (filter === 'NEXT7') return days <= 7 && days >= 0;
      if (filter === 'EXPIRED') return days < 0;

      return true;
    });

    filtered.sort((a, b) => {
      const aDate = a.expiryDate ? new Date(a.expiryDate).getTime() : Infinity;
      const bDate = b.expiryDate ? new Date(b.expiryDate).getTime() : Infinity;

      if (aDate !== bDate) return aDate - bDate;

      const aq = Number(a.quantity || 0);
      const bq = Number(b.quantity || 0);

      return bq - aq;
    });

    return filtered;
  };

  // Navegação
  const handleAddProduct = () => {
    navigate('/add-product');
  };

  const handleOpenDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Edição inline de quantidade
  const startEditQuantity = (product) => {
    setEditingId(product.productId);
    setEditingQuantity(product.quantity || 1);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingQuantity(1);
  };

  const saveEditQuantity = async () => {
    if (!editingId) return;

    const updatedArr = produtos.map((p) =>
      p.productId === editingId
        ? { ...p, quantity: Number(editingQuantity), updatedAt: new Date().toISOString() }
        : p
    );

    setProdutos(updatedArr);
    setEditingId(null);

    try {
      if (dbApi && typeof dbApi.updateProduct === 'function') {
        const old = await dbApi.getProductById(editingId);
        if (old) {
          await dbApi.updateProduct({
            ...old,
            quantity: Number(editingQuantity),
            updatedAt: new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      console.error('Erro ao atualizar quantidade no DB:', err);
      setError('Erro ao salvar quantidade.');
    }
  };

  // Exclusão
  const confirmDelete = (productId) => {
    setConfirmDeleteId(productId);
  };

  const doDelete = async () => {
    const id = confirmDeleteId;
    setConfirmDeleteId(null);

    if (!id) return;

    try {
      setProdutos((prev) => prev.filter((p) => p.productId !== id));

      if (dbApi && typeof dbApi.deleteProduct === 'function') {
        await dbApi.deleteProduct(id);
      }
    } catch (err) {
      console.error('Erro ao deletar produto:', err);
      setError('Erro ao deletar produto.');
    }
  };

  // Render item
  const renderProductItem = (product) => {
    const days = daysRemaining(product.expiryDate);
    const color = statusColor(product.expiryDate);

    const thumb =
      product.photoUrl ||
      (product.photos && product.photos[0] && product.photos[0].blobUrl) ||
      '/placeholder.png';

    return (
      <div key={product.productId} className="product-item">
        <img src={thumb} alt={product.nameFull} className="product-thumb" />

        <div className="product-info">
          <p className="product-name" onClick={() => handleOpenDetails(product.productId)}>
            {product.nameFull}
          </p>
          <p className="product-expiry">
            Validade: {product.expiryDate || '—'} (
            {Number.isFinite(days) ? `${days} dias` : '—'})
          </p>
        </div>

        <div className={`status-badge ${color}`}></div>

        <div className="product-quantity">
          {editingId === product.productId ? (
            <div className="quantity-editor">
              <input
                type="number"
                min="0"
                value={editingQuantity}
                onChange={(e) => setEditingQuantity(Number(e.target.value))}
              />
              <button onClick={saveEditQuantity} className="btn-save-qty">Salvar</button>
              <button onClick={cancelEdit} className="btn-cancel-qty">Cancelar</button>
            </div>
          ) : (
            <>
              <div className="qty-text">Qtd: {product.quantity}</div>
              <div className="qty-actions">
                <button onClick={() => startEditQuantity(product)} className="btn-edit-qty">✎</button>
                <button onClick={() => confirmDelete(product.productId)} className="btn-delete">🗑</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Produtos visíveis
  const visible = getVisibleProducts();

  // RETURN
  return (
    <div className="product-list-container">
      <header className="product-list-header">
        <div className="title-block">
          <h2>{lojaSelecionada ? lojaSelecionada.nome : 'Loja não selecionada'}</h2>
          {lojaSelecionada?.cidade && <div className="meta">{lojaSelecionada.cidade}</div>}
        </div>

        <div className="header-actions">
          <div className="search-filter">
            <input
              type="search"
              placeholder="Buscar por nome ou código..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="ALL">Todos</option>
              <option value="NEXT7">Próximos (≤7 dias)</option>
              <option value="EXPIRED">Vencidos</option>
            </select>
          </div>

          <div className="action-buttons">
            <button onClick={handleAddProduct} className="btn-add">+ Adicionar produto</button>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="loading">Carregando produtos...</div>
      ) : (
        <main className="product-list-main">
          {error && <div className="error">{error}</div>}

          {visible.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum produto encontrado.</p>
              <button onClick={handleAddProduct} className="btn-add">
                Adicionar primeiro produto
              </button>
            </div>
          ) : (
            <div className="products-grid">{visible.map(renderProductItem)}</div>
          )}
        </main>
      )}

      {confirmDeleteId && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>Tem certeza que deseja excluir este produto?</p>
            <div className="confirm-actions">
              <button className="btn cancel" onClick={() => setConfirmDeleteId(null)}>
                Cancelar
              </button>
              <button className="btn confirm" onClick={doDelete}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
