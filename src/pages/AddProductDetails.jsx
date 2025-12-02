import React, { useState, useEffect } from 'react';
import './AddProductDetails.css';
import { useNavigate } from 'react-router-dom';

let dbApi = null;
try {
  
  dbApi = require('../db');
} catch (e) {
  dbApi = null;
}

export default function AddProductDetails({ lojaSelecionada, onSalvar }) {
  const navigate = useNavigate();

  const [barcode, setBarcode] = useState('');
  const [nameFull, setNameFull] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [locationType, setLocationType] = useState('PRATELEIRA');
  const [locationDesc, setLocationDesc] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [erro, setErro] = useState('');

  // Atualiza visual da prévia da foto
  useEffect(() => {
    if (!photo) {
      setPhotoPreview(null);
      return;
    }
    const previewUrl = URL.createObjectURL(photo);
    setPhotoPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [photo]);

  // Valida campos
  const validarCampos = () => {
    if (!nameFull.trim()) return 'O nome do produto é obrigatório.';
    if (!quantity || Number(quantity) <= 0) return 'Quantidade deve ser maior que zero.';
    if (!expiryDate) return 'Data de validade é obrigatória.';
    

    return '';
  };

  // Salvar produto
  const handleSalvar = async () => {
    const msg = validarCampos();
    if (msg) {
      setErro(msg);
      return;
    }

    setErro('');

    const novoProduto = {
      productId: `p_${Date.now()}`,
      barcode: barcode.trim(),
      nameFull: nameFull.trim(),
      quantity: Number(quantity),
      locationType,
      locationDesc: locationType === 'OUTRO' ? locationDesc.trim() : '',
      expiryDate,
      photos: [], 
      storeId: lojaSelecionada?.id || null,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      synced: false,
    };

    // processar foto caso exista
    if (photo) {
      const blob = photo;
      const blobUrl = URL.createObjectURL(blob);

      novoProduto.photos.push({
        id: `ph_${Date.now()}`,
        blob,
        blobUrl,
        createdAt: new Date().toISOString(),
      });
    }

    // Persistência via db.js se disponível
    try {
      if (dbApi && typeof dbApi.addProduct === 'function') {
        await dbApi.addProduct(novoProduto);
      } else {
        // fallback para estado em App.jsx
        if (typeof onSalvar === 'function') {
          onSalvar(novoProduto);
        }
      }

      navigate('/home');
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      setErro('Erro ao salvar produto. Tente novamente.');
    }
  };

  // Cancelar
  const handleCancelar = () => {
    navigate('/home');
  };

  return (
    <div className="add-product-container">
      <h2>Adicionar Produto</h2>

      <form className="add-product-form" onSubmit={(e) => e.preventDefault()}>
        
        {/* Código de barras */}
        <label>
          Código de barras
          <input
            type="text"
            placeholder="Digite ou escaneie"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
          />
        </label>

        {/* Nome completo */}
        <label>
          Nome completo*
          <input
            type="text"
            placeholder="Nome do produto"
            value={nameFull}
            onChange={(e) => setNameFull(e.target.value)}
          />
        </label>

        {/* Quantidade */}
        <label>
          Quantidade*
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </label>

        {/* Localização */}
        <label>
          Localização*
          <select value={locationType} onChange={(e) => setLocationType(e.target.value)}>
            <option value="PRATELEIRA">Prateleira</option>
            <option value="ESTOQUE">Estoque</option>
            <option value="OUTRO">Outro</option>
          </select>
        </label>

        {/* Descrição da localização quando "OUTRO" */}
        {locationType === 'OUTRO' && (
          <label>
            Especifique
            <input
              type="text"
              placeholder="Ex: Depósito dos fundos"
              value={locationDesc}
              onChange={(e) => setLocationDesc(e.target.value)}
            />
          </label>
        )}

        {/* Validade */}
        <label>
          Data de validade*
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </label>

        {/* Foto (opcional) */}
        <label>
          Foto (opcional)
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0] || null)}
          />
        </label>

        {photoPreview && (
          <div className="photo-preview">
            <img src={photoPreview} alt="Prévia da foto" />
          </div>
        )}

        {erro && <p className="erro">{erro}</p>}

        <div className="btn-actions">
          <button type="button" onClick={handleSalvar} className="btn btn-salvar">
            Salvar
          </button>

          <button type="button" onClick={handleCancelar} className="btn btn-cancelar">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
