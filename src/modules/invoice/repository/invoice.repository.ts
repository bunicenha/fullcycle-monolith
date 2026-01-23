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
    })
  }

  async find(id: string): Promise<Invoice> {

    const client = await InvoiceModel.findOne({ where: { id }, include: [InvoiceItemModel] })

    if (!client) {
      throw new Error("Client not found")
    }

    return new Invoice({
      id: new Id(client.id),
      name: client.name,
      document: client.document,
      address: new Address(
        client.street,
        client.number,
        client.complement,
        client.city,
        client.state,
        client.zipcode,
      ),
      items: client.items.map(item => new InvoiceItem({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
      })),
      createdAt: client.createdAt,
      updatedAt: client.createdAt
    })
  }
}