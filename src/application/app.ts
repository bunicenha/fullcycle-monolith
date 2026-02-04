import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import productRouter from "./routes/product.route";
import clientRouter from "./routes/client.route";
import checkoutRouter from "./routes/checkout.route";
import invoiceRouter from "./routes/invoice.route";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FullCycle Monolith API",
      version: "1.0.0",
      description: "Monolithic application API with DDD architecture",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [
      { name: "Products", description: "Product management endpoints" },
      { name: "Clients", description: "Client management endpoints" },
      { name: "Checkout", description: "Order placement endpoints" },
      { name: "Invoice", description: "Invoice management endpoints" },
    ],
  },
  apis: ["./src/application/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export function createApp(): Express {
  const app = express();

  app.use(express.json());

  // Swagger documentation
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Health check
  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API routes
  app.use("/products", productRouter);
  app.use("/clients", clientRouter);
  app.use("/checkout", checkoutRouter);
  app.use("/invoice", invoiceRouter);

  return app;
}
