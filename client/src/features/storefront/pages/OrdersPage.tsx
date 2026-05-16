import { useCallback, useEffect, useMemo, useState } from 'react';
import { ExternalLink, PackageCheck, Trash2 } from 'lucide-react';
import { formatCurrency } from '../lib/product';
import { cancelOrder, fetchAllOrders, fetchOrders, ORDERS_PAGE_SIZE } from '../services/orders';
import { colors } from '../theme';
import type { PageResponse, PedidoResponseDTO } from '../types';
import { useStorefront } from '../context/StorefrontContext';
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

function isOrderCanceled(status?: string) {
  return status?.toUpperCase() === 'CANCELADO';
}

export function OrdersPage() {
  const { isAdmin, orderSearchTerm } = useStorefront();
  const [ordersPage, setOrdersPage] = useState<PageResponse<PedidoResponseDTO> | null>(null);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<PedidoResponseDTO | null>(null);
  const [dialog, setDialog] = useState<{ title: string; message: string; variant?: 'info' | 'success' | 'danger' } | null>(null);

  const loadOrders = useCallback(async (pageToLoad: number, options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setIsLoading(true);
    }
    if (orderSearchTerm.trim()) {
      const allOrders = await fetchAllOrders();
      setOrdersPage({
        content: allOrders,
        totalElements: allOrders.length,
        totalPages: Math.max(1, Math.ceil(allOrders.length / ORDERS_PAGE_SIZE)),
        number: pageToLoad,
        size: ORDERS_PAGE_SIZE,
      });
    } else {
      const data = await fetchOrders(pageToLoad);
      setOrdersPage(data);
    }
    if (!options?.silent) {
      setIsLoading(false);
    }
  }, [orderSearchTerm]);

  useEffect(() => {
    setPage(0);
  }, [orderSearchTerm]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const request = orderSearchTerm.trim()
      ? fetchAllOrders().then((allOrders) => ({
          content: allOrders,
          totalElements: allOrders.length,
          totalPages: Math.max(1, Math.ceil(allOrders.length / ORDERS_PAGE_SIZE)),
          number: page,
          size: ORDERS_PAGE_SIZE,
        }))
      : fetchOrders(page);

    request
      .then((data) => {
        if (isMounted) setOrdersPage(data);
      })
      .catch((error) => {
        console.error(error);
        if (isMounted) {
          setDialog({
            title: 'Pedidos não carregados',
            message: 'Não foi possível carregar os pedidos. Confira seu login de admin e tente novamente.',
          });
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [orderSearchTerm, page]);

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

  const handleDeleteOrder = async (order: PedidoResponseDTO) => {
    if (!isAdmin || deletingOrderId || isOrderCanceled(order.status)) return;
    setOrderToDelete(order);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete || deletingOrderId) return;

    setDeletingOrderId(orderToDelete.id);

    try {
      await cancelOrder(orderToDelete.id);
      setOrderToDelete(null);

      if (orders.length === 1 && page > 0) {
        setPage((current) => Math.max(0, current - 1));
      } else {
        await loadOrders(page, { silent: true });
      }
      setDialog({
        title: 'Pedido cancelado',
        message: 'O pedido foi cancelado e o movimento de estoque foi revertido com sucesso.',
        variant: 'success',
      });
    } catch (error) {
      console.error(error);
      setDialog({
        title: 'Pedido não cancelado',
        message: 'Não foi possível cancelar o pedido. Confira seu login de admin e tente novamente.',
      });
    } finally {
      setDeletingOrderId(null);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-5.5rem)] w-full max-w-5xl flex-col p-4 sm:min-h-[calc(100dvh-7rem)] sm:p-6 animate-fadeIn">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8F6720]">Administração</span>
          <h2 className={`mt-1 text-4xl font-serif ${colors.textNavy}`}>Pedidos Realizados</h2>
          <p className="text-gray-500 mt-2">Consulte os pedidos criados pelos clientes.</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex-1 space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-[#E9DCC9] p-8 text-center text-gray-500">Carregando pedidos...</div>
          ) : displayedOrders.length === 0 ? (
            <div className="luxury-card rounded-3xl p-10 text-center">
              <PackageCheck className={`${colors.textGold} w-12 h-12 mx-auto mb-3 opacity-40`} />
              <p className={`${colors.textNavy} font-medium`}>Nenhum pedido encontrado</p>
              <p className="text-gray-500 text-sm mt-1">Os pedidos criados aparecerão aqui.</p>
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
                  <p className={`text-sm font-medium ${colors.textNavy}`}>{order.cliente?.nome || 'Cliente'}</p>
                  <p className="text-xs text-gray-500 mt-1 break-all">{order.cliente?.email || '-'}</p>
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

                {order.observacoes && <p className="text-xs text-[#9A6A1E] mt-3">{order.observacoes}</p>}

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
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteOrder(order)}
                    disabled={deletingOrderId === order.id || isOrderCanceled(order.status)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                    title={isOrderCanceled(order.status) ? 'Pedido já cancelado' : 'Cancelar pedido'}
                  >
                    <Trash2 className="w-4 h-4" />
                    {isOrderCanceled(order.status) ? 'Pedido cancelado' : deletingOrderId === order.id ? 'Cancelando pedido...' : 'Cancelar pedido'}
                  </button>
                )}
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
      </div>
      <StoreDialog
        open={Boolean(orderToDelete)}
        title="Cancelar pedido?"
        message="Essa ação marca o pedido como cancelado e reverte o movimento de estoque."
        cancelLabel="Cancelar"
        confirmLabel="Cancelar pedido"
        variant="gold"
        isLoading={Boolean(deletingOrderId)}
        onClose={() => {
          if (!deletingOrderId) setOrderToDelete(null);
        }}
        onConfirm={confirmDeleteOrder}
      />
      <StoreDialog
        open={Boolean(dialog)}
        title={dialog?.title || ''}
        message={dialog?.message || ''}
        variant={dialog?.variant}
        onClose={() => setDialog(null)}
      />
    </div>
  );
}
