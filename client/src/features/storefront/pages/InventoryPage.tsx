import { useEffect, useMemo, useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { fetchProducts } from '../services/products';
import { colors } from '../theme';
import type { Product } from '../types';
import { moveInventory } from '../services/inventory';
import { StoreDialog } from '../components/feedback/StoreDialog';
import { useStorefront } from '../context/StorefrontContext';

export function InventoryPage() {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [moveAmount, setMoveAmount] = useState<Record<string, string>>({});
  const [dialog, setDialog] = useState<{ title: string; message: string; variant?: 'info' | 'success' | 'danger' } | null>(null);
  const { inventorySearchTerm } = useStorefront();

  useEffect(() => {
    fetchProducts()
      .then(setInventory)
      .catch((error) => {
        console.error(error);
        setInventory([]);
      });
  }, []);

  const filteredInventory = useMemo(
    () => inventory.filter((item) => `${item.name} ${item.category}`.toLowerCase().includes(inventorySearchTerm.toLowerCase())),
    [inventory, inventorySearchTerm],
  );

  const handleAmountChange = (id: string, value: string) => {
    setMoveAmount((previous) => ({ ...previous, [id]: value }));
  };

  const applyLocalMove = (id: string, type: 'in' | 'out', amount: number) => {
    setInventory((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;
        const nextStock = type === 'in' ? item.stock + amount : item.stock - amount;
        return { ...item, stock: Math.max(0, nextStock) };
      }),
    );
    setMoveAmount((previous) => ({ ...previous, [id]: '' }));
  };

  const handleMove = async (id: string, type: 'in' | 'out') => {
    const amount = parseInt(moveAmount[id] || '1', 10);
    if (Number.isNaN(amount) || amount <= 0) return;

    const product = inventory.find((item) => item.id === id);
    if (!product) return;

    try {
      await moveInventory(id, {
        quantidade: amount,
        preco: product.numPrice,
        tipo: type === 'in' ? 'ENTRADA' : 'SAIDA',
      });
      applyLocalMove(id, type, amount);
      setDialog({
        title: 'Estoque atualizado',
        message: `${type === 'in' ? 'Entrada' : 'Saída'} de ${amount} unidade${amount > 1 ? 's' : ''} registrada para ${product.name}.`,
        variant: 'success',
      });
    } catch (error) {
      console.error(error);
      setDialog({
        title: 'Estoque não movimentado',
        message: 'Não foi possível movimentar o estoque. Confira seu login de admin e tente novamente.',
      });
    }
  };

  return (
    <div className="luxury-page animate-fadeIn">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8F6720]">Administração</span>
          <h2 className={`mt-1 text-4xl font-serif ${colors.textNavy}`}>Controle de Estoque</h2>
          <p className="text-gray-500 mt-2">Gerencie as entradas e saídas manuais dos produtos.</p>
        </div>
      </div>

      <div className="hidden md:block luxury-card rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#FCFAF6] text-gray-500 text-sm uppercase tracking-wider border-b border-[#E9DCC9]">
                <th className="p-4 font-medium">Produto</th>
                <th className="p-4 font-medium">Categoria</th>
                <th className="p-4 font-medium text-center">Estoque Atual</th>
                <th className="p-4 font-medium text-center">Movimentação Manual</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className={`p-4 font-medium ${colors.textNavy} flex items-center gap-3`}>
                    <img src={item.images[0]} alt="" className="w-8 h-8 rounded-md object-cover border border-gray-200" />
                    {item.name}
                  </td>
                  <td className="p-4 text-gray-500">{item.category}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${item.stock > 10 ? 'bg-green-100 text-green-700' : item.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {item.stock} un
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <input type="number" min="1" placeholder="Qtd" value={moveAmount[item.id] || ''} onChange={(event) => handleAmountChange(item.id, event.target.value)} className="w-16 rounded-md border border-gray-300 py-1.5 px-2 text-center text-sm focus:outline-none focus:border-[#C59D3F]" />
                      <button onClick={() => handleMove(item.id, 'in')} className="flex items-center gap-1 bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-md transition-colors" title="Registrar Entrada"><ArrowUpCircle className="w-4 h-4" /><span className="font-medium">Entrada</span></button>
                      <button onClick={() => handleMove(item.id, 'out')} className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors" title="Registrar Saída"><ArrowDownCircle className="w-4 h-4" /><span className="font-medium">Saída</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {filteredInventory.map((item) => (
          <div key={item.id} className="luxury-card rounded-3xl p-4">
            <div className="flex items-start gap-3">
              <img src={item.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${colors.textNavy} truncate`}>{item.name}</p>
                <p className="text-xs text-gray-500 mt-1">{item.category}</p>
              </div>
              <span className={`shrink-0 inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${item.stock > 10 ? 'bg-green-100 text-green-700' : item.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                {item.stock} un
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Movimentação Manual</p>
              <div className="grid grid-cols-[72px_1fr_1fr] gap-2">
                <input type="number" min="1" placeholder="Qtd" value={moveAmount[item.id] || ''} onChange={(event) => handleAmountChange(item.id, event.target.value)} className="w-full rounded-md border border-gray-300 py-2 px-2 text-center text-sm focus:outline-none focus:border-[#C59D3F]" />
                <button onClick={() => handleMove(item.id, 'in')} className="flex items-center justify-center gap-1 bg-green-50 text-green-600 hover:bg-green-100 px-2 py-2 rounded-md transition-colors text-sm" title="Registrar Entrada">
                  <ArrowUpCircle className="w-4 h-4" />
                  Entrada
                </button>
                <button onClick={() => handleMove(item.id, 'out')} className="flex items-center justify-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-2 py-2 rounded-md transition-colors text-sm" title="Registrar Saída">
                  <ArrowDownCircle className="w-4 h-4" />
                  Saída
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredInventory.length === 0 && (
          <div className="luxury-card rounded-3xl p-8 text-center text-gray-500">
            Nenhum produto encontrado.
          </div>
        )}
      </div>
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
