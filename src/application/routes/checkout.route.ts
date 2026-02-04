import { Router, Request, Response } from "express";
import CheckoutFacadeFactory from "../../modules/checkout/factory/checkout.facade.factory";

const checkoutRouter = Router();

/**
 * @swagger
 * /checkout:
 *   post:
 *     summary: Place a new order
 *     tags: [Checkout]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - products
 *             properties:
 *               clientId:
 *                 type: string
 *                 description: Client ID
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: Product ID
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Order ID
 *                 total:
 *                   type: number
 *                   description: Order total
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
checkoutRouter.post("/", async (req: Request, res: Response) => {
  try {
    const facade = CheckoutFacadeFactory.create();
    const { clientId, products } = req.body;

    const result = await facade.placeOrder({
      clientId,
      products,
    });

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export default checkoutRouter;
