import type { PageResponse, PedidoRequestDTO, PedidoResponseDTO } from '../types';
import { apiRequest, jsonHeaders } from './http';

export const ORDERS_PAGE_SIZE = 3;
const ORDERS_SORT = 'dataPedido,desc';

export function fetchOrders(page = 0) {
  return apiRequest<PageResponse<PedidoResponseDTO>>('/pedidos', {
    query: { page, size: ORDERS_PAGE_SIZE, sort: ORDERS_SORT },
  });
}

export function fetchOrdersByCustomer(page = 0) {
  return apiRequest<PageResponse<PedidoResponseDTO>>('/pedidos/cliente', {
    query: { page, size: ORDERS_PAGE_SIZE, sort: ORDERS_SORT },
  });
}

async function fetchAllOrderPages(fetchPage: (page: number) => Promise<PageResponse<PedidoResponseDTO>>) {
  const firstPage = await fetchPage(0);
  const orders = [...(firstPage.content || [])];

  for (let page = 1; page < firstPage.totalPages; page += 1) {
    const nextPage = await fetchPage(page);
    orders.push(...(nextPage.content || []));
  }

  return orders;
}

export function fetchAllOrders() {
  return fetchAllOrderPages(fetchOrders);
}

export function fetchAllOrdersByCustomer() {
  return fetchAllOrderPages(fetchOrdersByCustomer);
}

export async function createOrder(order: PedidoRequestDTO) {
  return apiRequest<PedidoResponseDTO>('/pedidos', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(order),
  });
}

export async function cancelOrder(id: string) {
  return apiRequest<void>(`/pedidos/${id}`, {
    method: 'DELETE',
  });
}
