import { Sequelize } from "sequelize-typescript"
import { InvoiceModel } from "../repository/item.model"
import { InvoiceItemModel } from "../repository/invoiceItem.model"
import InvoiceRepository from "../repository/invoice.repository"
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase"
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase"
import InvoiceFacade from "./invoice.facade"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"

describe("Invoice Facade test", () => {

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

    const repository = new InvoiceRepository()
    const generateUsecase = new GenerateInvoiceUseCase(repository)
    const facade = new InvoiceFacade({
      generateUsecase: generateUsecase,
      findUsecase: undefined,
    })

    const input = {
      id: "1",
      name: "Invoice 1",
      document: "12345678900",
      address: {
        street: "Rua 123",
        number: "99",
        complement: "Casa Verde",
        city: "Criciúma",
        state: "SC",
        zipCode: "88888-888",
      },
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 100,
        },
        {
          id: "2",
          name: "Product 2",
          price: 200,
        }
      ]
    }

    const result = await facade.generate(input)

    expect(result).toBeDefined()
    expect(result.id).toBe(input.id)
    expect(result.name).toBe(input.name)
    expect(result.document).toBe(input.document)
    expect(result.address.street).toBe(input.address.street)
    expect(result.address.number).toBe(input.address.number)
    expect(result.address.complement).toBe(input.address.complement)
    expect(result.address.city).toBe(input.address.city)
    expect(result.address.state).toBe(input.address.state)
    expect(result.address.zipCode).toBe(input.address.zipCode)
    expect(result.items).toHaveLength(2)
    expect(result.items[0].id).toBe("1")
    expect(result.items[0].name).toBe("Product 1")
    expect(result.items[0].price).toBe(100)
    expect(result.items[1].id).toBe("2")
    expect(result.items[1].name).toBe("Product 2")
    expect(result.items[1].price).toBe(200)
    expect(result.createdAt).toBeDefined()
    expect(result.updatedAt).toBeDefined()

    const invoice = await InvoiceModel.findOne({ where: { id: "1" }, include: [InvoiceItemModel] })

    expect(invoice).toBeDefined()
    expect(invoice.id).toBe(input.id)
    expect(invoice.name).toBe(input.name)
    expect(invoice.document).toBe(input.document)
    expect(invoice.street).toBe(input.address.street)
    expect(invoice.items).toHaveLength(2)
  })

  it("should find an invoice", async () => {

    const facade = InvoiceFacadeFactory.create()

    const input = {
      id: "1",
      name: "Invoice 1",
      document: "12345678900",
      address: {
        street: "Rua 123",
        number: "99",
        complement: "Casa Verde",
        city: "Criciúma",
        state: "SC",
        zipCode: "88888-888",
      },
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 100,
        },
        {
          id: "2",
          name: "Product 2",
          price: 200,
        }
      ]
    }

    await facade.generate(input)

    const result = await facade.find({ id: "1" })

    expect(result).toBeDefined()
    expect(result.id).toBe(input.id)
    expect(result.name).toBe(input.name)
    expect(result.document).toBe(input.document)
    expect(result.address.street).toBe(input.address.street)
    expect(result.address.number).toBe(input.address.number)
    expect(result.address.complement).toBe(input.address.complement)
    expect(result.address.city).toBe(input.address.city)
    expect(result.address.state).toBe(input.address.state)
    expect(result.address.zipCode).toBe(input.address.zipCode)
    expect(result.items).toHaveLength(2)
    expect(result.items[0].id).toBe("1")
    expect(result.items[0].name).toBe("Product 1")
    expect(result.items[0].price).toBe(100)
    expect(result.items[1].id).toBe("2")
    expect(result.items[1].name).toBe("Product 2")
    expect(result.items[1].price).toBe(200)
    expect(result.createdAt).toBeDefined()
    expect(result.updatedAt).toBeDefined()
  })
})
