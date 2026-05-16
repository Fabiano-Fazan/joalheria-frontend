import type { ClienteRequestDTO, ClienteResponseDTO, PageResponse } from '../types';
import { apiRequest, jsonHeaders } from './http';

export async function findCustomersByName(name: string) {
  return apiRequest<PageResponse<ClienteResponseDTO>>('/clientes/nome', {
    query: { name },
  });
}

export async function updateCustomer(email: string, customer: ClienteRequestDTO) {
  return apiRequest<ClienteResponseDTO>(`/clientes/${encodeURIComponent(email)}`, {
    method: 'PUT',
    headers: jsonHeaders(),
    body: JSON.stringify(customer),
  });
}
