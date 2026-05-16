import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { CATEGORIES } from '../data/editorial';
import { fetchProductCatalogPage, fetchProducts } from '../services/products';
import { colors } from '../theme';
import type { PageResponse, Product } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { useStorefront } from '../context/StorefrontContext';
import { StorePagination } from '../components/layout/StorePagination';

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

const OTHER_CATEGORY = 'Outros';
const PRODUCTS_PAGE_SIZE = 12;

export function ProductsPage() {
  const [productPage, setProductPage] = useState<PageResponse<Product> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin, editProduct, productSearchTerm, productCategory, searchProducts, browseCategory } = useStorefront();

  useEffect(() => {
    setSearchTerm(productSearchTerm);
    setSelectedCategory(productCategory);
    setCurrentPage(0);
  }, [productSearchTerm, productCategory]);

  useEffect(() => {
    let ignore = false;
    const categoria = selectedCategory === 'Todos' ? undefined : selectedCategory;
    const normalizedSearch = normalizeText(searchTerm);

    setIsLoading(true);

    if (selectedCategory === 'Todos' && normalizedSearch) {
      fetchProducts()
        .then((allProducts) => {
          if (ignore) return;

          const matchingProducts = allProducts.filter((product) => {
            if (!isAdmin && product.inativo) return false;
            return normalizeText(product.name).includes(normalizedSearch) || normalizeText(product.category).includes(normalizedSearch);
          });
          const pageStart = currentPage * PRODUCTS_PAGE_SIZE;
          const content = matchingProducts.slice(pageStart, pageStart + PRODUCTS_PAGE_SIZE);

          setProductPage({
            content,
            totalElements: matchingProducts.length,
            totalPages: Math.ceil(matchingProducts.length / PRODUCTS_PAGE_SIZE),
            number: currentPage,
            size: PRODUCTS_PAGE_SIZE,
          });
        })
        .catch((error) => {
          console.error(error);
          if (!ignore) setProductPage(null);
        })
        .finally(() => {
          if (!ignore) setIsLoading(false);
        });

      return () => {
        ignore = true;
      };
    }

    if (selectedCategory === OTHER_CATEGORY) {
      const mainCategories = new Set(CATEGORIES.filter((category) => category !== 'Todos').map(normalizeText));

      fetchProducts()
        .then((allProducts) => {
          if (ignore) return;

          const otherProducts = allProducts.filter((product) => {
            if (!isAdmin && product.inativo) return false;
            return !mainCategories.has(normalizeText(product.category));
          });
          const pageStart = currentPage * PRODUCTS_PAGE_SIZE;
          const content = otherProducts.slice(pageStart, pageStart + PRODUCTS_PAGE_SIZE);

          setProductPage({
            content,
            totalElements: otherProducts.length,
            totalPages: Math.ceil(otherProducts.length / PRODUCTS_PAGE_SIZE),
            number: currentPage,
            size: PRODUCTS_PAGE_SIZE,
          });
        })
        .catch((error) => {
          console.error(error);
          if (!ignore) setProductPage(null);
        })
        .finally(() => {
          if (!ignore) setIsLoading(false);
        });

      return () => {
        ignore = true;
      };
    }

    fetchProductCatalogPage({
      page: currentPage,
      name: undefined,
      categoria,
    })
      .then((page) => {
        if (!ignore) setProductPage(page);
      })
      .catch((error) => {
        console.error(error);
        if (!ignore) setProductPage(null);
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [currentPage, isAdmin, searchTerm, selectedCategory]);

  const categoryOptions = useMemo(() => {
    return [...CATEGORIES, OTHER_CATEGORY];
  }, []);

  const products = useMemo(
    () => (productPage?.content || []).filter((product) => isAdmin || !product.inativo),
    [isAdmin, productPage],
  );
  const totalPages = productPage?.totalPages || 0;
  const pageNumber = productPage?.number ?? currentPage;
  const hasPreviousPage = pageNumber > 0;
  const hasNextPage = totalPages > 0 && pageNumber < totalPages - 1;

  const handleCategoryChange = (category: string) => {
    browseCategory(category);
    setSelectedCategory(category);
    setSearchTerm('');
    setCurrentPage(0);
  };

  return (
    <div className="luxury-page animate-fadeIn" style={{ maxWidth: '96rem' }}>
      <div className="mb-6 text-center sm:text-left">
        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8F6720]">Catálogo</span>
        <h2 className={`mt-1 text-4xl font-serif ${colors.textNavy}`}>Nossas Joias</h2>
        <p className="text-gray-500 mt-2 leading-relaxed">Encontre a peça perfeita para realçar seu brilho.</p>
      </div>

      <div className="luxury-card rounded-3xl p-4 sm:p-6 mb-8">
        <div className="flex flex-wrap gap-2 pb-1">
          {categoryOptions.map((category) => (
            <button key={category} onClick={() => handleCategoryChange(category)} className={`shrink-0 px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold transition-colors border ${normalizeText(selectedCategory) === normalizeText(category) ? `bg-[#1F2428] text-white border-transparent` : `bg-white ${colors.textNavy} ${colors.borderLight} hover:bg-[#F7F2E8]`}`}>
              {category}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 luxury-card rounded-3xl text-gray-500">
          Carregando produtos...
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid [grid-template-columns:repeat(auto-fill,minmax(min(100%,9.5rem),1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(12rem,1fr))] xl:[grid-template-columns:repeat(auto-fill,minmax(13.5rem,1fr))] gap-3.5 sm:gap-6">
            {products.map((product, index) => <ProductCard key={product.id} product={product} index={index} onEdit={isAdmin ? editProduct : undefined} />)}
          </div>

          {totalPages > 1 && (
            <StorePagination
              page={pageNumber}
              totalPages={totalPages}
              isLoading={isLoading}
              onPrevious={() => {
                if (hasPreviousPage) setCurrentPage((page) => Math.max(0, page - 1));
              }}
              onNext={() => {
                if (hasNextPage) setCurrentPage((page) => page + 1);
              }}
            />
          )}
        </>
      ) : (
        <div className="text-center py-20 luxury-card rounded-3xl">
          <Search className={`w-12 h-12 ${colors.textGold} opacity-30 mx-auto mb-4`} />
          <h3 className={`text-lg font-medium ${colors.textNavy} mb-2`}>Nenhum produto encontrado</h3>
          <p className="text-gray-500">Tente buscar por outro termo ou alterar a categoria.</p>
          <button onClick={() => { searchProducts(''); setSearchTerm(''); setSelectedCategory('Todos'); setCurrentPage(0); }} className="mt-6 px-6 py-2.5 rounded-full bg-[#F7F2E8] text-[#8F6720] font-semibold hover:bg-[#EFE6D4] transition-colors">Limpar filtros</button>
        </div>
      )}
    </div>
  );
}
