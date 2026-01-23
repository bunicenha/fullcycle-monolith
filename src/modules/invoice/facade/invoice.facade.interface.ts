type InvoiceItemDto = {
  id: string
  name: string
  price: number
}

type AddressDto = {
  street: string
  number: string
  complement: string
  city: string
  state: string
  zipCode: string
}

export interface GenerateInvoiceFacadeInputDto {
  id: string
  name: string
  document: string
  address: AddressDto
  items: InvoiceItemDto[]
}

export interface GenerateInvoiceFacadeOutputDto {
  id: string
  name: string
  document: string
  address: AddressDto
  items: InvoiceItemDto[]
  createdAt: Date
  updatedAt: Date
}

export interface FindInvoiceFacadeInputDto {
  id: string
}

export interface FindInvoiceFacadeOutputDto {
  id: string
  name: string
  document: string
  address: AddressDto
  items: InvoiceItemDto[]
  createdAt: Date
  updatedAt: Date
}

export default interface InvoiceFacadeInterface {
  generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto>;
  find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto>;
}
