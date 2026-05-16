import type { ProductDTO } from '../types';

export const EDITORIAL_ASSETS = {
  hero: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663631301361/ebAdcqtwRKH8FcqLKurHyU/yara-hero-editorial-MVRJ438ygCyfNywNnYhJNT.webp',
  collection: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663631301361/ebAdcqtwRKH8FcqLKurHyU/yara-collection-spring-4Wo2fsxeKBD9zg9NjWKeiX.webp',
  productDisplay: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663631301361/ebAdcqtwRKH8FcqLKurHyU/yara-product-display-A2DpSvKwt5WRrMn467zrdL.webp',
  gift: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663631301361/ebAdcqtwRKH8FcqLKurHyU/yara-packaging-gift-EtAQ6AYDyBVZpGE645NWaF.webp',
};

export const FALLBACK_IMAGES = [
  EDITORIAL_ASSETS.productDisplay,
  EDITORIAL_ASSETS.collection,
  EDITORIAL_ASSETS.gift,
  EDITORIAL_ASSETS.hero,
];

export const FALLBACK_PRODUCTS: ProductDTO[] = [
  { id: '1', nome: 'Colar Elegance Gota', categoria: 'Colares', preco: 149.9, quantidade: 15, imagens: FALLBACK_IMAGES.map((url, index) => ({ imagemUrl: url, imagemPrincipal: index === 0 })) },
  { id: '2', nome: 'Brinco Argola Cravejada', categoria: 'Brincos', preco: 89.9, quantidade: 8, imagens: FALLBACK_IMAGES.map((url, index) => ({ imagemUrl: url, imagemPrincipal: index === 0 })) },
  { id: '3', nome: 'Anel Solitário Ouro', categoria: 'Anéis', preco: 129.9, quantidade: 0, imagens: FALLBACK_IMAGES.map((url, index) => ({ imagemUrl: url, imagemPrincipal: index === 0 })) },
  { id: '4', nome: 'Pulseira Riviera Prata', categoria: 'Pulseiras', preco: 199.9, quantidade: 5, imagens: FALLBACK_IMAGES.map((url, index) => ({ imagemUrl: url, imagemPrincipal: index === 0 })) },
];

export const CATEGORIES = ['Todos', 'Colares', 'Brincos', 'Anéis', 'Pulseiras'];

export const HERO_SLIDES = [
  {
    title: 'Brilhe com <br/>sua essência',
    desc: 'Semijoias que traduzem sua beleza e elegância.',
    btn: 'VER COLEÇÃO',
    image: EDITORIAL_ASSETS.hero,
    eyebrow: 'Boutique autoral',
  },
  {
    title: 'Coleção <br/> Exclusiva',
    desc: 'Peças exclusivas com banho em ouro 18k.',
    btn: 'COMPRAR AGORA',
    image: EDITORIAL_ASSETS.collection,
    eyebrow: 'Banho em ouro 18k',
  },
];
