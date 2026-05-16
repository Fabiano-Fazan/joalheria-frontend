import { FormEvent, useEffect, useRef, useState } from 'react';
import { Archive, ChevronDown, ClipboardList, LayoutDashboard, LogOut, MapPin, Menu, PackagePlus, Search, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { colors } from '../../theme';
import { useStorefront } from '../../context/StorefrontContext';
import { BrandLogo } from './BrandLogo';
import type { StoreView } from '../../types';

type PrimaryLink = {
  label: string;
  view?: StoreView;
  category?: string;
  scrollToHighlights?: boolean;
};

export function Header() {
  const {
    currentView,
    cartItems,
    isLoggedIn,
    isAdmin,
    user,
    navigateTo,
    searchProducts,
    searchInventory,
    searchOrders,
    browseCategory,
    setIsMobileMenuOpen,
    handleLogin,
    handleLogout,
    productSearchTerm,
    inventorySearchTerm,
    orderSearchTerm,
  } = useStorefront();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const isOrderView = currentView === 'orders' || currentView === 'my_orders';
  const isProductSearchView = currentView === 'home' || currentView === 'products' || currentView === 'dashboard' || currentView === 'add_product' || currentView === 'my_account';
  const showSearch = isProductSearchView || currentView === 'inventory' || isOrderView;
  const searchPlaceholder = currentView === 'inventory'
    ? 'Buscar produto no estoque...'
    : isOrderView
      ? 'Buscar pedido...'
      : 'Buscar semijoias, coleções e presentes...';

  useEffect(() => {
    if (currentView === 'inventory') {
      setSearchTerm(inventorySearchTerm);
      return;
    }

    if (isOrderView) {
      setSearchTerm(orderSearchTerm);
      return;
    }

    setSearchTerm(productSearchTerm);
  }, [currentView, inventorySearchTerm, isOrderView, orderSearchTerm, productSearchTerm]);

  useEffect(() => {
    if (!isAccountMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAccountMenuOpen]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentView === 'inventory') {
      searchInventory(searchTerm);
      return;
    }

    if (isOrderView) {
      searchOrders(searchTerm);
      return;
    }

    searchProducts(searchTerm);
  };

  const scrollToHighlights = () => {
    navigateTo('home');
    window.setTimeout(() => {
      document.getElementById('destaques-da-semana')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handlePrimaryLinkClick = (link: PrimaryLink) => {
    if (link.scrollToHighlights) {
      scrollToHighlights();
      return;
    }

    if (link.category) {
      browseCategory(link.category);
      return;
    }

    if (link.view) navigateTo(link.view);
  };

  const primaryLinks: PrimaryLink[] = [
    { label: 'Coleções', view: 'products' },
    { label: 'Destaques', scrollToHighlights: true },
    { label: 'Colares', category: 'Colares' },
    { label: 'Brincos', category: 'Brincos' },
    { label: 'Anéis', category: 'Anéis' },
    { label: 'Pulseiras', category: 'Pulseiras' },
    { label: 'Outros', category: 'Outros' },
  ];

  const adminLinks = [
    { label: 'Dashboard', view: 'dashboard' as const, icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Cadastro de Produtos', view: 'add_product' as const, icon: <PackagePlus className="h-4 w-4" /> },
    { label: 'Controle de Estoque', view: 'inventory' as const, icon: <Archive className="h-4 w-4" /> },
    { label: 'Pedidos Realizados', view: 'orders' as const, icon: <ClipboardList className="h-4 w-4" /> },
  ];

  const handleAccountNavigation = (view: StoreView) => {
    navigateTo(view);
    setIsAccountMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 w-full bg-white/96 backdrop-blur-md border-b ${colors.borderLight} px-3 py-2.5 sm:p-4 lg:px-6 lg:py-3 lg:min-h-[112px] flex flex-col gap-2.5 lg:gap-3 z-40 shadow-[0_8px_24px_rgba(31,36,40,0.05)] transition-[background-color,border-color,box-shadow] duration-300`}>
      <div className="flex justify-between lg:hidden items-center max-w-6xl mx-auto w-full">
        <button onClick={() => setIsMobileMenuOpen(true)} className="mobile-touch-pop flex lg:hidden items-center gap-2 sm:gap-3 hover:opacity-70 transition-[transform,opacity] active:scale-95 group">
          <div className={`w-10 h-10 rounded-full border ${colors.borderLight} flex items-center justify-center bg-[#FAF8F4] transition-[box-shadow,transform,background-color] duration-300 active:bg-[#F1ECE3]`}>
            <Menu className={`w-5 h-5 ${colors.textNavy} transition-transform duration-300`} />
          </div>
          <span className={`hidden lg:block text-sm font-medium ${colors.textNavy}`}>Menu</span>
        </button>

        <button className="flex lg:hidden items-center gap-2 cursor-pointer active:scale-95 transition-transform duration-300" onClick={() => navigateTo('home')}>
          <BrandLogo className="w-11 h-9" />
          <div className={`flex flex-col ${colors.textGold} font-serif leading-[0.95]`}>
            <span className="text-[18px]">Yara Souza</span>
            <span className="text-[13px] tracking-[0.16em] uppercase font-sans text-[#1F2428]">Semijoias</span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {!isLoggedIn ? (
            <button onClick={handleLogin} className={`hidden sm:flex px-6 py-2 rounded-full border ${colors.borderGold} ${colors.textGoldDark} text-sm font-medium hover:bg-[#F2E8D5] transition-colors`}>
              Entrar
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-2 mr-2 px-4 py-2 rounded-full bg-[#F2E8D5]">
              <User className={`w-4 h-4 ${colors.textGoldDark}`} />
              <span className={`text-sm font-medium ${colors.textNavy}`}>Olá, {user?.name?.split(' ')[0] || 'Usuário'}</span>
            </div>
          )}

          <button onClick={() => navigateTo('cart')} className={`mobile-touch-pop w-10 h-10 rounded-full border ${colors.borderLight} flex items-center justify-center relative bg-[#FAF8F4] active:scale-95 hover:bg-gray-50 transition-[transform,background-color]`}>
            <ShoppingBag className={`w-4 h-4 ${colors.textNavy}`} />
            {cartCount > 0 && (
              <span className={`absolute -top-1 -right-1 ${colors.bgGoldDark} text-white text-[10px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-medium`}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {showSearch && (
        <form onSubmit={handleSearch} className="lg:hidden max-w-6xl mx-auto w-full">
          <div className="luxury-input flex h-10 items-center rounded-full px-3">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={currentView === 'inventory' ? 'Buscar produto...' : isOrderView ? 'Buscar pedido...' : 'Buscar semijoias...'}
              className="h-full min-w-0 flex-1 bg-transparent px-2 text-[15px] text-[#1F2428] outline-none placeholder:text-gray-400"
            />
            <button type="submit" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#8F6720] transition-colors hover:bg-[#F7F2E8]" title="Buscar" aria-label="Buscar">
              <Search className="h-4.5 w-4.5" />
            </button>
          </div>
        </form>
      )}

      <div className="hidden lg:flex mx-auto w-full max-w-[1640px] items-center gap-5 xl:gap-8">
        <button type="button" onClick={() => navigateTo('home')} className="flex w-52 shrink-0 items-center rounded-sm text-left transition-opacity hover:opacity-80 xl:w-56" aria-label="Yara Souza Semijoias">
          <BrandLogo className="h-14 w-10 shrink-0" />
          <div className="flex flex-col font-serif text-[19px] leading-[0.95] text-[#C59D3F]">
            <span>Yara Souza</span>
            <span>Semijoias</span>
          </div>
        </button>

        {showSearch ? (
          <form onSubmit={handleSearch} className="luxury-input flex h-11 flex-1 items-center rounded-full px-2 shadow-sm transition-shadow focus-within:shadow-md">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-full min-w-0 flex-1 rounded-l-full bg-transparent px-4 text-sm text-[#1F2428] outline-none placeholder:text-gray-400"
            />
            <button type="submit" className="flex h-8 w-12 items-center justify-center border-l border-[#E8E0D3] text-[#8F6720] transition-colors hover:text-[#1F2428]" title="Buscar">
              <Search className="h-5 w-5" />
            </button>
          </form>
        ) : (
          <div className="flex-1" />
        )}

        <div className="flex w-52 shrink-0 items-center gap-2 rounded-sm text-left leading-tight text-[#0A1B35]">
          <MapPin className="h-5 w-5 shrink-0 text-[#9A6A1E]" />
          <span className="flex flex-col">
            <span className="text-[11px] text-gray-500">Atendimento</span>
            <span>Online e sob encomenda</span>
          </span>
        </div>

        <button type="button" onClick={scrollToHighlights} className="ml-auto flex h-10 w-64 items-center justify-center rounded-full border border-[#B88A2E]/35 bg-[#F7F2E8] px-5 text-sm font-semibold tracking-[0.04em] text-[#8F6720] shadow-sm transition-[background-color,border-color,color,box-shadow] hover:border-[#B88A2E]/55 hover:bg-[#EFE6D4] hover:text-[#6F4A16] hover:shadow-md">
          Destaque da Semana
        </button>
      </div>

      <div className="hidden lg:flex mx-auto w-full max-w-[1640px] items-center justify-between gap-6 text-sm text-[#0A1B35]">
        <div className="w-52 xl:w-56 shrink-0" />

        <nav className="flex flex-1 items-center gap-6 whitespace-nowrap xl:gap-7">
          {primaryLinks.map((link) => (
            <button key={link.label} type="button" onClick={() => handlePrimaryLinkClick(link)} className="flex h-9 items-center gap-1 transition-colors hover:text-[#8F6720]">
              <span>{link.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-5 whitespace-nowrap">
          {!isLoggedIn ? (
            <>
              <button type="button" onClick={handleLogin} className="flex h-9 items-center transition-colors hover:text-[#9A6A1E]">Criar conta</button>
              <button type="button" onClick={handleLogin} className="flex h-9 items-center transition-colors hover:text-[#9A6A1E]">Entrar</button>
            </>
          ) : (
            <div ref={accountMenuRef} className="relative">
              <button type="button" onClick={() => setIsAccountMenuOpen((open) => !open)} className="flex h-9 items-center gap-1.5 transition-colors hover:text-[#9A6A1E]" aria-haspopup="menu" aria-expanded={isAccountMenuOpen}>
                <User className="h-4 w-4" />
                <span>Olá, {user?.name?.split(' ')[0] || 'Usuário'}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isAccountMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-lg border border-[#E8E0D3] bg-white py-2 text-sm text-[#0A1B35] shadow-[0_18px_45px_rgba(31,36,40,0.14)]" role="menu">
                  <button type="button" onClick={() => handleAccountNavigation('my_account')} className="flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-[#F7F2E8] hover:text-[#8F6720]" role="menuitem">
                    <User className="h-4 w-4" />
                    Minha conta
                  </button>

                  {isAdmin && (
                    <>
                      <div className="my-1 border-t border-[#E8E0D3]" />
                      <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">Administração</p>
                      {adminLinks.map((link) => (
                        <button key={link.view} type="button" onClick={() => handleAccountNavigation(link.view)} className={`flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-[#F7F2E8] hover:text-[#8F6720] ${currentView === link.view ? 'text-[#8F6720]' : ''}`} role="menuitem">
                          {link.icon}
                          {link.label}
                        </button>
                      ))}
                    </>
                  )}

                  <div className="my-1 border-t border-[#E8E0D3]" />
                  <button type="button" onClick={() => { setIsAccountMenuOpen(false); handleLogout(); }} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-red-600 transition-colors hover:bg-red-50" role="menuitem">
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          )}
          <button type="button" onClick={() => navigateTo('my_orders')} className="flex h-9 items-center transition-colors hover:text-[#9A6A1E]">Pedidos</button>
          <button type="button" onClick={() => navigateTo('cart')} className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E0D3] bg-white transition-colors hover:bg-[#F7F2E8]" title="Carrinho">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8F6720] px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {currentView === 'home' && <div className="sr-only">Yara Souza Semijoias</div>}
    </header>
  );
}
