import { useEffect, useMemo, useState } from 'react';
import { BarChart3, CalendarDays, PackageCheck, RefreshCw, ShoppingBag, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../lib/product';
import { fetchDashboardResumo, getCurrentMonthRange, type DashboardPeriod, type DashboardResumo } from '../services/dashboard';
import { colors } from '../theme';
import type { ProdutoMaisVendidoDTO } from '../types';

function getTotalVendido(product: ProdutoMaisVendidoDTO) {
  const totalVendido = typeof product.TotalVendido === 'string' ? Number(product.TotalVendido) : product.TotalVendido;
  return Number.isFinite(totalVendido) ? Number(totalVendido) : 0;
}

export function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardResumo | null>(null);
  const [period, setPeriod] = useState<DashboardPeriod>(() => getCurrentMonthRange());
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadDashboard = (periodToLoad = period) => {
    if (periodToLoad.inicio > periodToLoad.fim) {
      setErrorMessage('A data inicial não pode ser maior que a data final.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    fetchDashboardResumo(periodToLoad)
      .then(setDashboard)
      .catch((error) => {
        console.error(error);
        setErrorMessage('Não foi possível carregar o dashboard. Confira seu login de admin e tente novamente.');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const products = dashboard?.produtosMaisVendidos || [];
  const maxSold = useMemo(
    () => products.reduce((highest, product) => Math.max(highest, getTotalVendido(product)), 0),
    [products],
  );

  return (
    <div className="luxury-page animate-fadeIn">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8F6720]">Administração</span>
          <h2 className={`mt-1 text-4xl font-serif ${colors.textNavy}`}>Dashboard</h2>
        </div>
      </div>

      <form
        className="mb-6 grid grid-cols-1 gap-3 rounded-3xl border border-[#E8E0D3] bg-white p-4 shadow-sm sm:grid-cols-[1fr_1fr_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          loadDashboard(period);
        }}
      >
        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
          Início
          <span className="mt-2 flex h-12 items-center gap-2 rounded-full border border-[#E8E0D3] bg-[#FCFAF6] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition-colors focus-within:border-[#B88A2E] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#F2E8D5]">
            <CalendarDays className="h-4 w-4 shrink-0 text-[#8F6720]" />
            <input
              type="date"
              value={period.inicio}
              onChange={(event) => setPeriod((current) => ({ ...current, inicio: event.target.value }))}
              className="h-full w-full cursor-pointer bg-transparent text-sm font-medium text-[#1F2428] outline-none [color-scheme:light]"
              required
            />
          </span>
        </label>

        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
          Fim
          <span className="mt-2 flex h-12 items-center gap-2 rounded-full border border-[#E8E0D3] bg-[#FCFAF6] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition-colors focus-within:border-[#B88A2E] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#F2E8D5]">
            <CalendarDays className="h-4 w-4 shrink-0 text-[#8F6720]" />
            <input
              type="date"
              value={period.fim}
              onChange={(event) => setPeriod((current) => ({ ...current, fim: event.target.value }))}
              className="h-full w-full cursor-pointer bg-transparent text-sm font-medium text-[#1F2428] outline-none [color-scheme:light]"
              required
            />
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className={`inline-flex h-11 items-center justify-center gap-2 self-end rounded-full border ${colors.borderGold} ${colors.textGoldDark} bg-white px-5 text-sm font-medium transition-colors hover:bg-[#F2E8D5] disabled:opacity-60`}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Filtrar
        </button>
      </form>

      {errorMessage && (
        <div className="mb-6 rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <section className="luxury-card rounded-3xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Pedidos no período</p>
              <p className={`mt-3 text-3xl font-bold ${colors.textNavy}`}>
                {isLoading ? '-' : dashboard?.totalPedidosMesAtual ?? 0}
              </p>
            </div>
            <span className="w-11 h-11 rounded-md bg-[#FCFAF6] border border-[#E9DCC9] flex items-center justify-center">
              <ShoppingBag className={`w-5 h-5 ${colors.textGoldDark}`} />
            </span>
          </div>
        </section>

        <section className="luxury-card rounded-3xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Valor vendido no período</p>
              <p className={`mt-3 text-3xl font-bold ${colors.textNavy}`}>
                {isLoading ? '-' : formatCurrency(dashboard?.valorTotalMesAtual ?? 0)}
              </p>
              <p className="mt-1 text-xs text-gray-400">Somente pedidos completos.</p>
            </div>
            <span className="w-11 h-11 rounded-md bg-[#FCFAF6] border border-[#E9DCC9] flex items-center justify-center">
              <TrendingUp className={`w-5 h-5 ${colors.textGoldDark}`} />
            </span>
          </div>
        </section>
      </div>

      <section className="luxury-card rounded-3xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8E0D3] bg-[#FAF8F4] flex items-center justify-between gap-3">
          <div>
            <h3 className={`font-serif text-2xl ${colors.textNavy}`}>Produtos mais vendidos</h3>
            <p className="text-sm text-gray-500 mt-1">Top 5 do período selecionado.</p>
          </div>
          <BarChart3 className={`w-6 h-6 ${colors.textGold}`} />
        </div>

        <div className="p-5">
          {isLoading ? (
            <div className="py-12 text-center text-gray-500">Carregando indicadores...</div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center">
              <PackageCheck className={`${colors.textGold} w-12 h-12 mx-auto mb-3 opacity-40`} />
              <p className={`${colors.textNavy} font-medium`}>Nenhuma venda encontrada</p>
              <p className="text-gray-500 text-sm mt-1">Os produtos vendidos no mês aparecerão aqui.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product, index) => {
                const totalSold = getTotalVendido(product);
                const barWidth = maxSold > 0 ? Math.max(8, (totalSold / maxSold) * 100) : 0;

                return (
                  <div key={`${product.nomeProduto}-${index}`} className="grid grid-cols-[28px_1fr_auto] items-center gap-3">
                    <span className={`text-sm font-bold ${colors.textGoldDark}`}>{index + 1}</span>
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <p className={`text-sm font-medium ${colors.textNavy} truncate`}>{product.nomeProduto}</p>
                        <p className="text-xs text-gray-500 sm:hidden">{totalSold} un</p>
                      </div>
                      <div className="h-2.5 rounded-full bg-[#F2E8D5] overflow-hidden">
                        <div className="h-full rounded-full bg-[#C59D3F]" style={{ width: `${barWidth}%` }} />
                      </div>
                    </div>
                    <span className={`hidden sm:inline-flex justify-end text-sm font-bold ${colors.textGoldDark} min-w-16`}>
                      {totalSold} un
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
