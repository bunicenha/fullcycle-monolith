import Address from "../../../@shared/domain/value-object/address"
import Id from "../../../@shared/domain/value-object/id.value-object"
import Invoice from "../../domain/invoice"
import InvoiceItem from "../../domain/invoiceItem"
import InvoiceGateway from "../../gateway/invoice.gateway"
import { GenerateInvoiceInputDto, GenerateInvoiceOutputDto } from "./generate-invoice.dto"

export default class GenerateInvoiceUseCase {

    private _invoiceRepository: InvoiceGateway
  
    constructor(invoiceRepository: InvoiceGateway) {
      this._invoiceRepository = invoiceRepository
    }
  
    async execute(input: GenerateInvoiceInputDto): Promise<GenerateInvoiceOutputDto> {
        const invoice = new Invoice({
            id: new Id(input.id) || new Id(),
            name: input.name,
            document: input.document,
            address: new Address(
                input.address.street,
                input.address.number,
                input.address.complement,
                input.address.city,
                input.address.state,
                input.address.zipCode,
            ),
            items: input.items.map(item => new InvoiceItem({
                id: new Id(item.id),
                name: item.name,
                price: item.price,
            })),
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        
        await this._invoiceRepository.generate(invoice)

        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            address: {
                street: invoice.address.street,
                number: invoice.address.number,
                complement: invoice.address.complement,
                city: invoice.address.city,
                state: invoice.address.state,
                zipCode: invoice.address.zipCode,
            },
            items: invoice.items.map(item => ({
                id: item.id.id,
                name: item.name,
                price: item.price,
            })),
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
        }
    }
}