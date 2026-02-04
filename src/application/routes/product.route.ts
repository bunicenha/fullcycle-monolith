import { Router, Request, Response } from "express";
import ProductAdmFacadeFactory from "../../modules/product-adm/factory/facade.factory";

const productRouter = Router();

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - purchasePrice
 *               - salesPrice
 *               - stock
 *             properties:
 *               id:
 *                 type: string
 *                 description: Optional product ID
 *               name:
 *                 type: string
 *                 description: Product name
 *               description:
 *                 type: string
 *                 description: Product description
 *               purchasePrice:
 *                 type: number
 *                 description: Purchase price
 *               salesPrice:
 *                 type: number
 *                 description: Sales price (for catalog)
 *               stock:
 *                 type: number
 *                 description: Stock quantity
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
productRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { id, name, description, purchasePrice, salesPrice, stock } = req.body;

    // Use ProductModel directly to include salesPrice
    const { ProductModel } = await import("../../modules/product-adm/repository/product.model");
    
    const productId = id || require("uuid").v4();
    await ProductModel.create({
      id: productId,
      name,
      description,
      purchasePrice,
      salesPrice: salesPrice || purchasePrice,
      stock,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      message: "Product created successfully",
      product: { id: productId, name, description, purchasePrice, salesPrice, stock },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export default productRouter;
