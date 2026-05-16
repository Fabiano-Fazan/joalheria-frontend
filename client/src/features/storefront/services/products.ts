import { mapProductDTO } from '../lib/product';
import type { PageResponse, Product, ProductDTO, ProdutoRequestDTO } from '../types';
import { apiRequest, jsonHeaders } from './http';

const CATALOG_PAGE_SIZE = 12;
const PRODUCT_LIST_SORT = 'dataCriacao,asc';

type ProductPageParams = {
  page?: number;
  size?: number;
  name?: string;
  categoria?: string;
};

async function fetchProductsDTOPage({
  page = 0,
  size,
  name,
  categoria,
}: ProductPageParams = {}) {
  const trimmedName = name?.trim();
  const trimmedCategory = categoria?.trim();
  const path = trimmedCategory ? '/produtos/categoria' : trimmedName ? '/produtos/nome' : '/produtos';

  return apiRequest<PageResponse<ProductDTO>>(path, {
    query: {
      page,
      size,
      sort: PRODUCT_LIST_SORT,
      name: trimmedCategory ? undefined : trimmedName,
      categoria: trimmedCategory,
    },
  });
}

export async function fetchProducts(): Promise<Product[]> {
  const firstPage = await fetchProductsDTOPage({ size: 50 }); // Fetch a reasonable amount initially
  return (firstPage.content || []).map(mapProductDTO);
}

export async function fetchProductCatalogPage(params: ProductPageParams = {}): Promise<PageResponse<Product>> {
  const page = await fetchProductsDTOPage({
    size: CATALOG_PAGE_SIZE,
    ...params,
  });

  return {
    ...page,
    content: (page.content || []).map(mapProductDTO),
  };
}

export async function fetchHighlights(): Promise<Product[]> {
  const data = await apiRequest<ProductDTO[]>('/produtos/destaques');
  return data.map(mapProductDTO);
}

export async function createProduct(input: {
  product: ProdutoRequestDTO;
  images: File[];
  mainImageIndex: number;
}): Promise<Product> {
  const formData = createProductFormData(input.product, input.images, input.mainImageIndex);

  const response = await apiRequest<ProductDTO>('/produtos', {
    method: 'POST',
    body: formData,
  });

  return mapProductDTO(response);
}

export async function updateProduct(id: string, product: ProdutoRequestDTO): Promise<Product> {
  const response = await apiRequest<ProductDTO>(`/produtos/${id}`, {
    method: 'PUT',
    headers: jsonHeaders(),
    body: JSON.stringify(product),
  });

  return mapProductDTO(response);
}

function createProductFormData(product: ProdutoRequestDTO, images: File[], mainImageIndex: number) {
  const formData = new FormData();

  formData.append(
    'produto',
    new Blob([JSON.stringify(product)], {
      type: 'application/json',
    }),
  );

  images.forEach((image) => {
    formData.append('imagens', image, image.name);
  });

  formData.append('imagemPrincipalIndex', String(mainImageIndex));

  return formData;
}
