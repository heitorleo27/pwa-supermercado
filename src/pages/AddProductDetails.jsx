import { useState } from "react";
import { FaCamera, FaArrowLeft } from "react-icons/fa";

export default function AddProductDetails({ lojaSelecionada, onSalvar }) {
  const [form, setForm] = useState({
    name: "",
    barcode: "",
    quantity: "",
    shelf: "",
    expiryDate: "",
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);

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

  // Salvar produto
  const handleSave = () => {
    if (!form.name.trim()) {
      alert("O produto precisa ter um nome.");
      return;
    }
    if (!form.quantity) {
      alert("Informe a quantidade.");
      return;
    }

    const payload = {
      ...form,
      productId: `p_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      synced: false,
      storeId: lojaSelecionada?.id || lojaSelecionada?.storeId || null,
    };

    onSalvar(payload);
  };

  return (
    <div className="add-product-container">

      {/* Voltar */}
      <button className="back-btn" onClick={() => window.history.back()}>
        <FaArrowLeft /> Voltar
      </button>

      <h2 className="section-title">Adicionar Produto</h2>

      {/* Foto */}
      <div className="photo-upload-block">
        {photoPreview ? (
          <img src={photoPreview} alt="Preview" className="product-photo" />
        ) : (
          <div className="no-photo-preview">Sem foto</div>
        )}

        <label className="photo-btn">
          <FaCamera /> Adicionar Foto
          <input type="file" accept="image/*" onChange={handlePhoto} hidden />
        </label>
      </div>

      {/* Campos */}
      <label className="form-label">Nome</label>
      <input
        type="text"
        name="name"
        className="form-input"
        value={form.name}
        onChange={handleInput}
      />

      <label className="form-label">Código de Barras</label>
      <input
        type="text"
        name="barcode"
        className="form-input"
        value={form.barcode}
        onChange={handleInput}
      />

      <label className="form-label">Quantidade</label>
      <input
        type="number"
        name="quantity"
        className="form-input"
        value={form.quantity}
        onChange={handleInput}
      />

      <label className="form-label">Prateleira / Corredor</label>
      <input
        type="text"
        name="shelf"
        className="form-input"
        value={form.shelf}
        onChange={handleInput}
      />

      <label className="form-label">Validade</label>
      <input
        type="date"
        name="expiryDate"
        className="form-input"
        value={form.expiryDate}
        onChange={handleInput}
      />

      {/* Salvar */}
      <button className="save-btn" onClick={handleSave}>
        Salvar Produto
      </button>
    </div>
  );
}
