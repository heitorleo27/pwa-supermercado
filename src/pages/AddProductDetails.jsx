import React, { useState } from 'react';
import './AddProductDetails.css';

const AddProductDetails = ({ lojaSelecionada, onSalvar }) => {
  const [barcode, setBarcode] = useState('');
  const [nameFull, setNameFull] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [locationType, setLocationType] = useState('PRATELEIRA');
  const [locationDesc, setLocationDesc] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [photo, setPhoto] = useState(null);
  const [erro, setErro] = useState('');

  const handleSalvar = () => {
    if (!nameFull || !quantity || !expiryDate || !photo) {
      setErro('Preencha todos os campos obrigatórios e carregue uma foto.');
      return;
    }
    setErro('');
    onSalvar({
      barcode,
      nameFull,
      quantity,
      locationType,
      locationDesc: locationType === 'OUTRO' ? locationDesc : '',
      expiryDate,
      photo,
      storeId: lojaSelecionada.id
    });
  };

  return (
    <div className="add-product-container">
      <h2>Adicionar Produto</h2>
      <form>
        <label>
          Código de barras
          <input type="text" value={barcode} onChange={e => setBarcode(e.target.value)} />
        </label>
        <label>
          Nome completo
          <input type="text" value={nameFull} onChange={e => setNameFull(e.target.value)} />
        </label>
        <label>
          Quantidade
          <input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
        </label>
        <label>
          Localização
          <select value={locationType} onChange={e => setLocationType(e.target.value)}>
            <option value="PRATELEIRA">Prateleira</option>
            <option value="ESTOQUE">Estoque</option>
            <option value="OUTRO">Outro</option>
          </select>
        </label>
        {locationType === 'OUTRO' && (
          <label>
            Especifique
            <input type="text" value={locationDesc} onChange={e => setLocationDesc(e.target.value)} />
          </label>
        )}
        <label>
          Validade
          <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
        </label>
        <label>
          Foto (obrigatória)
          <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} />
        </label>
        {erro && <p className="erro">{erro}</p>}
        <button type="button" onClick={handleSalvar}>Salvar</button>
      </form>
    </div>
  );
};

export default AddProductDetails;
