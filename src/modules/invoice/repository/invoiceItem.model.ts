import { Column, Model, PrimaryKey, Table, ForeignKey } from "sequelize-typescript";
import { InvoiceModel } from "./item.model";

@Table({
  tableName: 'invoice_items',
  timestamps: false
})
export class InvoiceItemModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string

  @Column({ allowNull: false })
  name: string

  @Column({ allowNull: false })
  price: number

  @ForeignKey(() => InvoiceItemModel)
  @Column({ allowNull: false })
  invoiceId: string
}