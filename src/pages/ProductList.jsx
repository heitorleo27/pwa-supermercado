import React, { useEffect, useState } from 'react';
import './ProductList.css';
import { useNavigate } from 'react-router-dom';

let dbApi = null;
try {
  dbApi = require('../db'); // carrega db.js
} catch (e) {
  dbApi = null;
}

export default function ProductList({ lojaSelecionada }) {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL | NEXT7 | EXPIRED
  const [error, setError] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // -----------------------
  // UTIL: dias até vencer
  // -----------------------
  const getDaysRemaining = (expiry) => {
    if (!expiry) return Infinity;
    const today = new Date();
    const dt = new Date(expiry);
    return Math.floor((dt - today) / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (days) => {
    if (days > 21) return 'green';
    if (days >= 11) return 'yellow';
    return 'red'; // inclui vencidos
  };

  // -----------------------
  // CARREGAR PRODUTOS
  // -----------------------
  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        if (dbApi && typeof dbApi.getProductsByStore === 'function') {
          const arr = await dbApi.getProductsByStore(lojaSelecionada.id);
          if (mounted) setProdutos(arr || []);
        } else {
          setProdutos([]);
        }
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar produtos.");
        setProdutos([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (lojaSelecionada?.id) load();

    return () => { mounted = false; };
  }, [lojaSelecionada]);

  // -----------------------
  // FILTRAR E ORDENAR
  // -----------------------
  const getVisibleProducts = () => {
    const q = query.toLowerCase().trim();

    let list = produtos.filter(p => {
      const match =
        p.name?.toLowerCase().includes(q) ||
        p.barcode?.toString().toLowerCase().includes(q);

      if (!match) return false;

      const days = getDaysRemaining(p.expiryDate);

      if (filter === 'NEXT7') return days <= 7 && days >= 0;
      if (filter === 'EXPIRED') return days < 0;

      return true;
    });

    // ordenar por validade -> quantidade
    list.sort((a, b) => {
      const da = new Date(a.expiryDate).getTime() || Infinity;
      const db = new Date(b.expiryDate).getTime() || Infinity;
      if (da !== db) return da - db;
      return (b.quantity || 0) - (a.quantity || 0);
    });

    return list;
  };

  const visible = getVisibleProducts();

  // -----------------------
  // NAVIGATE
  // -----------------------
  const handleAddProduct = () => {
    navigate('/add-product');
  };

  const openDetails = (id) => {
    navigate(`/product/${id}`);
  };

  // -----------------------
  // DELETE
  // -----------------------
  const confirmDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const doDelete = async () => {
    const id = confirmDeleteId;
    if (!id) return;

    setConfirmDeleteId(null);
    try {
      if (dbApi && typeof dbApi.deleteProduct === 'function') {
        await dbApi.deleteProduct(id);
      }
      setProdutos(prev => prev.filter(p => p.productId !== id));
    } catch (err) {
      console.error(err);
      setError("Erro ao excluir produto.");
    }
  };

  // -----------------------
  // RENDER
  // -----------------------
  return (
    <div className="product-list-container">

      <header className="list-header">
        <h2>{lojaSelecionada?.nome || "Loja"}</h2>
        <p className="city">{lojaSelecionada?.cidade || ""}</p>

        <div className="search-area">
          <input
            type="search"
            placeholder="Buscar por nome ou código"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="ALL">Todos</option>
            <option value="NEXT7">Próximos a vencer (≤7 dias)</option>
            <option value="EXPIRED">Vencidos</option>
          </select>

          <button className="add-button" onClick={handleAddProduct}>
            + Adicionar produto
          </button>
        </div>
      </header>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <main>
          {error && <div className="error-box">{error}</div>}

          {visible.length === 0 ? (
            <div className="empty-box">
              <p>Nenhum produto encontrado.</p>
              <button onClick={handleAddProduct} className="add-button">
                Adicionar primeiro produto
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {visible.map((p) => {
                const days = getDaysRemaining(p.expiryDate);
                const color = getStatusColor(days);
                const thumb =
                  p.photo ||
                  (p.photos?.[0]?.blobUrl) ||
                  "/placeholder.png";

                return (
                  <div key={p.productId} className="product-card">

                    <img
                      src={thumb}
                      alt={p.name}
                      className="product-thumb"
                      onClick={() => openDetails(p.productId)}
                    />

                    <div className="product-info">
                      <h3 className="p-name" onClick={() => openDetails(p.productId)}>
                        {p.name}
                      </h3>

                      <p className="p-expiry">
                        Validade: {p.expiryDate || "—"}{" "}
                        <span className={`exp-badge ${color}`}>
                          {Number.isFinite(days)
                            ? days >= 0
                              ? `${days} dias`
                              : `Vencido (${Math.abs(days)} dias)`
                            : ""}
                        </span>
                      </p>

                      <p className="p-qty">Qtd: {p.quantity}</p>

                      <button
                        className="delete-btn"
                        onClick={() => confirmDelete(p.productId)}
                      >
                        Excluir
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* CONFIRMAÇÃO DE EXCLUSÃO */}
      {confirmDeleteId && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>Deseja realmente excluir este produto?</p>
            <div className="confirm-actions">
              <button onClick={() => setConfirmDeleteId(null)}>Cancelar</button>
              <button className="danger" onClick={doDelete}>Excluir</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
