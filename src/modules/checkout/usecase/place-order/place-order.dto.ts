export interface PlaceOrderInputDto {
  clientId: string;
  products: {
    productId: string;
  }[];
}

export interface PlaceOrderOutputDto {
  id: string;
  total: number;
  invoice?: {
    id: string;
  };
  products: {
    productId: string;
  }[];
}
