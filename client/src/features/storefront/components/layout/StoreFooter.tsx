import { Instagram, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useStorefront } from '../../context/StorefrontContext';
import { colors } from '../../theme';

type StoreFooterProps = {
  className?: string;
};

export function StoreFooter({ className = '' }: StoreFooterProps) {
  const { navigateTo } = useStorefront();

  return (
    <footer className={`mt-16 border-t border-[#E8E0D3] pt-8 pb-4 ${className}`}>
      <div className="mx-auto w-full max-w-[1640px] px-4 sm:px-6 md:px-8 2xl:px-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr_1fr]">
          <div>
            <p className={`font-serif text-3xl ${colors.textGold}`}>Yara Souza</p>
            <p className={`font-serif text-xl ${colors.textNavy}`}>Semijoias</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
              Peças delicadas para acompanhar momentos especiais, presentes afetivos e escolhas de todos os dias.
            </p>
          </div>

          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${colors.textNavy}`}>Loja</h3>
            <div className="mt-3 flex flex-col items-start gap-2 text-sm text-gray-500">
              <button type="button" onClick={() => navigateTo('products')} className="transition-colors hover:text-[#9A6A1E]">
                Produtos
              </button>
              <button type="button" onClick={() => navigateTo('cart')} className="transition-colors hover:text-[#9A6A1E]">
                Sacola
              </button>
              <button type="button" onClick={() => navigateTo('my_orders')} className="transition-colors hover:text-[#9A6A1E]">
                Meus pedidos
              </button>
            </div>
          </div>

          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${colors.textNavy}`}>Contato</h3>
            <div className="mt-3 space-y-3 text-sm text-gray-500">
              <p className="flex items-center gap-2">
                <MessageCircle className={`h-4 w-4 ${colors.textGoldDark}`} />
                WhatsApp
              </p>
              <p className="flex items-center gap-2">
                <Instagram className={`h-4 w-4 ${colors.textGoldDark}`} />
                Instagram
              </p>
              <p className="flex items-center gap-2">
                <Mail className={`h-4 w-4 ${colors.textGoldDark}`} />
                Atendimento online
              </p>
            </div>
          </div>

          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${colors.textNavy}`}>Atendimento</h3>
            <div className="mt-3 space-y-3 text-sm text-gray-500">
              <p className="flex items-start gap-2">
                <MapPin className={`mt-0.5 h-4 w-4 ${colors.textGoldDark}`} />
                Atendimento a domicílio
              </p>
              <p>Segunda a sexta, 8h às 18h</p>
              <p>Trocas e cuidados com peças sob consulta</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-1 border-t border-[#E9DCC9] pt-4 text-xs text-gray-400 sm:flex-row sm:items-center sm:gap-4">
          <p>© {new Date().getFullYear()} Yara Souza Semijoias.</p>
          <p>Website developed by Fabiano Fazan</p>
          <p>Feito para brilhar com leveza.</p>
        </div>
      </div>
    </footer>
  );
}
