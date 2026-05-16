import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { colors } from '../../theme';
import type { Product } from '../../types';
import { useStorefront } from '../../context/StorefrontContext';
import { ZoomableImage } from './ZoomableImage';

type ProductCardProps = {
  product: Product;
  index?: number;
  onEdit?: (product: Product) => void;
  onZoomChange?: (isZooming: boolean) => void;
};

export function ProductCard({ product, index = 0, onEdit, onZoomChange }: ProductCardProps) {
  const [mainImg, setMainImg] = useState(product.images[0]);
  const { addToCart, isAdmin } = useStorefront();
  const isUnavailable = product.inativo || product.stock <= 0;

  return (
    <div
      className="mobile-reveal mobile-product-card relative z-10 hover:z-50 luxury-card bg-white p-2.5 sm:p-3.5 rounded-2xl flex flex-col h-full transition-[transform,box-shadow,border-color] duration-300 sm:duration-500 ease-out sm:hover:shadow-2xl sm:hover:shadow-[#B88A2E]/12 sm:hover:-translate-y-1.5 sm:hover:border-[#B88A2E]/40 group"
      style={{ animationDelay: `${Math.min(index, 6) * 70}ms` }}
    >
      <div className="w-full aspect-square bg-[#FAF8F4] rounded-[1rem] mb-3 relative border border-[#F0E9DE] shrink-0 overflow-hidden">
        <ZoomableImage src={mainImg} alt={product.name} className="absolute inset-0 w-full h-full rounded-[1rem]" onZoomChange={onZoomChange} />
        {isAdmin && product.inativo && (
          <span className="absolute right-2 top-2 z-[20] rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-sm">
            Inativado
          </span>
        )}
        {onEdit && (
          <button onClick={() => onEdit(product)} className="mobile-touch-pop absolute top-2 left-2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 transition-[transform,background-color] duration-300 z-[20] sm:hover:scale-110 active:scale-95" title="Editar produto">
            <Pencil className={`w-3 h-3 sm:w-4 sm:h-4 ${colors.textGoldDark}`} />
          </button>
        )}
      </div>

      <div className="flex min-h-9 sm:min-h-11 justify-center w-full gap-2 mb-3 sm:mb-4 shrink-0">
        {product.images.slice(1, 4).map((img, idx) => (
          <div
            key={`${img}-${idx}`}
            className={`mobile-touch-pop w-9 sm:w-11 aspect-square rounded-full overflow-hidden cursor-pointer border transition-[transform,opacity,border-color] duration-300 shrink-0 active:-translate-y-0.5 bg-[#FAF8F4] ${
              mainImg === img
                ? colors.borderGold
                : 'border-[#E8E0D3] sm:hover:border-gray-300 opacity-100 sm:opacity-70 sm:hover:opacity-100 sm:hover:-translate-y-0.5'
            }`}
            onClick={() => setMainImg(img)}
          >
            <img src={img} alt={`Detalhe ${idx + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center flex-grow w-full relative z-10 bg-white">
        <span className="text-[9px] sm:text-[10px] font-semibold text-[#8F6720] sm:text-gray-400 uppercase tracking-[0.18em] mb-1 w-full text-center line-clamp-1 transition-colors sm:group-hover:text-[#8F6720]">
          {product.category}
        </span>
        <h3 className={`font-medium ${colors.textNavy} text-[13px] sm:text-sm text-center leading-tight flex-grow flex items-center justify-center min-h-[40px] sm:min-h-[42px] line-clamp-2`}>
          {product.name}
        </h3>
        <p className={`${colors.textGoldDark} text-base sm:text-lg font-semibold mt-1 sm:mt-2`}>{product.price}</p>
        {isAdmin && product.inativo && (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-600">
            Produto inativado
          </p>
        )}
        <button
          onClick={() => {
            if (!isUnavailable) addToCart(product);
          }}
          disabled={isUnavailable}
          className="mobile-touch-pop mt-auto w-full min-h-10 shrink-0 rounded-full border border-[#B88A2E]/35 bg-[#F7F2E8] text-sm font-semibold text-[#8F6720] shadow-sm transition-[transform,background-color,border-color,color,box-shadow] duration-300 hover:border-[#B88A2E]/55 hover:bg-[#EFE6D4] hover:text-[#6F4A16] hover:shadow-md active:scale-95 sm:text-base disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:border-[#B88A2E]/35 disabled:hover:bg-[#F7F2E8] disabled:hover:text-[#8F6720] disabled:hover:shadow-sm"
        >
          {product.inativo ? 'Indisponível' : isUnavailable ? 'Sem Estoque' : 'Adicionar'}
        </button>
      </div>
    </div>
  );
}
