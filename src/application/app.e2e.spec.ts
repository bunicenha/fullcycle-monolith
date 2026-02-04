import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { Express } from "express";
import { createApp } from "./app";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import { ProductModel } from "../modules/product-adm/repository/product.model";
import { InvoiceModel } from "../modules/invoice/repository/item.model";
import { InvoiceItemModel } from "../modules/invoice/repository/invoiceItem.model";
import TransactionModel from "../modules/payment/repository/transaction.model";

describe("Application E2E Tests", () => {
  let app: Express;
  let sequelize: Sequelize;

  beforeAll(async () => {
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

    app = createApp();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("Health Check", () => {
    it("should return status ok", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: "ok" });
    });
  });

  describe("Product Routes", () => {
    it("should create a product", async () => {
      const productData = {
        id: "product-1",
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 100,
        salesPrice: 150,
        stock: 10,
      };

      const response = await request(app)
        .post("/products")
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Product created successfully");
      expect(response.body.product.id).toBe(productData.id);
      expect(response.body.product.name).toBe(productData.name);
      expect(response.body.product.description).toBe(productData.description);
      expect(response.body.product.purchasePrice).toBe(productData.purchasePrice);
      expect(response.body.product.salesPrice).toBe(productData.salesPrice);
      expect(response.body.product.stock).toBe(productData.stock);
    });

    it("should create a product without explicit id", async () => {
      const productData = {
        name: "Product Auto ID",
        description: "Product with auto-generated ID",
        purchasePrice: 50,
        salesPrice: 75,
        stock: 5,
      };

      const response = await request(app)
        .post("/products")
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Product created successfully");
      expect(response.body.product.id).toBeDefined();
      expect(response.body.product.name).toBe(productData.name);
    });

    it("should create a product with salesPrice defaulting to purchasePrice in database", async () => {
      const productData = {
        id: "product-default-price",
        name: "Product Default Price",
        description: "Product without explicit salesPrice",
        purchasePrice: 200,
        stock: 15,
      };

      const response = await request(app)
        .post("/products")
        .send(productData);

      expect(response.status).toBe(201);
      
      // Verify the product was saved with salesPrice defaulting to purchasePrice
      const savedProduct = await ProductModel.findOne({ where: { id: productData.id } });
      expect(savedProduct).toBeDefined();
      expect(savedProduct!.salesPrice).toBe(productData.purchasePrice);
    });
  });

  describe("Client Routes", () => {
    it("should create a client", async () => {
      const clientData = {
        id: "client-1",
        name: "John Doe",
        email: "john.doe@example.com",
        document: "12345678900",
        address: {
          street: "Main Street",
          number: "100",
          complement: "Apt 1",
          city: "New York",
          state: "NY",
          zipCode: "10001",
        },
      };

      const response = await request(app)
        .post("/clients")
        .send(clientData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Client created successfully");
      expect(response.body.client.id).toBe(clientData.id);
      expect(response.body.client.name).toBe(clientData.name);
      expect(response.body.client.email).toBe(clientData.email);
      expect(response.body.client.document).toBe(clientData.document);
      expect(response.body.client.address.street).toBe(clientData.address.street);
      expect(response.body.client.address.city).toBe(clientData.address.city);
    });

    it("should return error when creating client with invalid address", async () => {
      const clientData = {
        id: "client-invalid",
        name: "Jane Doe",
        email: "jane.doe@example.com",
        document: "98765432100",
        address: {
          street: "Main Street",
          // Missing required fields
        },
      };

      const response = await request(app)
        .post("/clients")
        .send(clientData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe("Checkout Routes", () => {
    beforeEach(async () => {
      // Clean up tables for fresh checkout tests
      await InvoiceItemModel.destroy({ where: {} });
      await InvoiceModel.destroy({ where: {} });
      await TransactionModel.destroy({ where: {} });
    });

    it("should place an order successfully with approved payment", async () => {
      // Create a client for checkout
      const clientId = "checkout-client-1";
      await ClientModel.create({
        id: clientId,
        name: "Checkout Client",
        email: "checkout@example.com",
        document: "11122233344",
        street: "Checkout Street",
        number: "200",
        complement: "Suite 1",
        city: "Los Angeles",
        state: "CA",
        zipcode: "90001",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create products with sufficient stock and high price for approved payment
      const product1Id = "checkout-product-1";
      const product2Id = "checkout-product-2";

      await ProductModel.create({
        id: product1Id,
        name: "Checkout Product 1",
        description: "Checkout product 1 description",
        purchasePrice: 50,
        salesPrice: 75,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await ProductModel.create({
        id: product2Id,
        name: "Checkout Product 2",
        description: "Checkout product 2 description",
        purchasePrice: 30,
        salesPrice: 45,
        stock: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const checkoutData = {
        clientId,
        products: [
          { productId: product1Id },
          { productId: product2Id },
        ],
      };

      const response = await request(app)
        .post("/checkout")
        .send(checkoutData);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.total).toBe(120); // 75 + 45
      expect(response.body.products).toHaveLength(2);
      expect(response.body.products[0].productId).toBe(product1Id);
      expect(response.body.products[1].productId).toBe(product2Id);
      // Payment approved since total >= 100
      expect(response.body.invoice).toBeDefined();
      expect(response.body.invoice.id).toBeDefined();
    });

    it("should place an order with declined payment (total < 100)", async () => {
      // Create a client for checkout
      const clientId = "checkout-client-2";
      await ClientModel.create({
        id: clientId,
        name: "Checkout Client 2",
        email: "checkout2@example.com",
        document: "55566677788",
        street: "Budget Street",
        number: "50",
        complement: "",
        city: "Chicago",
        state: "IL",
        zipcode: "60601",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create a low-priced product
      const productId = "checkout-product-low";
      await ProductModel.create({
        id: productId,
        name: "Low Price Product",
        description: "A product with low price",
        purchasePrice: 20,
        salesPrice: 30,
        stock: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const checkoutData = {
        clientId,
        products: [{ productId }],
      };

      const response = await request(app)
        .post("/checkout")
        .send(checkoutData);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.total).toBe(30);
      expect(response.body.products).toHaveLength(1);
      // Payment declined since total < 100, so no invoice
      expect(response.body.invoice).toBeUndefined();
    });

    it("should return error when client not found", async () => {
      const checkoutData = {
        clientId: "non-existent-client",
        products: [{ productId: "some-product" }],
      };

      const response = await request(app)
        .post("/checkout")
        .send(checkoutData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it("should return error when no products selected", async () => {
      const clientId = "checkout-client-no-products";
      await ClientModel.create({
        id: clientId,
        name: "No Products Client",
        email: "noproducts@example.com",
        document: "99988877766",
        street: "Empty Street",
        number: "0",
        complement: "",
        city: "Houston",
        state: "TX",
        zipcode: "77001",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const checkoutData = {
        clientId,
        products: [] as { productId: string }[],
      };

      const response = await request(app)
        .post("/checkout")
        .send(checkoutData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("No products selected");
    });

    it("should return error when product is out of stock", async () => {
      const clientId = "checkout-client-out-of-stock";
      await ClientModel.create({
        id: clientId,
        name: "Out of Stock Client",
        email: "outofstock@example.com",
        document: "11100022233",
        street: "Stock Street",
        number: "1",
        complement: "",
        city: "Phoenix",
        state: "AZ",
        zipcode: "85001",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const productId = "out-of-stock-product";
      await ProductModel.create({
        id: productId,
        name: "Out of Stock Product",
        description: "Product with no stock",
        purchasePrice: 100,
        salesPrice: 150,
        stock: 0, // No stock
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const checkoutData = {
        clientId,
        products: [{ productId }],
      };

      const response = await request(app)
        .post("/checkout")
        .send(checkoutData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("not available in stock");
    });
  });

  describe("Invoice Routes", () => {
    it("should find an invoice by id", async () => {
      // Create an invoice directly in the database
      const invoiceId = "invoice-1";
      await InvoiceModel.create({
        id: invoiceId,
        name: "Invoice Client",
        document: "12312312300",
        street: "Invoice Street",
        number: "300",
        complement: "Building A",
        city: "San Francisco",
        state: "CA",
        zipcode: "94102",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await InvoiceItemModel.create({
        id: "invoice-item-1",
        name: "Invoice Item 1",
        price: 100,
        invoiceId,
      });

      await InvoiceItemModel.create({
        id: "invoice-item-2",
        name: "Invoice Item 2",
        price: 200,
        invoiceId,
      });

      const response = await request(app).get(`/invoice/${invoiceId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(invoiceId);
      expect(response.body.name).toBe("Invoice Client");
      expect(response.body.document).toBe("12312312300");
      expect(response.body.address.street).toBe("Invoice Street");
      expect(response.body.address.number).toBe("300");
      expect(response.body.address.city).toBe("San Francisco");
      expect(response.body.items).toHaveLength(2);
      expect(response.body.items[0].name).toBe("Invoice Item 1");
      expect(response.body.items[0].price).toBe(100);
      expect(response.body.items[1].name).toBe("Invoice Item 2");
      expect(response.body.items[1].price).toBe(200);
    });

    it("should return 404 when invoice not found", async () => {
      const response = await request(app).get("/invoice/non-existent-invoice");

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });
  });

  describe("Integration: Full Order Flow", () => {
    it("should complete a full order flow: create product, create client, checkout, retrieve invoice", async () => {
      // Step 1: Create a product
      const productResponse = await request(app)
        .post("/products")
        .send({
          id: "flow-product",
          name: "Flow Product",
          description: "Product for full flow test",
          purchasePrice: 80,
          salesPrice: 120,
          stock: 100,
        });

      expect(productResponse.status).toBe(201);

      // Step 2: Create a client
      const clientResponse = await request(app)
        .post("/clients")
        .send({
          id: "flow-client",
          name: "Flow Client",
          email: "flow@example.com",
          document: "77788899900",
          address: {
            street: "Flow Street",
            number: "500",
            complement: "Floor 5",
            city: "Seattle",
            state: "WA",
            zipCode: "98101",
          },
        });

      expect(clientResponse.status).toBe(201);

      // Step 3: Place an order (checkout)
      const checkoutResponse = await request(app)
        .post("/checkout")
        .send({
          clientId: "flow-client",
          products: [{ productId: "flow-product" }],
        });

      expect(checkoutResponse.status).toBe(201);
      expect(checkoutResponse.body.total).toBe(120);
      expect(checkoutResponse.body.invoice).toBeDefined();

      const invoiceId = checkoutResponse.body.invoice.id;

      // Step 4: Retrieve the invoice
      const invoiceResponse = await request(app).get(`/invoice/${invoiceId}`);

      expect(invoiceResponse.status).toBe(200);
      expect(invoiceResponse.body.id).toBe(invoiceId);
      expect(invoiceResponse.body.name).toBe("Flow Client");
      expect(invoiceResponse.body.document).toBe("77788899900");
      expect(invoiceResponse.body.items).toHaveLength(1);
      expect(invoiceResponse.body.items[0].name).toBe("Flow Product");
      expect(invoiceResponse.body.items[0].price).toBe(120);
    });
  });
});
