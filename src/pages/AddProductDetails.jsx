import { useState, useEffect, useRef, useCallback } from "react";
import { FaCamera, FaArrowLeft, FaSpinner } from "react-icons/fa";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from 'react-router-dom';

// Importa a função de busca da API (Assumindo que api.js existe na pasta src)
import { fetchProductByBarcode } from '../api'; 
import './AddProductDetails.css';

// COMPONENTE PRINCIPAL
export default function AddProductDetails({ lojaSelecionada, onSalvar }) {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: "",
    barcode: "",
    quantity: "",
    shelf: "",
    expiryDate: "",
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [loadingApi, setLoadingApi] = useState(false);
  const [apiError, setApiError] = useState(null);

  const scannerRef = useRef(null);
  const scannerRunning = useRef(false);
  
  const SCANNER_ID = "scanner-view";
  
  // HANDLERS E UTILIDADES

  // Atualiza campos
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Upload da foto
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setForm((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };
  
  // Função para parar o scanner de forma segura
  const stopScanner = () => {
    if (scannerRef.current && scannerRunning.current) {
      scannerRef.current.stop().catch(() => {});
      scannerRunning.current = false;
    }
  };

  // INTEGRAÇÃO COM API

  const searchProductData = useCallback(async (barcode) => {
    if (!barcode) return;
    setApiError(null);
    setLoadingApi(true);

    const apiData = await fetchProductByBarcode(barcode);

    setLoadingApi(false);

    if (apiData) {
      setForm((prev) => ({
        ...prev,
        name: apiData.name,
        photo: apiData.photo || prev.photo, 
      }));
      setPhotoPreview(apiData.photo || null);
      setApiError(null);
    } else {
      setApiError("Produto não encontrado na base de dados externa. Preencha manualmente.");
    }
  }, []);
  
  // Monitora o campo Barcode. Se ele mudar (via input ou scanner), aciona a busca da API.
  useEffect(() => {
      // Pequeno timeout para evitar chamada API a cada caractere digitado
      if (form.barcode && form.barcode.length > 7) { 
          const timeoutId = setTimeout(() => searchProductData(form.barcode), 500);
          return () => clearTimeout(timeoutId);
      }
  }, [form.barcode, searchProductData]);

  // CÂMERA / SCANNER (Aprimorado)

  const onScanSuccess = (decodedText) => {
    // 1. Para o scanner
    stopScanner(); 
    
    // 2. Atualiza o código de barras no formulário (o useEffect fará a busca API)
    setForm((prev) => ({ ...prev, barcode: decodedText }));
  };

  useEffect(() => {
    const startScanner = async () => {
      if (scannerRunning.current) return;

      const html5QrCode = new Html5Qrcode(SCANNER_ID);
      scannerRef.current = html5QrCode;

      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 230, height: 100 },
            disableFlip: false,
          },
          onScanSuccess,
          () => {}
        );
        scannerRunning.current = true;
      } catch (err) {
        console.warn("Scanner não iniciou: Permissão negada ou câmera em uso.", err);
      }
    };

    startScanner();
    return stopScanner;
  }, []);

  // SALVAR PRODUTO
  
  const handleSave = () => {
    if (!form.name.trim()) {
      alert("O produto precisa ter um nome.");
      return;
    }
    if (!form.quantity || form.quantity <= 0) {
      alert("Informe a quantidade válida.");
      return;
    }

    const payload = {
      ...form,
      productId: `p_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      synced: false,
      storeId: lojaSelecionada?.id || lojaSelecionada?.storeId || null,
      quantity: Number(form.quantity), 
    };

    onSalvar(payload);
  };

  // RENDERIZAÇÃO  
  return (
    <div className="add-product-container">

      {/* Voltar */}
      <button className="back-btn" onClick={() => navigate('/home')}>
        <FaArrowLeft /> Voltar para a Lista
      </button>

      <h2 className="section-title">Adicionar Produto na Loja: {lojaSelecionada?.nome}</h2>
      
      {/* Alerta de erro da API */}
      {apiError && <div className="error-box">{apiError}</div>}
      
      {/* SCANNER */}
      <div className="scanner-wrapper">
        <div id={SCANNER_ID} className="scanner-view"></div>
        <p className="scanner-tip">
          {scannerRunning.current 
            ? "Aponte a câmera para o código de barras (EAN)"
            : "Scanner inativo. Insira o código abaixo."}
        </p>
      </div>

      {/* Foto */}
      <div className="photo-upload-block">
        {photoPreview ? (
          <img src={photoPreview} alt="Preview" className="product-photo" />
        ) : (
          <div className="no-photo-preview">Sem foto</div>
        )}

        <label className="photo-btn" htmlFor="photo-input">
          <FaCamera /> Adicionar Foto
          <input 
            type="file" 
            accept="image/*" 
            onChange={handlePhoto} 
            id="photo-input" 
            hidden 
          />
        </label>
      </div>

      {/* Campos */}
      <label className="form-label">Nome do Produto</label>
      <input
        type="text"
        name="name"
        className="form-input"
        value={form.name}
        onChange={handleInput}
        placeholder={loadingApi ? "Buscando dados..." : "Nome do produto (Obrigatório)"}
        disabled={loadingApi}
      />

      <label className="form-label">Código de Barras</label>
      <div className="input-group">
        <input
          type="text"
          name="barcode"
          className="form-input"
          value={form.barcode}
          onChange={handleInput}
          placeholder="Código EAN/UPC"
          disabled={loadingApi}
        />
        {loadingApi && <FaSpinner className="loading-icon" />} 
      </div>
      
      {/* Campos Adicionais */}
      <div className="form-row">
        <div className="form-col">
          <label className="form-label">Quantidade</label>
          <input
            type="number"
            name="quantity"
            className="form-input"
            value={form.quantity}
            onChange={handleInput}
            min="1"
            required
          />
        </div>
        <div className="form-col">
          <label className="form-label">Validade</label>
          <input
            type="date"
            name="expiryDate"
            className="form-input"
            value={form.expiryDate}
            onChange={handleInput}
            required
          />
        </div>
      </div>
      
      <label className="form-label">Prateleira / Corredor (Localização)</label>
      <input
        type="text"
        name="shelf"
        className="form-input"
        value={form.shelf}
        onChange={handleInput}
        placeholder="A1, Corredor 5, Geladeira"
      />


      {/* Salvar */}
      <button className="save-btn" onClick={handleSave} disabled={loadingApi || !form.name.trim() || !form.quantity}>
        {loadingApi ? 'Buscando...' : 'Salvar Produto'}
      </button>
    </div>
  );
}