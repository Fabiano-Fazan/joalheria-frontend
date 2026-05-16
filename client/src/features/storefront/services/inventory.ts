import type { EstoqueRequestDTO } from '../types';
import { apiRequest, jsonHeaders } from './http';

export async function moveInventory(productId: string, payload: EstoqueRequestDTO) {
  const endpoint = payload.tipo === 'ENTRADA' ? 'entrada' : 'saida';
  return apiRequest<void>(`/estoque/${endpoint}/${productId}`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
}
