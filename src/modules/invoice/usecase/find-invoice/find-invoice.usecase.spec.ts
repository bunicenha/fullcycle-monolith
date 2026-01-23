import Address from "../../../@shared/domain/value-object/address"
import Id from "../../../@shared/domain/value-object/id.value-object"
import Invoice from "../../domain/invoice"
import InvoiceItem from "../../domain/invoiceItem"
import FindInvoiceUseCase from "./find-invoice.usecase"

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
    "88888-888",
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

const MockRepository = () => {

  return {
    generate: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice))
  }
}

describe("Find Invoice use case unit test", () => {

  it("should find an invoice", async () => {

    const repository = MockRepository()
    const usecase = new FindInvoiceUseCase(repository)

    const input = {
      id: "1"
    }

    const result = await usecase.execute(input)

    expect(repository.find).toHaveBeenCalled()
    expect(result.id).toEqual(input.id)
    expect(result.name).toEqual(invoice.name)
    expect(result.document).toEqual(invoice.document)
    expect(result.address.street).toEqual(invoice.address.street)
    expect(result.address.number).toEqual(invoice.address.number)
    expect(result.address.complement).toEqual(invoice.address.complement)
    expect(result.address.city).toEqual(invoice.address.city)
    expect(result.address.state).toEqual(invoice.address.state)
    expect(result.address.zipCode).toEqual(invoice.address.zipCode)
    expect(result.items).toHaveLength(2)
    expect(result.items[0].id).toBe("1")
    expect(result.items[0].name).toBe("Product 1")
    expect(result.items[0].price).toBe(100)
    expect(result.items[1].id).toBe("2")
    expect(result.items[1].name).toBe("Product 2")
    expect(result.items[1].price).toBe(200)
    expect(result.createdAt).toEqual(invoice.createdAt)
    expect(result.updatedAt).toEqual(invoice.updatedAt)
  })
})
