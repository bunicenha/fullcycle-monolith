import Address from "../../@shared/domain/value-object/address"

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
  

export default interface CheckoutFacadeInterface {
  placeOrder(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto>;
}
