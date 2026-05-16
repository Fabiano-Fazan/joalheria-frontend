import { Switch, Route } from 'wouter';
import { Header } from '@/features/storefront/components/layout/Header';
import { MobileMenu } from '@/features/storefront/components/layout/MobileMenu';
import { StoreFooter } from '@/features/storefront/components/layout/StoreFooter';
import { StorefrontProvider, useStorefront } from '@/features/storefront/context/StorefrontContext';
import { colors } from '@/features/storefront/theme';
import { AddProductPage } from '@/features/storefront/pages/AddProductPage';
import { CartPage } from '@/features/storefront/pages/CartPage';
import { DashboardPage } from '@/features/storefront/pages/DashboardPage';
import { EditProductPage } from '@/features/storefront/pages/EditProductPage';
import { HomePage } from '@/features/storefront/pages/HomePage';
import { InventoryPage } from '@/features/storefront/pages/InventoryPage';
import { MyAccountPage } from '@/features/storefront/pages/MyAccountPage';
import { MyOrdersPage } from '@/features/storefront/pages/MyOrdersPage';
import { OrdersPage } from '@/features/storefront/pages/OrdersPage';
import { ProductsPage } from '@/features/storefront/pages/ProductsPage';

function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAdmin } = useStorefront();
  return isAdmin ? <Component /> : <HomePage />;
}

function StorefrontRoutes() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/home" component={HomePage} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/my_account" component={MyAccountPage} />
      <Route path="/my_orders" component={MyOrdersPage} />
      
      {/* Admin Routes */}
      <Route path="/dashboard">
        <AdminRoute component={DashboardPage} />
      </Route>
      <Route path="/add_product">
        <AdminRoute component={AddProductPage} />
      </Route>
      <Route path="/edit_product">
        <AdminRoute component={EditProductPage} />
      </Route>
      <Route path="/inventory">
        <AdminRoute component={InventoryPage} />
      </Route>
      <Route path="/orders">
        <AdminRoute component={OrdersPage} />
      </Route>

      <Route component={HomePage} />
    </Switch>
  );
}

function StorefrontShell() {
  const { currentView } = useStorefront();

  return (
    <div className={`h-dvh overflow-hidden ${colors.bg} font-sans text-gray-800`}>
      <MobileMenu />
      <div className="h-dvh overflow-y-auto overflow-x-hidden">
        <Header />
        <main>
          <StorefrontRoutes />
        </main>
        <StoreFooter className={currentView === 'home' ? '' : 'hidden lg:block'} />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <StorefrontProvider>
      <StorefrontShell />
    </StorefrontProvider>
  );
}
