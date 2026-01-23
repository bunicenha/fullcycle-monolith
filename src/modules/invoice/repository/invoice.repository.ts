import Address from "../../@shared/domain/value-object/address"
import Id from "../../@shared/domain/value-object/id.value-object"
import Invoice from "../domain/invoice"
import InvoiceItem from "../domain/invoiceItem"
import InvoiceGateway from "../gateway/invoice.gateway"
import { InvoiceItemModel } from "./invoiceItem.model"
import { InvoiceModel } from "./item.model"

export default class InvoiceRepository implements InvoiceGateway {

  async generate(entity: Invoice): Promise<void> {

    await InvoiceModel.create({
      id: entity.id.id,
      name: entity.name,
      document: entity.document,
      street: entity.address.street,
      number: entity.address.number,
      complement: entity.address.complement,
      city: entity.address.city,
      state: entity.address.state,
      zipcode: entity.address.zipCode,
      items: entity.items.map(item => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
        invoiceId: entity.id.id,
      })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    }, {
      include: [InvoiceItemModel]
    })
  }

  async find(id: string): Promise<Invoice> {

    const invoice = await InvoiceModel.findOne({ where: { id }, include: [InvoiceItemModel] })

    if (!invoice) {
      throw new Error("Invoice not found")
    }

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address(
        invoice.street,
        invoice.number,
        invoice.complement,
        invoice.city,
        invoice.state,
        invoice.zipcode,
      ),
      items: invoice.items.map(item => new InvoiceItem({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
      })),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt
    })
  }
}