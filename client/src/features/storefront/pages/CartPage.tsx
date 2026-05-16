import { useMemo, useState } from 'react';
import { Minus, Plus, Send, ShoppingBag, Trash2 } from 'lucide-react';
import { formatCurrency } from '../lib/product';
import { colors } from '../theme';
import { useStorefront } from '../context/StorefrontContext';
import { createOrder } from '../services/orders';
import { StoreDialog } from '../components/feedback/StoreDialog';

export function CartPage() {
  const [isGift, setIsGift] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialog, setDialog] = useState<{ title: string; message: string; variant?: 'info' | 'success' | 'danger' } | null>(null);
  const { cartItems, user, isLoggedIn, updateQuantity, removeFromCart, clearCart, navigateTo, handleLogin } = useStorefront();

  const total = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.numPrice * item.quantity, 0),
    [cartItems],
  );

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    if (!isLoggedIn || !user?.email) {
      handleLogin();
      return;
    }

    setIsSubmitting(true);

    const payload = {
      itens: cartItems.map((item) => ({
        produtoId: item.id,
        quantidade: item.quantity,
        produtoNome: item.name,
        preco: item.numPrice,
      })),
      observacoes: isGift ? 'Embrulhar para presente' : '',
    };

    try {
      const order = await createOrder(payload);

      if (!order.linkWhatsapp) {
        setDialog({
          title: 'Pedido realizado',
          message: 'Pedido criado, mas o backend não retornou o link do WhatsApp.',
          variant: 'success',
        });
        clearCart();
        return;
      }

      window.open(order.linkWhatsapp, '_blank');
      clearCart();
      setDialog({
        title: 'Pedido realizado',
        message: 'Seu pedido foi criado com sucesso. Abrimos o WhatsApp para finalizar o atendimento.',
        variant: 'success',
      });
    } catch (error) {
      console.error(error);
      setDialog({
        title: 'Pedido não criado',
        message: 'Não foi possível criar o pedido. Verifique login, estoque dos produtos e tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="luxury-page animate-fadeIn">
      <div className="mb-8">
        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8F6720]">Sacola</span>
        <h2 className={`mt-1 text-4xl font-serif ${colors.textNavy}`}>Seu Pedido</h2>
        <p className="text-gray-500 mt-2">Confira suas joias e finalize o pedido via WhatsApp.</p>
      </div>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="mobile-reveal luxury-card p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="flex flex-row gap-4 w-full sm:min-w-0 sm:flex-1">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#FAF8F4] rounded-2xl flex shrink-0 items-center justify-center border border-[#E8E0D3] relative overflow-hidden">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-contain p-1.5" />
                  </div>
                  <div className="flex-1 min-w-0 text-left flex flex-col justify-center">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{item.category}</span>
                    <h3 className={`font-medium ${colors.textNavy} text-sm sm:text-lg leading-tight mt-1 mb-1 sm:mb-2 line-clamp-2`}>{item.name}</h3>
                    <p className={`${colors.textGoldDark} font-bold text-sm sm:text-base`}>{formatCurrency(item.numPrice)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end sm:shrink-0 sm:w-[172px] border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0">
                  <div className="flex items-center gap-3 sm:gap-2 bg-[#FAF8F4] border border-[#E8E0D3] rounded-full px-2 sm:px-2 py-1">
                    <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-500 hover:text-[#9A6A1E] transition-colors p-1 sm:p-2"><Minus className="w-3 h-3 sm:w-4 sm:h-4" /></button>
                    <span className={`font-medium w-6 text-center text-sm sm:text-base ${colors.textNavy}`}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-500 hover:text-[#9A6A1E] transition-colors p-1 sm:p-2"><Plus className="w-3 h-3 sm:w-4 sm:h-4" /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"><Trash2 className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="luxury-card p-6 rounded-3xl sticky top-28">
              <h3 className={`text-xl font-serif ${colors.textNavy} border-b border-gray-100 pb-4 mb-4`}>Resumo</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(total)}</span></div>
              </div>
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center"><span className={`font-medium ${colors.textNavy}`}>Total</span><span className={`text-2xl font-bold ${colors.textGoldDark}`}>{formatCurrency(total)}</span></div>
                <p className="text-xs text-gray-400 mt-2 text-right">Sem taxas de frete inclusas.</p>
              </div>
              <label className="flex items-center gap-3 mb-8 cursor-pointer p-3 bg-[#FAF8F4] rounded-2xl border border-[#E8E0D3] hover:bg-[#F7F2E8] transition-colors">
                <input type="checkbox" checked={isGift} onChange={(event) => setIsGift(event.target.checked)} className="w-5 h-5 rounded border-gray-300 text-[#9A6A1E] focus:ring-[#9A6A1E]" />
                <span className={`text-sm font-medium ${colors.textNavy}`}>Embrulhar para presente</span>
              </label>
              <button onClick={handleCheckout} disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-full border border-[#B88A2E]/35 bg-[#F7F2E8] px-6 py-4 text-base font-semibold tracking-[0.04em] text-[#8F6720] shadow-sm transition-[background-color,border-color,color,box-shadow,transform] hover:border-[#B88A2E]/55 hover:bg-[#EFE6D4] hover:text-[#6F4A16] hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-60">
                <Send className="w-5 h-5" />{isSubmitting ? 'Processando...' : isLoggedIn ? 'Criar pedido' : 'Entrar para finalizar'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 luxury-card rounded-3xl">
          <ShoppingBag className={`w-16 h-16 ${colors.textGold} opacity-30 mx-auto mb-4`} />
          <h3 className={`text-xl font-serif ${colors.textNavy} mb-2`}>Seu pedido está vazio</h3>
          <p className="text-gray-500 mb-8">Nenhuma joia foi adicionada ao seu carrinho ainda.</p>
          <button onClick={() => navigateTo('products')} className="rounded-full border border-[#B88A2E]/35 bg-[#F7F2E8] px-8 py-3 text-sm font-semibold tracking-[0.04em] text-[#8F6720] shadow-sm transition-[background-color,border-color,color,box-shadow,transform] hover:border-[#B88A2E]/55 hover:bg-[#EFE6D4] hover:text-[#6F4A16] hover:shadow-md active:scale-95">Ver produtos</button>
        </div>
      )}
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
