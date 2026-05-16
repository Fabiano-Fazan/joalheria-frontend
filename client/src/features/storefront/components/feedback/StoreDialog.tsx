import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { colors } from '../../theme';

type StoreDialogVariant = 'info' | 'success' | 'danger' | 'gold';

type StoreDialogProps = {
  open: boolean;
  title: string;
  message: string;
  cancelLabel?: string;
  confirmLabel?: string;
  variant?: StoreDialogVariant;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm?: () => void;
};

const variantStyles = {
  info: {
    icon: Info,
    iconClass: 'bg-[#F2E8D5] text-[#9A6A1E]',
    confirmClass: `${colors.bgGoldDark} text-white hover:bg-[#8A5A15]`,
  },
  gold: {
    icon: Info,
    iconClass: 'bg-[#F7F2E8] text-[#8F6720]',
    confirmClass: `border border-[#B88A2E]/35 bg-[#F7F2E8] text-[#8F6720] hover:bg-[#EFE6D4] hover:text-[#6F4A16] hover:border-[#B88A2E]/55`,
  },
  success: {
    icon: CheckCircle2,
    iconClass: 'bg-green-50 text-green-700',
    confirmClass: 'bg-green-700 text-white hover:bg-green-800',
  },
  danger: {
    icon: AlertTriangle,
    iconClass: 'bg-red-50 text-red-600',
    confirmClass: 'border border-red-100 bg-red-50 text-red-600 hover:bg-red-100',
  },
};

export function StoreDialog({
  open,
  title,
  message,
  cancelLabel = 'Fechar',
  confirmLabel,
  variant = 'info',
  isLoading = false,
  onClose,
  onConfirm,
}: StoreDialogProps) {
  if (!open) return null;

  const styles = variantStyles[variant];
  const Icon = styles.icon;
  const showConfirm = Boolean(confirmLabel && onConfirm);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Fechar modal"
        className="absolute inset-0 bg-transparent animate-fadeIn"
        onClick={isLoading ? undefined : onClose}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-[#E9DCC9] bg-white p-5 sm:p-6 shadow-[0_24px_70px_rgba(10,27,53,0.22)] animate-scaleIn">
        <div className="flex items-start gap-4">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.iconClass}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className={`font-serif text-2xl leading-tight ${colors.textNavy}`}>{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">{message}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="mobile-touch-pop flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 disabled:opacity-40"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="mobile-touch-pop rounded-full border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          {showConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`mobile-touch-pop rounded-full px-4 py-2.5 text-sm font-medium shadow-sm transition-[background-color,transform,box-shadow] hover:-translate-y-0.5 hover:shadow-md disabled:translate-y-0 disabled:opacity-60 ${styles.confirmClass}`}
            >
              {isLoading ? 'Aguarde...' : confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
