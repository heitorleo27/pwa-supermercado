const OPEN_FOOD_FACTS_BASE_URL = "https://world.openfoodfacts.org/api/v0/product";

/**
 * Busca dados de um produto a partir de um código de barras usando a Open Food Facts API.
 * @param {string} barcode O código de barras (EAN/UPC).
 * @returns {object | null} Um objeto de produto formatado ou null se não for encontrado.
 */
export async function fetchProductByBarcode(barcode) {
  if (!barcode) return null;

  const url = `${OPEN_FOOD_FACTS_BASE_URL}/${barcode}.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`API Error: Status ${response.status} for barcode ${barcode}`);
      return null;
    }
    
    const data = await response.json();

    if (data.status === 1 && data.product) {
      const product = data.product;
      
      // Mapeia os dados da API para o formato de produto do seu app
      return {
        barcode: barcode,
        name: product.product_name_pt || product.product_name || 'Produto Desconhecido',
        description: product.generic_name_pt || product.generic_name || '',
        photo: product.image_url || product.image_small_url || null,
        // Campos como 'quantity', 'expiryDate' e 'storeId' NÃO vêm da API e devem ser preenchidos localmente.
      };
    }

    return null;
  } catch (error) {
    console.error("Erro na comunicação com a API Open Food Facts:", error);
    return null;
  }
}