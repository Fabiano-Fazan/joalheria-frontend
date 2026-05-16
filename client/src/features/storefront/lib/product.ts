import { EDITORIAL_ASSETS } from '../data/editorial';
import type { Product, ProductDTO } from '../types';

export const formatCurrency = (value: number) =>
  `R$ ${value.toFixed(2).replace('.', ',')}`;

export const mapProductDTO = (dto: ProductDTO): Product => {
  const inativo = Boolean(dto.inativo);

  return {
    id: dto.id,
    name: dto.nome,
    descricao: dto.descricao,
    category: dto.categoria,
    cor: dto.cor,
    price: formatCurrency(dto.preco),
    numPrice: dto.preco,
    stock: dto.quantidade,
    inativo,
    disponivel: !inativo,
    destaque: dto.destaque,
    images: dto.imagens?.length
      ? [...dto.imagens]
          .sort((a, b) => Number(Boolean(b.imagemPrincipal)) - Number(Boolean(a.imagemPrincipal)))
          .map((image) => image.imagemUrl)
      : [EDITORIAL_ASSETS.productDisplay],
  };
};
