import "reflect-metadata";
import { createApp } from "./app";
import { initDatabase } from "./database/sequelize";

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    console.log("Initializing database...");
    await initDatabase();
    console.log("Database initialized successfully");

    const app = createApp();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
