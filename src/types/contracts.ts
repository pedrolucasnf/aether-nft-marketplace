export type BlockchainNetwork = 'Ethereum' | 'Polygon' | 'Arbitrum';

export type NftCategory =
  | 'Arte Digital'
  | 'Generativo'
  | 'Fotografia 3D'
  | 'Colecionáveis'
  | 'Música & Áudio';

export interface NftAttribute {
  trait: string;
  value: string;
  rarity: string;
}

export interface NftPricePoint {
  date: string;
  priceEth: string;
}

export interface NftItem {
  id: string;
  title: string;
  collection: string;
  creator: string;
  category: NftCategory;
  network: BlockchainNetwork;
  priceEth: string;
  totalEditions: number;
  availableEditions: number;
  likes: number;
  featured: boolean;
  version: number;
  createdAt: string;
  contractAddress: string;
  tokenStandard: 'ERC-721' | 'ERC-1155';
  royalties: string;
  description: string;
  attributes: NftAttribute[];
  priceHistory: NftPricePoint[];
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED';

export interface NftUpdatedSocketEvent {
  id: string;
  priceEth: string;
  availableEditions: number;
  version: number;
}

export interface OrderUpdatedSocketEvent {
  id: string;
  userId?: string;
  status: OrderStatus;
  version: number;
  txHash?: string;
  failureReason?: string;
}
