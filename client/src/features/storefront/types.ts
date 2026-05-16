export type StoreView =
  | 'home'
  | 'products'
  | 'cart'
  | 'dashboard'
  | 'add_product'
  | 'edit_product'
  | 'inventory'
  | 'orders'
  | 'my_orders'
  | 'my_account';

export type StoreUser = {
  name?: string;
  email?: string;
  picture?: string;
  role?: string;
};

export type AuthMeResponse =
  | {
      authenticated: false;
    }
  | {
      authenticated: true;
      name?: string;
      email?: string;
      picture?: string;
      role: 'ROLE_ADMIN' | 'ROLE_CLIENTE' | string;
    };

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

export type ProductImageDTO = {
  id?: string;
  imagemUrl: string;
  imagemPrincipal?: boolean;
};

export type ProductDTO = {
  id: string;
  nome: string;
  descricao?: string;
  categoria: string;
  cor?: string;
  preco: number;
  quantidade: number;
  inativo?: boolean;
  disponivel?: boolean;
  destaque?: boolean;
  imagens?: ProductImageDTO[];
};

export type Product = {
  id: string;
  name: string;
  descricao?: string;
  category: string;
  cor?: string;
  price: string;
  numPrice: number;
  stock: number;
  inativo?: boolean;
  disponivel?: boolean;
  destaque?: boolean;
  images: string[];
};

export type CartItem = Product & {
  quantity: number;
};

export type ProdutoRequestDTO = {
  nome: string;
  descricao: string;
  cor: string;
  categoria: string;
  preco: number;
  quantidade: number;
  destaque: boolean;
  inativo: boolean;
};

export type ItemPedidoRequestDTO = {
  produtoId: string;
  quantidade: number;
  produtoNome: string;
  preco: number;
};

export type PedidoRequestDTO = {
  itens: ItemPedidoRequestDTO[];
  observacoes?: string;
};

export type PedidoResponseDTO = {
  id: string;
  dataPedido?: string;
  observacoes?: string;
  valorTotal?: number;
  status?: string;
  linkWhatsapp?: string;
  cliente?: ClienteResponseDTO;
  itens?: ItemPedidoResponseDTO[];
};

export type ItemPedidoResponseDTO = {
  id: string;
  nomeProduto: string;
  quantidade: number;
  preco: number;
};

export type ClienteResponseDTO = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  dataCadastro: string;
};

export type ClienteRequestDTO = {
  telefone: string;
  endereco: string;
};

export type EstoqueTipo = 'ENTRADA' | 'SAIDA';

export type EstoqueRequestDTO = {
  quantidade: number;
  preco: number;
  tipo: EstoqueTipo;
};

export type ProdutoMaisVendidoDTO = {
  nomeProduto: string;
  TotalVendido: number | string;
};
