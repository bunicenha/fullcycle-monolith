import Address from "../../@shared/domain/value-object/address"
import InvoiceItem from "../domain/invoiceItem"

export interface GenerateInvoiceFacadeInputDto {
  id: string
  name: string
  document: string
  address: Address
  items: InvoiceItem[]
}

export interface GenerateInvoiceFacadeOutputDto {
  id: string
  name: string
  document: string
  address: Address
  items: InvoiceItem[]
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
  address: Address
  items: InvoiceItem[]
  createdAt: Date
  updatedAt: Date
}

export default interface InvoiceFacadeInterface {
  generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto>;
  find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto>;
}
