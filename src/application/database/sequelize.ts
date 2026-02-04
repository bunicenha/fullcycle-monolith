import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import { InvoiceModel } from "../../modules/invoice/repository/item.model";
import { InvoiceItemModel } from "../../modules/invoice/repository/invoiceItem.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";

let sequelize: Sequelize;

export async function initDatabase(): Promise<Sequelize> {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
    sync: { force: true },
  });

  sequelize.addModels([
    ClientModel,
    ProductModel,
    InvoiceModel,
    InvoiceItemModel,
    TransactionModel,
  ]);

  await sequelize.sync();

  return sequelize;
}

export function getSequelize(): Sequelize {
  return sequelize;
}

export async function closeDatabase(): Promise<void> {
  if (sequelize) {
    await sequelize.close();
  }
}
