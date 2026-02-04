import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";
import CheckoutFacadeInterface, { PlaceOrderInputDto, PlaceOrderOutputDto } from "./checkout.facade.interface";

export default class CheckoutFacade implements CheckoutFacadeInterface {
  private readonly _placeOrderUseCase: PlaceOrderUseCase;

  constructor(placeOrderUseCase: PlaceOrderUseCase) {
    this._placeOrderUseCase = placeOrderUseCase;
  }

  async placeOrder(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    return this._placeOrderUseCase.execute(input);
  }
}