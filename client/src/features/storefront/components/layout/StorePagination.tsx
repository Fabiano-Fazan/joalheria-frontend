import { ChevronLeft, ChevronRight } from 'lucide-react';
import { colors } from '../../theme';

type StorePaginationProps = {
  page: number;
  totalPages: number;
  isLoading?: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function StorePagination({ page, totalPages, isLoading = false, onPrevious, onNext }: StorePaginationProps) {
  const normalizedTotal = Math.max(totalPages, 1);
  const hasPrevious = page > 0;
  const hasNext = totalPages > 0 && page < totalPages - 1;
  const buttonClass =
    'inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-[#E8E0D3] bg-white px-4 text-sm font-semibold text-[#1F2428] shadow-sm transition-[background-color,border-color,color,transform] hover:border-[#B88A2E]/45 hover:bg-[#F7F2E8] active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-[#E8E0D3] disabled:hover:bg-white';

  return (
    <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className={`text-sm font-medium ${colors.textNavy}`}>
        Página {page + 1} de {normalizedTotal}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
        <button type="button" onClick={onPrevious} disabled={!hasPrevious || isLoading} className={buttonClass}>
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </button>
        <button type="button" onClick={onNext} disabled={!hasNext || isLoading} className={buttonClass}>
          Próxima
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
