import { openDB } from 'idb';

/* ABERTURA DO BANCO */
export const dbPromise = openDB('shelfscan-db', 1, {
  upgrade(db) {
    console.log('Criando / atualizando banco shelfscan-db');

    // Store de lojas
    if (!db.objectStoreNames.contains('stores')) {
      db.createObjectStore('stores', { keyPath: 'id' });
    }

    // Store de produtos
    if (!db.objectStoreNames.contains('products')) {
      const store = db.createObjectStore('products', { keyPath: 'productId' });
      store.createIndex('storeId', 'storeId', { unique: false });
    }
  }
});

/* FUNÇÕES — STORE (LOJAS) */

// Adiciona uma loja
export async function addStore(store) {
  const db = await dbPromise;
  await db.put('stores', store);
}

// Lista todas as lojas
export async function getStores() {
  const db = await dbPromise;
  return db.getAll('stores');
}

/* FUNÇÕES — PRODUCTS (PRODUTOS) */

// Adiciona produto
export async function addProduct(product) {
  const db = await dbPromise;
  await db.put('products', product);
}

// Lista produtos filtrando por loja
export async function getProductsByStore(storeId) {
  const db = await dbPromise;
  return db.getAllFromIndex('products', 'storeId', IDBKeyRange.only(storeId));
}

// Retorna um produto pelo ID
export async function getProductById(productId) {
  const db = await dbPromise;
  return db.get('products', productId);
}

// Atualiza um produto
export async function updateProduct(product) {
  const db = await dbPromise;
  await db.put('products', product);
}

// Remove um produto
export async function deleteProduct(productId) {
  const db = await dbPromise;
  await db.delete('products', productId);
}
