import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import './App.css';

/* Páginas */
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import StoreSelection from './pages/StoreSelection';
import ProductList from './pages/ProductList';
import AddProductDetails from './pages/AddProductDetails';
import AddProductOrMember from './pages/AddProductOrMember';
import ProductDetails from './pages/ProductDetails';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';

/*WRAPPER PARA PRODUCT DETAILS*/

function ProductDetailsWrapper({ user, products, onLogout, onBack, onEdit, onDelete }) {
  const { id } = useParams();
  const product = products.find(p => p.productId === id) || null;

  return (
    <div className="app-with-sidebar">
      <Sidebar user={user} onLogout={onLogout} onChangeStore={null} />
      <ProductDetails
        product={product}
        onBack={onBack}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}

/*APP ROUTER*/

function AppRouter() {
  const navigate = useNavigate();

  /*Persistência Local*/

  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('shelfscan_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [selectedStore, setSelectedStore] = useState(() => {
    try {
      const raw = localStorage.getItem('shelfscan_store');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [products, setProducts] = useState(() => {
    try {
      const raw = localStorage.getItem('shelfscan_products');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  /*Persistência automática*/

  useEffect(() => {
    localStorage.setItem('shelfscan_user', user ? JSON.stringify(user) : '');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('shelfscan_store', selectedStore ? JSON.stringify(selectedStore) : '');
  }, [selectedStore]);

  useEffect(() => {
    localStorage.setItem('shelfscan_products', JSON.stringify(products));
  }, [products]);

  /*Handlers*/

  const handleLoginSuccess = (userObj) => {
    setUser({ ...userObj });
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
    const newProduct = {
      productId: product.productId || `p_${Date.now()}`,
      createdAt: new Date().toISOString(),
      synced: false,
      ...product
    };

    setProducts(prev => [...prev, newProduct]);
    navigate('/home');
  };

  const handleDeleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.productId !== productId));
    navigate('/home');
  };

  const handleEditProduct = (updated) => {
    setProducts(prev =>
      prev.map(p =>
        p.productId === updated.productId
          ? { ...p, ...updated, updatedAt: new Date().toISOString() }
          : p
      )
    );
    navigate('/home');
  };

  /*Rota Protegida*/

  const RequireAuth = ({ children }) =>
    !user ? <Navigate to="/login" replace /> : children;

  const RequireStore = ({ children }) =>
    !selectedStore ? <Navigate to="/stores" replace /> : children;

  /*ROTAS*/

  return (
    <Routes>
      <Route path="/login" element={<Login onLoginSucesso={handleLoginSuccess} />} />
      <Route path="/cadastro" element={<Cadastro onCadastroSucesso={handleLoginSuccess} />} />

      <Route path="/stores" element={
        <RequireAuth>
          <StoreSelection onSelectLoja={handleSelectStore} />
        </RequireAuth>
      } />

      {/* Redirecionamento automático */}
      <Route path="/" element={
        <Navigate
          to={
            user
              ? selectedStore
                ? '/home'
                : '/stores'
              : '/login'
          }
          replace
        />
      } />

      {/* HOME */}
      <Route path="/home" element={
        <RequireAuth>
          <RequireStore>
            <div className="app-with-sidebar">
              <Sidebar
                user={user}
                onLogout={handleLogout}
                onChangeStore={() => navigate('/stores')}
              />
              <ProductList lojaSelecionada={selectedStore} products={products} />
            </div>
          </RequireStore>
        </RequireAuth>
      } />

      {/* DETALHES DO PRODUTO */}
      <Route path="/product/:id" element={
        <RequireAuth>
          <RequireStore>
            <ProductDetailsWrapper
              user={user}
              products={products}
              onLogout={handleLogout}
              onBack={() => navigate('/home')}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </RequireStore>
        </RequireAuth>
      } />

      {/* ADD PRODUCT */}
      <Route path="/add-product" element={
        <RequireAuth>
          <RequireStore>
            <AddProductDetails
              lojaSelecionada={selectedStore}
              onSalvar={handleAddProduct}
            />
          </RequireStore>
        </RequireAuth>
      } />

      {/* ADD MEMBER */}
      <Route path="/add-member" element={
        <RequireAuth>
          <RequireStore>
            <div className="app-with-sidebar">
              <Sidebar
                user={user}
                onLogout={handleLogout}
                onChangeStore={() => navigate('/stores')}
              />
              <AddProductOrMember store={selectedStore} />
            </div>
          </RequireStore>
        </RequireAuth>
      } />

      {/* SETTINGS */}
      <Route path="/settings" element={
        <RequireAuth>
          <div className="app-with-sidebar">
            <Sidebar
              user={user}
              onLogout={handleLogout}
              onChangeStore={() => navigate('/stores')}
            />
            <Settings />
          </div>
        </RequireAuth>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/*APP*/
export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
