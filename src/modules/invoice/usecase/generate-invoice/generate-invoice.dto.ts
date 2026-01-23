type InvoiceItem = {
  id: string;
  name: string;
  price: number;
}

type Address = {
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
}

export type GenerateInvoiceInputDto = {
  id: string;
  name: string;
  document: string;
  address: Address;
  items: InvoiceItem[];
}

export type GenerateInvoiceOutputDto = {
  id: string;
  name: string;
  document: string;
  address: Address;
  items: InvoiceItem[];
  createdAt: Date;
  updatedAt: Date;
}