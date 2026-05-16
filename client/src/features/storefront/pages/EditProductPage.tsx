import { useEffect, useState } from 'react';
import { colors } from '../theme';
import { useStorefront } from '../context/StorefrontContext';
import { updateProduct } from '../services/products';
import { StoreDialog } from '../components/feedback/StoreDialog';

export function EditProductPage() {
  const { editingProduct, navigateTo } = useStorefront();
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState<{ title: string; message: string; variant?: 'info' | 'success' | 'danger' } | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    cor: '',
    categoria: '',
    preco: '',
    quantidade: '',
    destaque: false,
    inativo: false,
  });

  useEffect(() => {
    if (!editingProduct) return;

    setFormData({
      nome: editingProduct.name,
      descricao: editingProduct.descricao || '',
      cor: editingProduct.cor || '',
      categoria: editingProduct.category,
      preco: String(editingProduct.numPrice),
      quantidade: String(editingProduct.stock),
      destaque: Boolean(editingProduct.destaque),
      inativo: Boolean(editingProduct.inativo),
    });
  }, [editingProduct]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingProduct) return;

    setLoading(true);

    try {
      await updateProduct(editingProduct.id, {
        nome: formData.nome,
        descricao: formData.descricao,
        cor: formData.cor,
        categoria: formData.categoria,
        preco: parseFloat(String(formData.preco).replace(',', '.')),
        quantidade: formData.quantidade === '' ? 0 : parseInt(formData.quantidade, 10),
        destaque: formData.destaque,
        inativo: formData.inativo,
      });

      setDialog({
        title: 'Produto atualizado',
        message: 'As alterações do produto foram salvas com sucesso.',
        variant: 'success',
      });
    } catch (error) {
      console.error(error);
      setDialog({
        title: 'Produto não atualizado',
        message: 'Não foi possível atualizar o produto. Confira se você está logado como admin e se todos os campos estão válidos.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!editingProduct) {
    return (
      <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 animate-fadeIn">
        <div className="luxury-card rounded-3xl p-8 text-center">
          <h2 className={`text-2xl font-serif ${colors.textNavy}`}>Nenhum produto selecionado</h2>
          <p className="text-gray-500 mt-2 mb-6">Volte para a lista de produtos e escolha qual item deseja editar.</p>
          <button onClick={() => navigateTo('products')} className="luxury-button px-6 py-3 text-xs">
            Ver produtos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 animate-fadeIn">
      <div className="mb-8">
        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8F6720]">Administração</span>
        <h2 className={`mt-1 text-4xl font-serif ${colors.textNavy}`}>Editar Produto</h2>
        <p className="text-gray-500 mt-2">Atualize as informações da semijoia selecionada.</p>
      </div>

      <form onSubmit={handleSave} className="luxury-card rounded-3xl p-5 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8">
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">Imagem atual</p>
            <div className="w-full aspect-square rounded-2xl border border-[#E8E0D3] overflow-hidden bg-[#FAF8F4]">
              <img src={editingProduct.images[0]} alt={editingProduct.name} className="w-full h-full object-contain p-2" />
            </div>
            <p className="text-xs text-gray-500 mt-3">A edição de imagens continua no cadastro do produto.</p>
          </div>

          <div className="space-y-5">
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-[#C59D3F] transition-colors">Nome da joia</label>
              <input type="text" value={formData.nome} onChange={(event) => setFormData({ ...formData, nome: event.target.value })} required className="w-full rounded-lg border border-[#E9DCC9] py-3 px-4 focus:outline-none focus:border-[#C59D3F] focus:ring-2 focus:ring-[#C59D3F]/20 transition-all bg-[#FCFAF6] focus:bg-white" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-[#C59D3F] transition-colors">Preço (R$)</label>
                <input type="number" step="0.01" value={formData.preco} onChange={(event) => setFormData({ ...formData, preco: event.target.value })} required className="w-full rounded-lg border border-[#E9DCC9] py-3 px-4 focus:outline-none focus:border-[#C59D3F] focus:ring-2 focus:ring-[#C59D3F]/20 transition-all bg-[#FCFAF6] focus:bg-white" />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-[#C59D3F] transition-colors">Cor</label>
                <input type="text" value={formData.cor} onChange={(event) => setFormData({ ...formData, cor: event.target.value })} required className="w-full rounded-lg border border-[#E9DCC9] py-3 px-4 focus:outline-none focus:border-[#C59D3F] focus:ring-2 focus:ring-[#C59D3F]/20 transition-all bg-[#FCFAF6] focus:bg-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-[#C59D3F] transition-colors">Categoria</label>
                <input type="text" value={formData.categoria} onChange={(event) => setFormData({ ...formData, categoria: event.target.value })} required className="w-full rounded-lg border border-[#E9DCC9] py-3 px-4 focus:outline-none focus:border-[#C59D3F] focus:ring-2 focus:ring-[#C59D3F]/20 transition-all bg-[#FCFAF6] focus:bg-white" />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-[#C59D3F] transition-colors">Estoque</label>
                <input type="number" min="0" value={formData.quantidade} onChange={(event) => setFormData({ ...formData, quantidade: event.target.value })} className="w-full rounded-lg border border-[#E9DCC9] py-3 px-4 focus:outline-none focus:border-[#C59D3F] focus:ring-2 focus:ring-[#C59D3F]/20 transition-all bg-[#FCFAF6] focus:bg-white" />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-[#C59D3F] transition-colors">Descrição</label>
              <textarea rows={4} value={formData.descricao} onChange={(event) => setFormData({ ...formData, descricao: event.target.value })} required className="w-full rounded-lg border border-[#E9DCC9] py-3 px-4 focus:outline-none focus:border-[#C59D3F] focus:ring-2 focus:ring-[#C59D3F]/20 transition-all bg-[#FCFAF6] focus:bg-white resize-none" />
            </div>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#E9DCC9] bg-[#FCFAF6] cursor-pointer hover:bg-[#F2E8D5]/50 transition-colors">
              <input
                type="checkbox"
                checked={formData.destaque}
                onChange={(event) => setFormData({ ...formData, destaque: event.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-[#9A6A1E] focus:ring-[#9A6A1E]"
              />
              <span className={`text-sm font-medium ${colors.textNavy}`}>Marcar como destaque da semana</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-[#E9DCC9] bg-[#FCFAF6] cursor-pointer hover:bg-[#F2E8D5]/50 transition-colors">
              <input
                type="checkbox"
                checked={formData.inativo}
                onChange={(event) => setFormData({ ...formData, inativo: event.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-[#9A6A1E] focus:ring-[#9A6A1E]"
              />
              <span className={`text-sm font-medium ${colors.textNavy}`}>Produto inativo</span>
            </label>

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={() => navigateTo('products')} className="rounded-full border border-red-100 bg-red-50 px-6 py-3 font-medium text-red-600 transition-colors hover:bg-red-100 active:scale-95">Cancelar</button>
              <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 rounded-full border border-[#B88A2E]/35 bg-[#F7F2E8] px-8 py-3 text-sm font-semibold tracking-[0.04em] text-[#8F6720] shadow-sm transition-[background-color,border-color,color,box-shadow,transform] hover:border-[#B88A2E]/55 hover:bg-[#EFE6D4] hover:text-[#6F4A16] hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-sm">
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      </form>
      <StoreDialog
        open={Boolean(dialog)}
        title={dialog?.title || ''}
        message={dialog?.message || ''}
        variant={dialog?.variant}
        onClose={() => {
          const shouldReturnToProducts = dialog?.variant === 'success';
          setDialog(null);
          if (shouldReturnToProducts) navigateTo('products');
        }}
      />
    </div>
  );
}
