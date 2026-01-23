import { Sequelize } from "sequelize-typescript"
import { InvoiceModel } from "./item.model"
import { InvoiceItemModel } from "./invoiceItem.model"
import InvoiceRepository from "./invoice.repository"
import Invoice from "../domain/invoice"
import Id from "../../@shared/domain/value-object/id.value-object"
import Address from "../../@shared/domain/value-object/address"
import InvoiceItem from "../domain/invoiceItem"

describe("Invoice Repository test", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([InvoiceModel, InvoiceItemModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should generate an invoice", async () => {

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "12345678900",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      ),
      items: [
        new InvoiceItem({
          id: new Id("1"),
          name: "Product 1",
          price: 100,
        }),
        new InvoiceItem({
          id: new Id("2"),
          name: "Product 2",
          price: 200,
        })
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const repository = new InvoiceRepository()
    await repository.generate(invoice)

    const invoiceDb = await InvoiceModel.findOne({ where: { id: "1" }, include: [InvoiceItemModel] })

    expect(invoiceDb).toBeDefined()
    expect(invoiceDb.id).toEqual(invoice.id.id)
    expect(invoiceDb.name).toEqual(invoice.name)
    expect(invoiceDb.document).toEqual(invoice.document)
    expect(invoiceDb.street).toEqual(invoice.address.street)
    expect(invoiceDb.number).toEqual(invoice.address.number)
    expect(invoiceDb.complement).toEqual(invoice.address.complement)
    expect(invoiceDb.city).toEqual(invoice.address.city)
    expect(invoiceDb.state).toEqual(invoice.address.state)
    expect(invoiceDb.zipcode).toEqual(invoice.address.zipCode)
    expect(invoiceDb.items).toHaveLength(2)
    expect(invoiceDb.items[0].id).toBe("1")
    expect(invoiceDb.items[0].name).toBe("Product 1")
    expect(invoiceDb.items[0].price).toBe(100)
    expect(invoiceDb.items[1].id).toBe("2")
    expect(invoiceDb.items[1].name).toBe("Product 2")
    expect(invoiceDb.items[1].price).toBe(200)
    expect(invoiceDb.createdAt).toStrictEqual(invoice.createdAt)
    expect(invoiceDb.updatedAt).toStrictEqual(invoice.updatedAt)
  })

  it("should find an invoice", async () => {

    const createdAt = new Date()
    const updatedAt = new Date()

    const invoice = await InvoiceModel.create({
      id: '1',
      name: 'Invoice 1',
      document: "12345678900",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipcode: "88888-888",
      createdAt: createdAt,
      updatedAt: updatedAt,
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 100,
          invoiceId: "1",
        },
        {
          id: "2",
          name: "Product 2",
          price: 200,
          invoiceId: "1",
        }
      ]
    }, {
      include: [InvoiceItemModel]
    })

    const repository = new InvoiceRepository()
    const result = await repository.find(invoice.id)

    const invoiceReloaded = await InvoiceModel.findOne({ where: { id: invoice.id }, include: [InvoiceItemModel] })

    expect(result.id.id).toEqual(invoice.id)
    expect(result.name).toEqual(invoice.name)
    expect(result.document).toEqual(invoice.document)
    expect(result.address.street).toEqual(invoice.street)
    expect(result.address.number).toEqual(invoice.number)
    expect(result.address.complement).toEqual(invoice.complement)
    expect(result.address.city).toEqual(invoice.city)
    expect(result.address.state).toEqual(invoice.state)
    expect(result.address.zipCode).toEqual(invoice.zipcode)
    expect(result.items).toHaveLength(2)
    expect(result.items[0].id.id).toBe("1")
    expect(result.items[0].name).toBe("Product 1")
    expect(result.items[0].price).toBe(100)
    expect(result.items[1].id.id).toBe("2")
    expect(result.items[1].name).toBe("Product 2")
    expect(result.items[1].price).toBe(200)
    expect(Math.abs(result.createdAt.getTime() - invoiceReloaded.createdAt.getTime())).toBeLessThan(10)
    expect(Math.abs(result.updatedAt.getTime() - invoiceReloaded.updatedAt.getTime())).toBeLessThan(10)
  })
})
