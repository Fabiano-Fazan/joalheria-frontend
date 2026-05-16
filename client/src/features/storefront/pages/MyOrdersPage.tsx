import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, PackageCheck } from 'lucide-react';
import { formatCurrency } from '../lib/product';
import { fetchAllOrdersByCustomer, fetchOrdersByCustomer, ORDERS_PAGE_SIZE } from '../services/orders';
import { colors } from '../theme';
import { useStorefront } from '../context/StorefrontContext';
import type { PageResponse, PedidoResponseDTO } from '../types';
import { StoreDialog } from '../components/feedback/StoreDialog';
import { StorePagination } from '../components/layout/StorePagination';

function formatOrderDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

function getOrderTotal(order: PedidoResponseDTO) {
  if (typeof order.valorTotal === 'number') return order.valorTotal;
  return order.itens?.reduce((total, item) => total + item.preco * item.quantidade, 0) || 0;
}

function getOrderStatusClass(status?: string) {
  return status?.toUpperCase() === 'CANCELADO'
    ? 'bg-yellow-100 text-yellow-700'
    : 'bg-green-100 text-green-700';
}

export function MyOrdersPage() {
  const { user, handleLogin, orderSearchTerm } = useStorefront();
  const [ordersPage, setOrdersPage] = useState<PageResponse<PedidoResponseDTO> | null>(null);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dialog, setDialog] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    setPage(0);
  }, [orderSearchTerm]);

  useEffect(() => {
    if (!user?.email) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    setIsLoading(true);
    const request = orderSearchTerm.trim()
      ? fetchAllOrdersByCustomer().then((allOrders) => ({
          content: allOrders,
          totalElements: allOrders.length,
          totalPages: Math.max(1, Math.ceil(allOrders.length / ORDERS_PAGE_SIZE)),
          number: page,
          size: ORDERS_PAGE_SIZE,
        }))
      : fetchOrdersByCustomer(page);

    request
      .then((data) => {
        if (isMounted) setOrdersPage(data);
      })
      .catch((error) => {
        console.error(error);
        if (isMounted) {
          setDialog({
            title: 'Pedidos não carregados',
            message: 'Não foi possível carregar seus pedidos. Tente novamente.',
          });
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [orderSearchTerm, page, user?.email]);

  const orders = ordersPage?.content || [];
  const filteredOrders = useMemo(() => {
    const normalizedSearch = orderSearchTerm.trim().toLowerCase();
    if (!normalizedSearch) return orders;

    return orders.filter((order) => {
      const customer = `${order.cliente?.nome || ''} ${order.cliente?.email || ''}`.toLowerCase();
      const products = order.itens?.map((item) => item.nomeProduto).join(' ').toLowerCase() || '';
      return customer.includes(normalizedSearch) || products.includes(normalizedSearch) || order.id.toLowerCase().includes(normalizedSearch);
    });
  }, [orders, orderSearchTerm]);
  const displayedOrders = useMemo(() => {
    if (!orderSearchTerm.trim()) return filteredOrders;
    const start = page * ORDERS_PAGE_SIZE;
    return filteredOrders.slice(start, start + ORDERS_PAGE_SIZE);
  }, [filteredOrders, orderSearchTerm, page]);
  const paginationTotalPages = orderSearchTerm.trim()
    ? Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PAGE_SIZE))
    : ordersPage?.totalPages || 1;

  if (!user?.email) {
    return (
      <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 animate-fadeIn">
        <div className="luxury-card rounded-3xl p-8 text-center">
          <PackageCheck className={`${colors.textGold} w-14 h-14 mx-auto mb-4 opacity-40`} />
          <h2 className={`text-2xl font-serif ${colors.textNavy}`}>Entre para ver seus pedidos</h2>
          <p className="text-gray-500 mt-2 mb-6">Use o login com Google para consultar os pedidos vinculados ao seu cadastro.</p>
          <button onClick={handleLogin} className="luxury-button px-6 py-3 text-xs">
            Entrar com Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-5.5rem)] w-full max-w-5xl flex-col p-4 sm:min-h-[calc(100dvh-7rem)] sm:p-6 animate-fadeIn">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8F6720]">Conta</span>
          <h2 className={`mt-1 text-4xl font-serif ${colors.textNavy}`}>Meus Pedidos</h2>
          <p className="text-gray-500 mt-2">Consulte os pedidos realizados com o seu cadastro.</p>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {isLoading ? (
          <div className="luxury-card rounded-3xl p-8 text-center text-gray-500">Carregando seus pedidos...</div>
        ) : displayedOrders.length === 0 ? (
          <div className="luxury-card rounded-3xl p-10 text-center">
            <PackageCheck className={`${colors.textGold} w-14 h-14 mx-auto mb-4 opacity-40`} />
            <h3 className={`text-xl font-serif ${colors.textNavy}`}>Nenhum pedido encontrado</h3>
            <p className="text-gray-500 mt-2">Quando você finalizar um pedido, ele aparecerá aqui.</p>
          </div>
        ) : (
          displayedOrders.map((order) => (
            <div key={order.id} className="luxury-card rounded-3xl p-5">
              <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4 mb-4">
                <div>
                  <p className={`font-medium ${colors.textNavy}`}>Pedido #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatOrderDate(order.dataPedido)}</p>
                </div>
                <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-bold ${getOrderStatusClass(order.status)}`}>
                  {order.status || 'COMPLETO'}
                </span>
              </div>

              <div className="rounded-lg bg-[#FCFAF6] border border-[#E9DCC9] p-3 mb-4">
                <p className={`text-sm font-medium ${colors.textNavy}`}>{order.cliente?.nome || user.name || 'Cliente'}</p>
                <p className="text-xs text-gray-500 mt-1 break-all">{order.cliente?.email || user.email || '-'}</p>
              </div>

              <div className="space-y-2">
                {order.itens?.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                    <p className={colors.textNavy}>
                      <span className="font-medium">{item.quantidade}x</span> {item.nomeProduto}
                    </p>
                    <p className={`${colors.textGoldDark} font-medium whitespace-nowrap`}>{formatCurrency(item.preco * item.quantidade)}</p>
                  </div>
                ))}
              </div>

              {order.observacoes && <p className="text-xs text-[#9A6A1E] mt-4">{order.observacoes}</p>}

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-500">Total</p>
                  <p className={`text-lg font-bold ${colors.textGoldDark}`}>{formatCurrency(getOrderTotal(order))}</p>
                </div>
                {order.linkWhatsapp ? (
                  <a href={order.linkWhatsapp} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1 px-3 py-2 rounded-md ${colors.bgGoldDark} text-white hover:bg-[#8A5A15] transition-colors text-sm`}>
                    <ExternalLink className="w-4 h-4" />
                    WhatsApp
                  </a>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>

      <StorePagination
        page={ordersPage?.number || page}
        totalPages={paginationTotalPages}
        isLoading={isLoading}
        onPrevious={() => setPage((current) => Math.max(0, current - 1))}
        onNext={() => setPage((current) => current + 1)}
      />
      <StoreDialog
        open={Boolean(dialog)}
        title={dialog?.title || ''}
        message={dialog?.message || ''}
        onClose={() => setDialog(null)}
      />
    </div>
  );
}
