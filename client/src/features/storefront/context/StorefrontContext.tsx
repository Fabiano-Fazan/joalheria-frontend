import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { BASE_URL } from '../config';
import type { CartItem, Product, StoreUser, StoreView } from '../types';
import { fetchCurrentUser } from '../services/auth';

type StorefrontContextValue = {
  currentView: StoreView;
  isMobileMenuOpen: boolean;
  cartItems: CartItem[];
  isApiOnline: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: StoreUser | null;
  editingProduct: Product | null;
  productSearchTerm: string;
  productCategory: string;
  inventorySearchTerm: string;
  orderSearchTerm: string;
  navigateTo: (view: StoreView) => void;
  editProduct: (product: Product) => void;
  searchProducts: (term: string) => void;
  searchInventory: (term: string) => void;
  searchOrders: (term: string) => void;
  browseCategory: (category: string) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  handleLogin: () => void;
  handleLogout: () => void;
  addToCart: (product: Product) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

export function StorefrontProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<StoreView>(() => {
    const path = location.substring(1) || 'home';
    return path as StoreView;
  });

  useEffect(() => {
    const path = location.substring(1) || 'home';
    if (path !== currentView) {
      setCurrentView(path as StoreView);
    }
  }, [location]);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('yara_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isApiOnline, setIsApiOnline] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<StoreUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [productCategory, setProductCategory] = useState('Todos');
  const [inventorySearchTerm, setInventorySearchTerm] = useState('');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('yara_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Verificando autenticação...');
        const data = await fetchCurrentUser();
        console.log('Dados recebidos do auth/me:', data);
        setIsApiOnline(true);

        if (data && data.authenticated) {
          setIsLoggedIn(true);
          setUser(data);
          setIsAdmin(data.role === 'ROLE_ADMIN');
        } else {
          setIsLoggedIn(false);
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsApiOnline(false);
      }
    };

    // Pequeno atraso para garantir que o cookie foi processado após o redirect
    const timeout = setTimeout(checkAuth, 500);
    return () => clearTimeout(timeout);
  }, []);

  const navigateTo = (view: StoreView) => {
    if (view !== 'edit_product') setEditingProduct(null);
    if (view === 'products') {
      setProductSearchTerm('');
      setProductCategory('Todos');
    }
    const path = view === 'home' ? '/' : `/${view}`;
    setLocation(path);
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const editProduct = (product: Product) => {
    setEditingProduct(product);
    setLocation('/edit_product');
    setCurrentView('edit_product');
    setIsMobileMenuOpen(false);
  };

  const searchProducts = (term: string) => {
    setProductSearchTerm(term.trim());
    setProductCategory('Todos');
    setEditingProduct(null);
    setLocation('/products');
    setCurrentView('products');
    setIsMobileMenuOpen(false);
  };

  const searchInventory = (term: string) => {
    setInventorySearchTerm(term.trim());
  };

  const searchOrders = (term: string) => {
    setOrderSearchTerm(term.trim());
  };

  const browseCategory = (category: string) => {
    setProductSearchTerm('');
    setProductCategory(category);
    setEditingProduct(null);
    setLocation('/products');
    setCurrentView('products');
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    window.location.href = `${BASE_URL}/oauth2/authorization/google`;
  };

  const handleLogout = () => {
    if (isApiOnline) {
      window.location.href = `${BASE_URL}/logout`;
      return;
    }

    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
    navigateTo('home');
  };

  const addToCart = (product: Product) => {
    if (product.inativo || product.stock <= 0) return;

    if (!isLoggedIn) {
      handleLogin();
      return;
    }

    setCartItems((previous) => {
      const existing = previous.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return previous;
        return previous.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...previous, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;
        const nextQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: Math.min(nextQuantity, item.stock) };
      }),
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((previous) => previous.filter((item) => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const value = useMemo(
    () => ({
      currentView,
      isMobileMenuOpen,
      cartItems,
      isApiOnline,
      isLoggedIn,
      isAdmin,
      user,
      editingProduct,
      productSearchTerm,
      productCategory,
      inventorySearchTerm,
      orderSearchTerm,
      navigateTo,
      editProduct,
      searchProducts,
      searchInventory,
      searchOrders,
      browseCategory,
      setIsMobileMenuOpen,
      handleLogin,
      handleLogout,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }),
    [currentView, isMobileMenuOpen, cartItems, isApiOnline, isLoggedIn, isAdmin, user, editingProduct, productSearchTerm, productCategory, inventorySearchTerm, orderSearchTerm],
  );

  return <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>;
}

export function useStorefront() {
  const context = useContext(StorefrontContext);
  if (!context) {
    throw new Error('useStorefront must be used inside StorefrontProvider');
  }

  return context;
}
