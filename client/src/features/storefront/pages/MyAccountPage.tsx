import { useState } from 'react';
import { colors } from '../theme';
import { useStorefront } from '../context/StorefrontContext';
import { updateCustomer } from '../services/customers';
import { StoreDialog } from '../components/feedback/StoreDialog';

export function MyAccountPage() {
  const [clienteData, setClienteData] = useState({ telefone: '', endereco: '' });
  const [dialog, setDialog] = useState<{ title: string; message: string; variant?: 'info' | 'success' | 'danger' } | null>(null);
  const { user } = useStorefront();

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user?.email) {
      setDialog({
        title: 'Login necessário',
        message: 'Faça login com Google para atualizar seus dados da conta.',
      });
      return;
    }

    try {
      await updateCustomer(user.email, {
        telefone: clienteData.telefone.replace(/\D/g, ''),
        endereco: clienteData.endereco,
      });
      setDialog({
        title: 'Dados atualizados',
        message: 'Suas informações de contato e entrega foram salvas com sucesso.',
        variant: 'success',
      });
    } catch (error) {
      console.error(error);
      setDialog({
        title: 'Dados não atualizados',
        message: 'Não foi possível atualizar os dados da conta.',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 animate-fadeIn">
      <div className="mb-8">
        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8F6720]">Conta</span>
        <h2 className={`mt-1 text-4xl font-serif ${colors.textNavy}`}>Minha Conta</h2>
        <p className="text-gray-500 mt-2">Gerencie suas informações pessoais e endereço de entrega.</p>
      </div>

      <form onSubmit={handleSave} className="luxury-card rounded-3xl p-5 sm:p-8">
        <div className="space-y-6">
          <h3 className={`text-lg font-serif ${colors.textGoldDark} border-b border-gray-100 pb-2`}>Dados Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input type="text" disabled defaultValue={user?.name || 'Maria Souza'} className="w-full rounded-2xl border border-[#E8E0D3] py-3 px-4 focus:outline-none bg-gray-50 text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input type="email" disabled defaultValue={user?.email || 'maria.souza@exemplo.com'} className="w-full rounded-2xl border border-[#E8E0D3] py-3 px-4 focus:outline-none bg-gray-50 text-gray-500" />
            </div>
          </div>

          <h3 className={`text-lg font-serif ${colors.textGoldDark} border-b border-gray-100 pb-2 mt-8`}>Informações Adicionais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
              <input type="text" value={clienteData.telefone} onChange={(event) => setClienteData({ ...clienteData, telefone: event.target.value })} placeholder="Somente números (Ex: 11999999999)" required className="luxury-input w-full rounded-2xl py-3 px-4" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
              <input type="text" value={clienteData.endereco} onChange={(event) => setClienteData({ ...clienteData, endereco: event.target.value })} placeholder="Rua, Número, CEP, Cidade" required className="luxury-input w-full rounded-2xl py-3 px-4" />
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex justify-end gap-3">
            {!user?.email && (
              <p className="text-xs text-gray-500 max-w-md mr-auto">
                Entre com Google para vincular telefone e endereço ao seu cadastro.
              </p>
            )}
            <button type="submit" className="flex items-center justify-center gap-2 rounded-full border border-[#B88A2E]/35 bg-[#F7F2E8] px-8 py-3 text-sm font-semibold tracking-[0.04em] text-[#8F6720] shadow-sm transition-[background-color,border-color,color,box-shadow,transform] hover:border-[#B88A2E]/55 hover:bg-[#EFE6D4] hover:text-[#6F4A16] hover:shadow-md active:scale-95">
              Salvar alterações
            </button>
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
