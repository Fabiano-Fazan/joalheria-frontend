import type { ProdutoMaisVendidoDTO } from '../types';
import { apiRequest } from './http';

export type DashboardResumo = {
  totalPedidosMesAtual: number;
  valorTotalMesAtual: number;
  produtosMaisVendidos: ProdutoMaisVendidoDTO[];
};

export type DashboardPeriod = {
  inicio: string;
  fim: string;
};

const toNumber = (value: number | string | null | undefined) => {
  const parsed = typeof value === 'string' ? Number(value) : value;
  return Number.isFinite(parsed) ? Number(parsed) : 0;
};

const formatDateParam = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getCurrentMonthRange = (): DashboardPeriod => {
  const now = new Date();
  return {
    inicio: formatDateParam(new Date(now.getFullYear(), now.getMonth(), 1)),
    fim: formatDateParam(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  };
};

export async function fetchDashboardResumo(period: DashboardPeriod = getCurrentMonthRange()): Promise<DashboardResumo> {

  const [totalPedidosMesAtual, valorTotalMesAtual, produtosMaisVendidos] = await Promise.all([
    apiRequest<{ totalPedidos?: number | string }>('/dashbord/pedidos-mes', {
      query: period,
    }),
    apiRequest<number | string>('/dashbord/valor-total-mes', {
      query: period,
    }),
    apiRequest<ProdutoMaisVendidoDTO[]>('/dashbord/produto-mais-vendido-mes', {
      query: period,
    }),
  ]);

  return {
    totalPedidosMesAtual: toNumber(totalPedidosMesAtual.totalPedidos),
    valorTotalMesAtual: toNumber(valorTotalMesAtual),
    produtosMaisVendidos,
  };
}
