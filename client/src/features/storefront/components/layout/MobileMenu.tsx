import { useEffect } from 'react';
import { Archive, ClipboardList, Home, LayoutDashboard, Package, PackagePlus, ReceiptText, ShoppingBag, User, X } from 'lucide-react';
import { colors } from '../../theme';
import { useStorefront } from '../../context/StorefrontContext';
import { BrandLogo } from './BrandLogo';
import { MenuLink } from './MenuLink';

export function MobileMenu() {
  const {
    currentView,
    isMobileMenuOpen,
    cartItems,
    isLoggedIn,
    isAdmin,
    user,
    navigateTo,
    setIsMobileMenuOpen,
    handleLogin,
    handleLogout,
  } = useStorefront();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const goHome = () => {
    navigateTo('home');
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    if (window.matchMedia('(min-width: 768px)').matches) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverscroll = document.body.style.overscrollBehavior;
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overscrollBehavior = originalBodyOverscroll;
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <div className={`fixed inset-0 bg-[#1F2428]/45 backdrop-blur-[2px] z-50 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)} />
      <div className={`fixed top-0 left-0 h-dvh w-[90vw] max-w-[380px] bg-white shadow-[24px_0_55px_rgba(31,36,40,0.18)] z-50 transform-gpu will-change-transform transition-transform duration-300 sm:duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col md:hidden`}>
        <div className={`p-4 flex items-center justify-between border-b ${colors.borderLight} bg-[#FAF8F4]`}>
          <button onClick={() => setIsMobileMenuOpen(false)} className={`mobile-touch-pop w-10 h-10 rounded-full border ${colors.borderLight} flex md:hidden items-center justify-center bg-white active:rotate-90 hover:bg-gray-50 hover:rotate-90 transition-[transform,background-color] duration-300`}>
            <X className={`w-6 h-6 ${colors.textNavy}`} />
          </button>

          <button type="button" onClick={goHome} className="flex items-center gap-2 rounded-md text-left active:scale-95 transition-[transform,opacity]">
            <BrandLogo className="w-12 h-10" />
            <div className={`flex flex-col ${colors.textGold} font-serif leading-tight text-base`}>
              <span>Yara Souza</span>
              <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#1F2428]">Semijoias</span>
            </div>
          </button>

          <div className="flex items-center gap-3 md:hidden">
            {!isLoggedIn ? (
              <button onClick={handleLogin} className={`text-sm font-semibold ${colors.textGoldDark} mr-2`}>Entrar</button>
            ) : (
              <span className={`text-sm font-medium ${colors.textNavy} mr-2`}>Olá, {user?.name?.split(' ')[0]}</span>
            )}
            <button onClick={() => navigateTo('cart')} className={`w-10 h-10 rounded-full border ${colors.borderLight} flex items-center justify-center relative bg-white`}>
              <ShoppingBag className={`w-4 h-4 ${colors.textNavy}`} />
              {cartCount > 0 && <span className={`absolute -top-1 -right-1 ${colors.bgGoldDark} text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center`}>{cartCount}</span>}
            </button>
          </div>
        </div>

        <div className={`p-4 flex-1 overflow-y-auto ${colors.borderLight}`}>
          <div>
            <p className="text-[11px] font-semibold text-gray-400 mb-2 uppercase tracking-[0.22em] pl-2">Loja</p>
            <nav className="flex flex-col space-y-1.5 mb-5">
              <MenuLink icon={<Home />} label="Início" onClick={() => navigateTo('home')} active={currentView === 'home'} />
              <MenuLink icon={<Package />} label="Produtos" onClick={() => navigateTo('products')} active={currentView === 'products'} />
              <MenuLink icon={<ShoppingBag />} label="Minha Sacola" onClick={() => navigateTo('cart')} active={currentView === 'cart'} />
              {isLoggedIn && <MenuLink icon={<ReceiptText />} label="Meus Pedidos" onClick={() => navigateTo('my_orders')} active={currentView === 'my_orders'} />}
              {isLoggedIn && <MenuLink icon={<User />} label="Minha Conta" onClick={() => navigateTo('my_account')} active={currentView === 'my_account'} />}
            </nav>
            <div className={`h-px w-full ${colors.bgWhite} border-t ${colors.borderLight} mb-5`} />

            {isAdmin && (
              <>
                <p className="text-[11px] font-semibold text-gray-400 mb-2 uppercase tracking-[0.22em] pl-2">Administração</p>
                <nav className="flex flex-col space-y-1.5 mb-4">
                  <MenuLink icon={<LayoutDashboard />} label="Dashboard" onClick={() => navigateTo('dashboard')} active={currentView === 'dashboard'} />
                  <MenuLink icon={<PackagePlus />} label="Cadastro de Produtos" onClick={() => navigateTo('add_product')} active={currentView === 'add_product'} />
                  <MenuLink icon={<Archive />} label="Controle de Estoque" onClick={() => navigateTo('inventory')} active={currentView === 'inventory'} />
                  <MenuLink icon={<ClipboardList />} label="Pedidos Realizados" onClick={() => navigateTo('orders')} active={currentView === 'orders'} />
                </nav>
              </>
            )}
          </div>
        </div>

        <div className={`p-4 border-t ${colors.borderLight} bg-white`}>
          {!isLoggedIn ? (
            <button onClick={handleLogin} className="w-full min-h-11 flex items-center justify-center gap-2 rounded-full border border-[#B88A2E]/35 bg-[#F7F2E8] text-sm font-semibold tracking-[0.04em] text-[#8F6720] shadow-sm transition-[background-color,border-color,color,box-shadow,transform] hover:border-[#B88A2E]/55 hover:bg-[#EFE6D4] hover:text-[#6F4A16] hover:shadow-md active:scale-95">
              Entrar com Google
            </button>
          ) : (
            <button onClick={handleLogout} className="w-full min-h-11 rounded-full bg-red-50 text-sm font-semibold text-red-600 border border-red-100 hover:bg-red-100 transition-colors">
              Sair
            </button>
          )}
        </div>
      </div>
    </>
  );
}
