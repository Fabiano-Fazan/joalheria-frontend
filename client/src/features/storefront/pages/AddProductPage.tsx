import { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import { colors } from '../theme';
import { createProduct } from '../services/products';
import { compressImage } from '../lib/imageCompression';
import { StoreDialog } from '../components/feedback/StoreDialog';

export function AddProductPage() {
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
  const [images, setImages] = useState<(File | null)[]>([null, null, null, null]);
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([null, null, null, null]);
  const [compressingIndex, setCompressingIndex] = useState<number | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log(`[Upload] Slot ${index} selecionado: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);

    // 1. Mostrar preview IMEDIATAMENTE (antes da compressão para ser rápido no celular)
    const reader = new FileReader();
    reader.onload = () => {
      console.log(`[Preview] Gerando visualização para slot ${index}...`);
      setImagePreviews(prev => {
        const next = [...prev];
        next[index] = reader.result as string;
        return next;
      });
    };
    reader.onerror = () => console.error(`[Preview] Erro ao ler arquivo no slot ${index}`);
    reader.readAsDataURL(file);

    setCompressingIndex(index);

    try {
      console.log(`[Compressão] Iniciando para slot ${index}...`);
      const compressedFile = await compressImage(file);
      console.log(`[Compressão] Concluída para slot ${index}. Novo tamanho: ${(compressedFile.size / 1024).toFixed(2)} KB`);

      setImages(prev => {
        const next = [...prev];
        next[index] = compressedFile;
        return next;
      });
    } catch (error) {
      console.warn(`[Compressão] Falhou no slot ${index}, usando original:`, error);
      // Se a compressão falhar, usamos o original (já garantimos isso no imageCompression.ts)
      setImages(prev => {
        const next = [...prev];
        next[index] = file;
        return next;
      });
    } finally {
      event.target.value = '';
      setCompressingIndex(null);
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (compressingIndex !== null) {
        setDialog({
          title: 'Aguarde a imagem',
          message: 'Aguarde o processamento da imagem terminar antes de salvar.',
        });
        return;
      }

      if (!images[0]) {
        setDialog({
          title: 'Imagem principal obrigatória',
          message: 'Adicione a imagem principal para cadastrar o produto.',
        });
        return;
      }
      const selectedImages = images.filter((image): image is File => Boolean(image));

      const produtoInfo = {
        nome: formData.nome,
        descricao: formData.descricao,
        cor: formData.cor,
        categoria: formData.categoria,
        preco: parseFloat(String(formData.preco).replace(',', '.')),
        quantidade: formData.quantidade === '' ? 0 : parseInt(formData.quantidade, 10),
        destaque: formData.destaque,
        inativo: formData.inativo,
      };

      await createProduct({
        product: produtoInfo,
        images: selectedImages,
        mainImageIndex: 0,
      });
      setDialog({
        title: 'Produto cadastrado',
        message: 'O produto foi adicionado ao catálogo com sucesso.',
        variant: 'success',
      });
      setFormData({ nome: '', descricao: '', cor: '', categoria: '', preco: '', quantidade: '', destaque: false, inativo: false });
      setImages([null, null, null, null]);
      setImagePreviews([null, null, null, null]); // Limpa as prévias também
    } catch (error) {
      console.error(error);
      setDialog({
        title: 'Produto não cadastrado',
        message: 'Não foi possível cadastrar o produto. Confira se você está logado como admin e se todos os campos estão válidos.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full p-4 sm:p-6 animate-fadeIn">
      <div className="mb-8">
        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8F6720]">Administração</span>
        <h2 className={`mt-1 text-4xl font-serif ${colors.textNavy}`}>Cadastrar Produto</h2>
        <p className="text-gray-500 mt-2">Adicione uma nova semijoia ao catálogo da loja.</p>
      </div>

      <form onSubmit={handleSave} className="luxury-card rounded-3xl p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(240px,300px)_1fr] lg:grid-cols-[minmax(280px,340px)_1fr] gap-8 lg:gap-12">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors">Imagem Principal</label>
              <label className="w-full aspect-square border-2 border-dashed border-[#E8E0D3] rounded-2xl flex flex-col items-center justify-center bg-[#FAF8F4] cursor-pointer active:bg-[#F7F2E8] hover:bg-[#F7F2E8] active:border-[#B88A2E] hover:border-[#B88A2E] transition-all duration-300 active:shadow-inner hover:shadow-inner active:-translate-y-1 hover:-translate-y-1 relative group overflow-hidden">
                <input type="file" className="hidden" accept="image/*" disabled={compressingIndex !== null} onChange={(event) => handleFileChange(event, 0)} />
                {compressingIndex === 0 ? (
                  <span className="text-sm text-gray-500 font-medium">Comprimindo...</span>
                ) : imagePreviews[0] ? (
                  <img src={imagePreviews[0]} alt="preview comprimido" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload className={`w-8 h-8 ${colors.textGold} mb-2 group-active:scale-125 group-active:-translate-y-1 group-hover:scale-125 group-hover:-translate-y-1 transition-all duration-500`} />
                    <span className="text-sm text-gray-500 font-medium group-active:text-[#9A6A1E] group-hover:text-[#9A6A1E] transition-colors">Foto Destaque</span>
                  </>
                )}
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagens Secundárias (Máx. 3)</label>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((index) => (
                  <label key={index} className="w-full aspect-square border-2 border-dashed border-[#E9DCC9] rounded-lg flex flex-col items-center justify-center bg-[#FCFAF6] cursor-pointer active:bg-[#F2E8D5]/50 hover:bg-[#F2E8D5]/50 active:border-[#C59D3F] hover:border-[#C59D3F] transition-all duration-300 active:shadow-inner hover:shadow-inner active:-translate-y-1 hover:-translate-y-1 group overflow-hidden">
                    <input type="file" className="hidden" accept="image/*" disabled={compressingIndex !== null} onChange={(event) => handleFileChange(event, index)} />
                    {compressingIndex === index ? (
                      <span className="text-[10px] text-gray-500 font-medium text-center px-1">Comprimindo...</span>
                    ) : imagePreviews[index] ? (
                      <img src={imagePreviews[index]!} alt="preview comprimido" className="w-full h-full object-contain p-1" />
                    ) : (
                      <Upload className={`w-5 h-5 ${colors.textGold} group-active:scale-125 group-hover:scale-125 transition-all duration-500`} />
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-[#C59D3F] transition-colors">Nome da Joia</label>
              <input type="text" value={formData.nome} onChange={(event) => setFormData({ ...formData, nome: event.target.value })} placeholder="Ex: Colar Gota Cravejada" required className="luxury-input w-full rounded-2xl py-3.5 px-4" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-[#C59D3F] transition-colors">Preço (R$)</label>
                <input type="number" step="0.01" value={formData.preco} onChange={(event) => setFormData({ ...formData, preco: event.target.value })} placeholder="0.00" required className="luxury-input w-full rounded-2xl py-3.5 px-4" />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-[#C59D3F] transition-colors">Cor</label>
                <input type="text" value={formData.cor} onChange={(event) => setFormData({ ...formData, cor: event.target.value })} placeholder="Ex: Dourado" required className="luxury-input w-full rounded-2xl py-3.5 px-4" />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-[#C59D3F] transition-colors">Categoria</label>
                <input type="text" value={formData.categoria} onChange={(event) => setFormData({ ...formData, categoria: event.target.value })} placeholder="Ex: Colares" required className="luxury-input w-full rounded-2xl py-3.5 px-4" />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-[#C59D3F] transition-colors">Estoque Inicial</label>
                <input type="number" min="0" value={formData.quantidade} onChange={(event) => setFormData({ ...formData, quantidade: event.target.value })} placeholder="0" className="luxury-input w-full rounded-2xl py-3.5 px-4" />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-[#C59D3F] transition-colors">Descrição</label>
              <textarea rows={5} value={formData.descricao} onChange={(event) => setFormData({ ...formData, descricao: event.target.value })} placeholder="Detalhes sobre o banho, pedras e tamanho..." required className="luxury-input w-full rounded-2xl py-3.5 px-4 resize-none" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex min-h-12 items-center gap-3 p-3 rounded-2xl border border-[#E8E0D3] bg-[#FAF8F4] cursor-pointer hover:bg-[#F7F2E8] transition-colors">
                <input
                  type="checkbox"
                  checked={formData.destaque}
                  onChange={(event) => setFormData({ ...formData, destaque: event.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-[#9A6A1E] focus:ring-[#9A6A1E]"
                />
                <span className={`text-sm font-medium ${colors.textNavy}`}>Marcar como destaque da semana</span>
              </label>

              <label className="flex min-h-12 items-center gap-3 p-3 rounded-2xl border border-[#E8E0D3] bg-[#FAF8F4] cursor-pointer hover:bg-[#F7F2E8] transition-colors">
                <input
                  type="checkbox"
                  checked={formData.inativo}
                  onChange={(event) => setFormData({ ...formData, inativo: event.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-[#9A6A1E] focus:ring-[#9A6A1E]"
                />
                <span className={`text-sm font-medium ${colors.textNavy}`}>Produto inativo</span>
              </label>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" className="rounded-full border border-red-100 bg-red-50 px-6 py-3 font-medium text-red-600 transition-colors hover:bg-red-100 active:scale-95">Cancelar</button>
              <button type="submit" disabled={loading || compressingIndex !== null} className="flex items-center justify-center gap-2 rounded-full border border-[#B88A2E]/35 bg-[#F7F2E8] px-8 py-3 text-sm font-semibold tracking-[0.04em] text-[#8F6720] shadow-sm transition-[background-color,border-color,color,box-shadow,transform] hover:border-[#B88A2E]/55 hover:bg-[#EFE6D4] hover:text-[#6F4A16] hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-sm">
                {loading ? 'Salvando...' : compressingIndex !== null ? 'Comprimindo...' : 'Salvar produto'}
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
        onClose={() => setDialog(null)}
      />
    </div>
  );
}
