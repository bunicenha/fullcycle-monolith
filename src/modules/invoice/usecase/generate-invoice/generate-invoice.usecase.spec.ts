import Address from "../../../@shared/domain/value-object/address"
import GenerateInvoiceUseCase from "./generate-invoice.usecase"

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn()
  }
}

describe("Generate Invoice use case unit test", () => {

  it("should generate an invoice", async () => {

    const repository = MockRepository()
    const usecase = new GenerateInvoiceUseCase(repository)

    const input = {
      id: "1",
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

    const result = await usecase.execute(input)

    expect(repository.generate).toHaveBeenCalled()
    expect(result.id).toBeDefined()
    expect(result.id).toBe(input.id)
    expect(result.name).toEqual(input.name)
    expect(result.document).toEqual(input.document)
    expect(result.address.street).toEqual(input.address.street)
    expect(result.address.number).toEqual(input.address.number)
    expect(result.address.complement).toEqual(input.address.complement)
    expect(result.address.city).toEqual(input.address.city)
    expect(result.address.state).toEqual(input.address.state)
    expect(result.address.zipCode).toEqual(input.address.zipCode)
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
