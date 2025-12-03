const DB_NAME = "shelfscan-db";
const DB_VERSION = 1;

// ABRIR BANCO
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Tabela de lojas
      if (!db.objectStoreNames.contains("stores")) {
        const storeOS = db.createObjectStore("stores", { keyPath: "id" });
        storeOS.createIndex("id", "id", { unique: true });
      }

      // Tabela de produtos
      if (!db.objectStoreNames.contains("products")) {
        const prodOS = db.createObjectStore("products", { keyPath: "productId" });
        prodOS.createIndex("storeId", "storeId");
        prodOS.createIndex("barcode", "barcode");
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = (err) => reject(err);
  });
}

// HELPERS
function txStore(db, storeName, mode = "readonly") {
  return db.transaction(storeName, mode).objectStore(storeName);
}

// STORES

export async function addStore(store) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const os = txStore(db, "stores", "readwrite");
    const req = os.put(store);
    req.onsuccess = () => resolve(true);
    req.onerror = (err) => reject(err);
  });
}

export async function getStores() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const os = txStore(db, "stores");
    const req = os.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = (err) => reject(err);
  });
}

// PRODUCTS

// Adicionar produto
export async function addProduct(product) {
  const db = await openDB();

  const finalProduct = {
    productId: product.productId || `p_${Date.now()}_${Math.random()}`,
    storeId: product.storeId,
    name: product.name || "",
    barcode: product.barcode || "",
    quantity: Number(product.quantity || 1),
    shelf: product.shelf || "",
    expiryDate: product.expiryDate || null,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    photo: product.photo || null,
    ...product
  };

  return new Promise((resolve, reject) => {
    const os = txStore(db, "products", "readwrite");
    const req = os.put(finalProduct);
    req.onsuccess = () => resolve(finalProduct);
    req.onerror = (err) => reject(err);
  });
}

// Buscar produtos por loja
export async function getProductsByStore(storeId) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const os = txStore(db, "products");
    const index = os.index("storeId");
    const req = index.getAll(storeId);

    req.onsuccess = () => resolve(req.result || []);
    req.onerror = (err) => reject(err);
  });
}

// Buscar produto por ID
export async function getProductById(productId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const os = txStore(db, "products");
    const req = os.get(productId);

    req.onsuccess = () => resolve(req.result || null);
    req.onerror = (err) => reject(err);
  });
}

// Atualizar produto
export async function updateProduct(updatedProduct) {
  const db = await openDB();

  const final = {
    ...updatedProduct,
    updatedAt: new Date().toISOString()
  };

  return new Promise((resolve, reject) => {
    const os = txStore(db, "products", "readwrite");
    const req = os.put(final);
    req.onsuccess = () => resolve(final);
    req.onerror = (err) => reject(err);
  });
}

// Apagar produto
export async function deleteProduct(productId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const os = txStore(db, "products", "readwrite");
    const req = os.delete(productId);
    req.onsuccess = () => resolve(true);
    req.onerror = (err) => reject(err);
  });
}

//EXPORT DEFAULT

export default {
  addStore,
  getStores,
  addProduct,
  getProductsByStore,
  getProductById,
  updateProduct,
  deleteProduct
};
