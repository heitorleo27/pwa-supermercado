import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

/* Páginas */
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import StoreSelection from './pages/StoreSelection';
import ProductList from './pages/ProductList';
import AddProductDetails from './pages/AddProductDetails';
import AddProductOrMember from './pages/AddProductOrMember';
import ProductDetails from './pages/ProductDetails';
import Settings from './pages/Settings';   // placeholder
import Sidebar from './components/Sidebar'; // placeholder, se necessário

function AppRouter() {
  const navigate = useNavigate();

  // estado simples de autenticação e loja selecionada
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('shelfscan_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const [selectedStore, setSelectedStore] = useState(() => {
    try {
      const raw = localStorage.getItem('shelfscan_store');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const [products, setProducts] = useState(() => {
    try {
      const raw = localStorage.getItem('shelfscan_products');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('shelfscan_user', user ? JSON.stringify(user) : '');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('shelfscan_store', selectedStore ? JSON.stringify(selectedStore) : '');
  }, [selectedStore]);

  useEffect(() => {
    localStorage.setItem('shelfscan_products', JSON.stringify(products));
  }, [products]);

  // handlers
  const handleLoginSuccess = (payload) => {
    setUser({ ...payload });
    navigate('/stores', { replace: true });
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedStore(null);
    navigate('/login', { replace: true });
  };

  const handleSelectStore = (store) => {
    setSelectedStore(store);
    navigate('/home', { replace: true });
  };

  const handleAddProduct = (product) => {
    const p = {
      productId: product.productId || `p_${Date.now()}`,
      createdAt: new Date().toISOString(),
      synced: false,
      ...product
    };
    setProducts(prev => [...prev, p]);
    navigate('/home');
  };

  const handleDeleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.productId !== productId));
    navigate('/home');
  };

  const handleEditProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.productId === updatedProduct.productId ? { ...p, ...updatedProduct, updatedAt: new Date().toISOString() } : p));
    navigate('/home');
  };

  const handleMarkExpired = (productId) => {
    setProducts(prev => prev.map(p => p.productId === productId ? { ...p, isMarkedExpired: true } : p));
    navigate('/home');
  };

  // helpers de rota protegida
  const RequireAuth = ({ children }) => !user ? <Navigate to="/login" replace /> : children;
  const RequireStore = ({ children }) => !selectedStore ? <Navigate to="/stores" replace /> : children;

  return (
    <Routes>
      <Route path="/login" element={<Login onLoginSucesso={handleLoginSuccess} />} />
      <Route path="/cadastro" element={<Cadastro onCadastroSucesso={handleLoginSuccess} />} />

      <Route path="/stores" element={
        <RequireAuth>
          <StoreSelection onSelectLoja={handleSelectStore} />
        </RequireAuth>
      } />

      <Route path="/" element={<Navigate to={user ? (selectedStore ? '/home' : '/stores') : '/login'} replace />} />

      {/* Home / Painel da loja */}
      <Route path="/home" element={
        <RequireAuth>
          <RequireStore>
            <div className="app-with-sidebar">
              <Sidebar user={user} onLogout={handleLogout} onChangeStore={() => navigate('/stores')} />
              <ProductList lojaSelecionada={selectedStore} products={products} />
            </div>
          </RequireStore>
        </RequireAuth>
      } />

      {/* Product details (view/edit/delete) */}
      <Route path="/product/:id" element={
        <RequireAuth>
          <RequireStore>
            <div className="app-with-sidebar">
              <Sidebar user={user} onLogout={handleLogout} onChangeStore={() => navigate('/stores')} />
              <ProductDetails
                product={products.find(p => p.productId === (window.location.pathname.split('/product/')[1] || ''))}
                onBack={() => navigate('/home')}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onMarkExpired={handleMarkExpired}
              />
            </div>
          </RequireStore>
        </RequireAuth>
      } />

      {/* Add product (scanner/form) */}
      <Route path="/add-product" element={
        <RequireAuth>
          <RequireStore>
            <AddProductDetails lojaSelecionada={selectedStore} onSalvar={handleAddProduct} />
          </RequireStore>
        </RequireAuth>
      } />

      {/* Add collaborator / invite */}
      <Route path="/add-member" element={
        <RequireAuth>
          <RequireStore>
            <div className="app-with-sidebar">
              <Sidebar user={user} onLogout={handleLogout} onChangeStore={() => navigate('/stores')} />
              <AddProductOrMember store={selectedStore} />
            </div>
          </RequireStore>
        </RequireAuth>
      } />

      {/* Settings */}
      <Route path="/settings" element={
        <RequireAuth>
          <div className="app-with-sidebar">
            <Sidebar user={user} onLogout={handleLogout} onChangeStore={() => navigate('/stores')} />
            <Settings />
          </div>
        </RequireAuth>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
